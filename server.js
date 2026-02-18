import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import PDFDocument from 'pdfkit';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Servir arquivos estáticos do React build
const clientBuildPath = join(__dirname, 'client', 'build');
if (fs.existsSync(clientBuildPath)) {
  console.log('Servindo arquivos estáticos do React build');
  app.use(express.static(clientBuildPath));
} else {
  console.warn('Diretório de build do React não encontrado em:', clientBuildPath);
}

// Health check endpoint
app.get('/health', (req, res) => {
  console.log('Health check solicitado');
  res.json({ status: 'ok', dbReady, timestamp: new Date().toISOString() });
});

// Ping endpoint (sem dependência de banco)
app.get('/ping', (req, res) => {
  console.log('Ping solicitado');
  res.json({ pong: true });
});

const dbPath = join(__dirname, 'database.db');
const logosDir = join(__dirname, 'logos');

if (!fs.existsSync(logosDir)) {
  fs.mkdirSync(logosDir, { recursive: true });
}

let db;

function initializeDb() {
  console.log('Tentando conectar ao banco de dados:', dbPath);
  
  db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Erro ao conectar ao banco de dados:', err);
      // Tentar remover banco corrompido e criar novo
      if (fs.existsSync(dbPath)) {
        console.log('Removendo banco de dados corrompido...');
        fs.unlinkSync(dbPath);
        initializeDb();
      } else {
        console.error('Falha crítica ao conectar ao banco de dados');
        process.exit(1);
      }
    } else {
      console.log('Conectado ao banco de dados SQLite');
      db.configure('busyTimeout', 5000);
      initializeDatabase();
    }
  });
}

initializeDb();

let dbReady = false;

function initializeDatabase() {
  console.log('Iniciando banco de dados...');
  
  try {
    // Criar tabelas
    db.run(`CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      senha TEXT NOT NULL,
      nome TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS empresas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      cnpj TEXT,
      endereco TEXT,
      telefone TEXT,
      telefone_celular TEXT,
      telefone_fixo TEXT,
      email TEXT,
      logo TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS clientes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      cpf_cnpj TEXT,
      endereco TEXT,
      telefone TEXT,
      email TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS produtos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      descricao TEXT,
      preco REAL NOT NULL,
      tipo TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS ordens_servico (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      numero TEXT UNIQUE NOT NULL,
      empresa_id INTEGER NOT NULL,
      cliente_id INTEGER NOT NULL,
      data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
      data_conclusao DATE,
      status TEXT DEFAULT 'aberta',
      descricao TEXT,
      observacoes TEXT,
      total REAL DEFAULT 0,
      FOREIGN KEY (empresa_id) REFERENCES empresas(id),
      FOREIGN KEY (cliente_id) REFERENCES clientes(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS itens_ordem (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ordem_id INTEGER NOT NULL,
      produto_id INTEGER,
      descricao TEXT,
      quantidade REAL DEFAULT 1,
      valor_unitario REAL NOT NULL,
      subtotal REAL NOT NULL,
      FOREIGN KEY (ordem_id) REFERENCES ordens_servico(id),
      FOREIGN KEY (produto_id) REFERENCES produtos(id)
    )`);

    // Adicionar colunas se não existirem
    db.run(`ALTER TABLE empresas ADD COLUMN telefone_celular TEXT`, (err) => {
      if (err && err.message.includes('duplicate column')) {
        console.log('Coluna telefone_celular já existe');
      }
    });

    db.run(`ALTER TABLE empresas ADD COLUMN telefone_fixo TEXT`, (err) => {
      if (err && err.message.includes('duplicate column')) {
        console.log('Coluna telefone_fixo já existe');
      }
    });

    // Criar usuário admin padrão
    db.get('SELECT * FROM usuarios WHERE role = ?', ['admin'], (err, user) => {
      if (!user) {
        const adminSenha = crypto.createHash('sha256').update('admin123').digest('hex');
        db.run(
          'INSERT INTO usuarios (email, senha, nome, role) VALUES (?, ?, ?, ?)',
          ['admin@manageros.com', adminSenha, 'Administrador', 'admin'],
          (err) => {
            if (!err) {
              console.log('Usuário admin criado: admin@manageros.com / admin123');
            }
          }
        );
      }
    });

    dbReady = true;
    console.log('Banco de dados inicializado com sucesso');
  } catch (error) {
    console.error('Erro ao inicializar banco de dados:', error);
  }
}

const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

app.post('/api/empresas', async (req, res) => {
  try {
    const { nome, cnpj, endereco, telefone, telefone_celular, telefone_fixo, email, logo } = req.body;
    console.log('Dados recebidos:', { nome, cnpj, endereco, telefone, telefone_celular, telefone_fixo, email });
    let logoPath = null;

    if (logo && logo.startsWith('data:')) {
      const base64Data = logo.replace(/^data:image\/\w+;base64,/, '');
      const filename = `logo_${Date.now()}.png`;
      logoPath = filename;
      fs.writeFileSync(join(logosDir, filename), Buffer.from(base64Data, 'base64'));
    }

    const result = await dbRun(
      'INSERT INTO empresas (nome, cnpj, endereco, telefone, telefone_celular, telefone_fixo, email, logo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [nome, cnpj, endereco, telefone, telefone_celular, telefone_fixo, email, logoPath]
    );

    res.json({ id: result.id, message: 'Empresa cadastrada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/empresas', async (req, res) => {
  try {
    const empresas = await dbAll('SELECT * FROM empresas ORDER BY nome');
    const empresasComLogo = empresas.map(emp => {
      if (emp.logo) {
        const logoPath = join(logosDir, emp.logo);
        if (fs.existsSync(logoPath)) {
          const logoData = fs.readFileSync(logoPath, 'base64');
          emp.logoData = `data:image/png;base64,${logoData}`;
        }
      }
      return emp;
    });
    res.json(empresasComLogo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/empresas/:id', async (req, res) => {
  try {
    const empresa = await dbGet('SELECT * FROM empresas WHERE id = ?', [req.params.id]);
    if (empresa && empresa.logo) {
      const logoPath = join(logosDir, empresa.logo);
      if (fs.existsSync(logoPath)) {
        const logoData = fs.readFileSync(logoPath, 'base64');
        empresa.logoData = `data:image/png;base64,${logoData}`;
      }
    }
    res.json(empresa);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/empresas/:id', async (req, res) => {
  try {
    const { nome, cnpj, endereco, telefone, telefone_celular, telefone_fixo, email, logo } = req.body;
    console.log('Atualizando empresa ID:', req.params.id);
    console.log('Dados recebidos:', { nome, cnpj, endereco, telefone, telefone_celular, telefone_fixo, email });
    let logoPath = null;

    const empresa = await dbGet('SELECT logo FROM empresas WHERE id = ?', [req.params.id]);
    logoPath = empresa.logo;

    if (logo && logo.startsWith('data:')) {
      if (logoPath && fs.existsSync(join(logosDir, logoPath))) {
        fs.unlinkSync(join(logosDir, logoPath));
      }
      const base64Data = logo.replace(/^data:image\/\w+;base64,/, '');
      const filename = `logo_${Date.now()}.png`;
      logoPath = filename;
      fs.writeFileSync(join(logosDir, filename), Buffer.from(base64Data, 'base64'));
    }

    await dbRun(
      'UPDATE empresas SET nome = ?, cnpj = ?, endereco = ?, telefone = ?, telefone_celular = ?, telefone_fixo = ?, email = ?, logo = ? WHERE id = ?',
      [nome, cnpj, endereco, telefone, telefone_celular, telefone_fixo, email, logoPath, req.params.id]
    );

    console.log('Empresa atualizada com sucesso');
    res.json({ message: 'Empresa atualizada com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar empresa:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/empresas/:id', async (req, res) => {
  try {
    const empresa = await dbGet('SELECT logo FROM empresas WHERE id = ?', [req.params.id]);
    if (empresa && empresa.logo && fs.existsSync(join(logosDir, empresa.logo))) {
      fs.unlinkSync(join(logosDir, empresa.logo));
    }
    await dbRun('DELETE FROM empresas WHERE id = ?', [req.params.id]);
    res.json({ message: 'Empresa deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/clientes', async (req, res) => {
  try {
    const { nome, cpf_cnpj, endereco, telefone, email } = req.body;
    const result = await dbRun(
      'INSERT INTO clientes (nome, cpf_cnpj, endereco, telefone, email) VALUES (?, ?, ?, ?, ?)',
      [nome, cpf_cnpj, endereco, telefone, email]
    );
    res.json({ id: result.id, message: 'Cliente cadastrado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/clientes', async (req, res) => {
  try {
    const clientes = await dbAll('SELECT * FROM clientes ORDER BY nome');
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/clientes/:id', async (req, res) => {
  try {
    const cliente = await dbGet('SELECT * FROM clientes WHERE id = ?', [req.params.id]);
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/clientes/:id', async (req, res) => {
  try {
    const { nome, cpf_cnpj, endereco, telefone, email } = req.body;
    await dbRun(
      'UPDATE clientes SET nome = ?, cpf_cnpj = ?, endereco = ?, telefone = ?, email = ? WHERE id = ?',
      [nome, cpf_cnpj, endereco, telefone, email, req.params.id]
    );
    res.json({ message: 'Cliente atualizado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/clientes/:id', async (req, res) => {
  try {
    await dbRun('DELETE FROM clientes WHERE id = ?', [req.params.id]);
    res.json({ message: 'Cliente deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/produtos', async (req, res) => {
  try {
    const { nome, descricao, preco, tipo } = req.body;
    const result = await dbRun(
      'INSERT INTO produtos (nome, descricao, preco, tipo) VALUES (?, ?, ?, ?)',
      [nome, descricao, preco, tipo]
    );
    res.json({ id: result.id, message: 'Produto cadastrado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/produtos', async (req, res) => {
  try {
    const produtos = await dbAll('SELECT * FROM produtos ORDER BY nome');
    res.json(produtos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/produtos/:id', async (req, res) => {
  try {
    const produto = await dbGet('SELECT * FROM produtos WHERE id = ?', [req.params.id]);
    res.json(produto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/produtos/:id', async (req, res) => {
  try {
    const { nome, descricao, preco, tipo } = req.body;
    await dbRun(
      'UPDATE produtos SET nome = ?, descricao = ?, preco = ?, tipo = ? WHERE id = ?',
      [nome, descricao, preco, tipo, req.params.id]
    );
    res.json({ message: 'Produto atualizado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/produtos/:id', async (req, res) => {
  try {
    await dbRun('DELETE FROM produtos WHERE id = ?', [req.params.id]);
    res.json({ message: 'Produto deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/ordens', async (req, res) => {
  try {
    const { numero, empresa_id, cliente_id, descricao, observacoes, itens } = req.body;
    
    const result = await dbRun(
      'INSERT INTO ordens_servico (numero, empresa_id, cliente_id, descricao, observacoes) VALUES (?, ?, ?, ?, ?)',
      [numero, empresa_id, cliente_id, descricao, observacoes]
    );

    let total = 0;
    if (itens && itens.length > 0) {
      for (const item of itens) {
        const subtotal = item.quantidade * item.valor_unitario;
        total += subtotal;
        await dbRun(
          'INSERT INTO itens_ordem (ordem_id, produto_id, descricao, quantidade, valor_unitario, subtotal) VALUES (?, ?, ?, ?, ?, ?)',
          [result.id, item.produto_id || null, item.descricao, item.quantidade, item.valor_unitario, subtotal]
        );
      }
      await dbRun('UPDATE ordens_servico SET total = ? WHERE id = ?', [total, result.id]);
    }

    res.json({ id: result.id, message: 'Ordem de serviço criada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/ordens', async (req, res) => {
  try {
    const ordens = await dbAll(`
      SELECT os.*, e.nome as empresa_nome, c.nome as cliente_nome
      FROM ordens_servico os
      JOIN empresas e ON os.empresa_id = e.id
      JOIN clientes c ON os.cliente_id = c.id
      ORDER BY os.data_criacao DESC
    `);
    res.json(ordens);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/ordens/:id', async (req, res) => {
  try {
    const ordem = await dbGet(`
      SELECT os.*, e.nome as empresa_nome, e.cnpj, e.endereco, e.telefone, e.email, e.logo,
             c.nome as cliente_nome, c.cpf_cnpj, c.endereco as cliente_endereco, c.telefone as cliente_telefone, c.email as cliente_email
      FROM ordens_servico os
      JOIN empresas e ON os.empresa_id = e.id
      JOIN clientes c ON os.cliente_id = c.id
      WHERE os.id = ?
    `, [req.params.id]);

    if (ordem && ordem.logo) {
      const logoPath = join(logosDir, ordem.logo);
      if (fs.existsSync(logoPath)) {
        const logoData = fs.readFileSync(logoPath, 'base64');
        ordem.logoData = `data:image/png;base64,${logoData}`;
      }
    }

    const itens = await dbAll('SELECT * FROM itens_ordem WHERE ordem_id = ?', [req.params.id]);
    ordem.itens = itens;

    res.json(ordem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/ordens/:id', async (req, res) => {
  try {
    const { numero, empresa_id, cliente_id, descricao, observacoes, status, data_conclusao, itens } = req.body;

    await dbRun(
      'UPDATE ordens_servico SET numero = ?, empresa_id = ?, cliente_id = ?, descricao = ?, observacoes = ?, status = ?, data_conclusao = ? WHERE id = ?',
      [numero, empresa_id, cliente_id, descricao, observacoes, status, data_conclusao, req.params.id]
    );

    await dbRun('DELETE FROM itens_ordem WHERE ordem_id = ?', [req.params.id]);

    let total = 0;
    if (itens && itens.length > 0) {
      for (const item of itens) {
        const subtotal = item.quantidade * item.valor_unitario;
        total += subtotal;
        await dbRun(
          'INSERT INTO itens_ordem (ordem_id, produto_id, descricao, quantidade, valor_unitario, subtotal) VALUES (?, ?, ?, ?, ?, ?)',
          [req.params.id, item.produto_id || null, item.descricao, item.quantidade, item.valor_unitario, subtotal]
        );
      }
    }

    await dbRun('UPDATE ordens_servico SET total = ? WHERE id = ?', [total, req.params.id]);

    res.json({ message: 'Ordem de serviço atualizada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/ordens/:id', async (req, res) => {
  try {
    await dbRun('DELETE FROM itens_ordem WHERE ordem_id = ?', [req.params.id]);
    await dbRun('DELETE FROM ordens_servico WHERE id = ?', [req.params.id]);
    res.json({ message: 'Ordem de serviço deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/imprimir/:id', async (req, res) => {
  try {
    const ordem = await dbGet(`
      SELECT os.*, e.nome as empresa_nome, e.cnpj, e.endereco, e.telefone, e.telefone_celular, e.telefone_fixo, e.email, e.logo,
             c.nome as cliente_nome, c.cpf_cnpj, c.endereco as cliente_endereco, c.telefone as cliente_telefone, c.email as cliente_email
      FROM ordens_servico os
      JOIN empresas e ON os.empresa_id = e.id
      JOIN clientes c ON os.cliente_id = c.id
      WHERE os.id = ?
    `, [req.params.id]);

    if (!ordem) {
      return res.status(404).send('<html><body><h1>Ordem não encontrada</h1></body></html>');
    }

    console.log('Dados da ordem para impressão:', {
      empresa_nome: ordem.empresa_nome,
      telefone: ordem.telefone,
      telefone_celular: ordem.telefone_celular,
      telefone_fixo: ordem.telefone_fixo
    });

    let logoData = '';
    if (ordem.logo) {
      const logoPath = join(logosDir, ordem.logo);
      if (fs.existsSync(logoPath)) {
        logoData = fs.readFileSync(logoPath, 'base64');
      }
    }

    const itens = await dbAll('SELECT * FROM itens_ordem WHERE ordem_id = ?', [req.params.id]);

    const total = itens.reduce((sum, item) => sum + (item.subtotal || 0), 0);

    const itensHtml = itens.map(item => `
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">${item.descricao}</td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${parseFloat(item.quantidade).toFixed(2)}</td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">R$ ${parseFloat(item.valor_unitario).toFixed(2)}</td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">R$ ${parseFloat(item.subtotal).toFixed(2)}</td>
      </tr>
    `).join('');

    const html = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
        <meta http-equiv="Pragma" content="no-cache">
        <meta http-equiv="Expires" content="0">
        <title>Ordem de Serviço ${ordem.numero}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          html, body {
            width: 100%;
            height: 100%;
          }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 15px;
            background-color: white;
            color: #333;
            line-height: 1.6;
          }
          .container {
            max-width: 900px;
            margin: 0 auto;
            background-color: white;
            padding: 30px;
          }
          .header {
            margin-bottom: 30px;
            border-bottom: 2px solid #667eea;
            padding-bottom: 15px;
          }
          .header-top {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 10px;
          }
          .logo {
            max-width: 80px;
            max-height: 80px;
            object-fit: contain;
          }
          .company-info {
            flex: 1;
            margin-left: 15px;
          }
          .company-info h1 {
            margin: 0 0 5px 0;
            color: #2c3e50;
            font-size: 16px;
            font-weight: 700;
          }
          .company-info p {
            margin: 1px 0;
            color: #555;
            font-size: 8px;
            line-height: 1.1;
          }
          .order-number {
            text-align: right;
          }
          .order-number > div:first-child {
            font-size: 12px;
            color: #666;
            font-weight: 600;
            margin-bottom: 6px;
            text-transform: uppercase;
          }
          .order-number > div:last-child {
            font-size: 26px;
            color: #667eea;
            font-weight: 700;
          }
          .content {
            margin: 25px 0;
          }
          .section {
            margin-bottom: 25px;
            page-break-inside: avoid;
          }
          .section-title {
            background-color: #667eea;
            color: white;
            padding: 10px 15px;
            margin-bottom: 15px;
            font-weight: 600;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 15px;
          }
          .info-block {
            padding: 12px;
            background-color: #f8f9fa;
            border-left: 3px solid #667eea;
          }
          .info-block label {
            font-weight: 600;
            color: #2c3e50;
            display: block;
            margin-bottom: 4px;
            font-size: 12px;
          }
          .info-block p {
            margin: 0;
            color: #555;
            font-size: 13px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
            font-size: 12px;
          }
          th {
            background-color: #667eea;
            color: white;
            padding: 10px;
            text-align: left;
            font-weight: 600;
            border: 1px solid #667eea;
            text-transform: uppercase;
            font-size: 11px;
          }
          td {
            border: 1px solid #ddd;
            padding: 9px 10px;
            background-color: white;
          }
          tbody tr:nth-child(even) td {
            background-color: #f9f9f9;
          }
          .total-row td {
            background-color: #f0f0f0 !important;
            font-weight: 600;
            border: 1px solid #667eea;
            padding: 11px 10px;
          }
          .footer {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 1px solid #ddd;
            text-align: center;
            color: #999;
            font-size: 10px;
          }
          @media print {
            html, body {
              width: 100%;
              height: auto;
              margin: 0;
              padding: 0;
            }
            body {
              background-color: white;
              padding: 0;
              margin: 0;
            }
            .container {
              max-width: 100%;
              margin: 0;
              padding: 20px;
              box-shadow: none;
            }
            .header {
              margin-bottom: 30px;
              padding-bottom: 15px;
            }
            .section {
              page-break-inside: avoid;
            }
            table {
              page-break-inside: avoid;
            }
            .footer {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="header-top">
              ${logoData ? `<img src="data:image/png;base64,${logoData}" alt="Logo" class="logo">` : ''}
              <div class="company-info">
                <h1>${ordem.empresa_nome}</h1>
              </div>
              <div class="order-number">
                <div>ORDEM DE SERVIÇO</div>
                <div>${ordem.numero}</div>
              </div>
            </div>
            <div style="margin-top: 8px;">
              <p><strong>CNPJ:</strong> ${ordem.cnpj || '-'}</p>
              <p><strong>Endereço:</strong> ${ordem.endereco || '-'}</p>
              <p><strong>Telefone Celular:</strong> ${ordem.telefone_celular || '-'}</p>
              <p><strong>Telefone Fixo:</strong> ${ordem.telefone_fixo || '-'}</p>
              <p><strong>Telefone:</strong> ${ordem.telefone || '-'}</p>
              <p><strong>Email:</strong> ${ordem.email || '-'}</p>
            </div>
          </div>

          <div class="content">
            <div class="section">
              <div class="section-title">Informações da Ordem</div>
              <div class="info-grid">
                <div class="info-block">
                  <label>Data de Criação:</label>
                  <p>${new Date(ordem.data_criacao).toLocaleDateString('pt-BR')}</p>
                </div>
                <div class="info-block">
                  <label>Status:</label>
                  <p>${ordem.status}</p>
                </div>
              </div>
            </div>

            <div class="section">
              <div class="section-title">Dados do Cliente</div>
              <div class="info-grid">
                <div class="info-block">
                  <label>Nome:</label>
                  <p>${ordem.cliente_nome}</p>
                </div>
                <div class="info-block">
                  <label>CPF/CNPJ:</label>
                  <p>${ordem.cpf_cnpj || '-'}</p>
                </div>
                <div class="info-block">
                  <label>Telefone:</label>
                  <p>${ordem.cliente_telefone || '-'}</p>
                </div>
                <div class="info-block">
                  <label>Email:</label>
                  <p>${ordem.cliente_email || '-'}</p>
                </div>
              </div>
              <div class="info-block">
                <label>Endereço:</label>
                <p>${ordem.cliente_endereco || '-'}</p>
              </div>
            </div>

            ${ordem.descricao ? `
            <div class="section">
              <div class="section-title">Descrição da Ordem</div>
              <p style="color: #555; line-height: 1.6;">${ordem.descricao}</p>
            </div>
            ` : ''}

            <div class="section">
              <div class="section-title">Itens da Ordem</div>
              <table>
                <thead>
                  <tr>
                    <th>Descrição</th>
                    <th style="text-align: center;">Quantidade</th>
                    <th style="text-align: right;">Valor Unitário</th>
                    <th style="text-align: right;">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  ${itensHtml}
                  <tr class="total-row">
                    <td colspan="3" style="text-align: right;">TOTAL:</td>
                    <td style="text-align: right;">R$ ${total.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            ${ordem.observacoes ? `
            <div class="section">
              <div class="section-title">Observações</div>
              <p style="color: #555; line-height: 1.6;">${ordem.observacoes}</p>
            </div>
            ` : ''}
          </div>

          <div class="footer">
            <p>Documento gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (error) {
    res.status(500).send(`<html><body><h1>Erro ao gerar impressão</h1><p>${error.message}</p></body></html>`);
  }
});

app.get('/pdf/:id', async (req, res) => {
  try {
    const ordem = await dbGet(`
      SELECT os.*, e.nome as empresa_nome, e.cnpj, e.endereco, e.telefone, e.telefone_celular, e.telefone_fixo, e.email, e.logo,
             c.nome as cliente_nome, c.cpf_cnpj, c.endereco as cliente_endereco, c.telefone as cliente_telefone, c.email as cliente_email
      FROM ordens_servico os
      JOIN empresas e ON os.empresa_id = e.id
      JOIN clientes c ON os.cliente_id = c.id
      WHERE os.id = ?
    `, [req.params.id]);

    if (!ordem) {
      return res.status(404).json({ error: 'Ordem não encontrada' });
    }

    console.log('Dados da ordem para PDF:', {
      empresa_nome: ordem.empresa_nome,
      telefone: ordem.telefone,
      telefone_celular: ordem.telefone_celular,
      telefone_fixo: ordem.telefone_fixo
    });

    const itens = await dbAll('SELECT * FROM itens_ordem WHERE ordem_id = ?', [req.params.id]);
    const total = itens.reduce((sum, item) => sum + (parseFloat(item.subtotal) || 0), 0);

    const doc = new PDFDocument({ margin: 30, size: 'A4', bufferPages: true });
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="ordem-servico-${ordem.numero}.pdf"`);
    
    doc.on('error', (err) => {
      console.error('Erro ao gerar PDF:', err);
    });
    
    doc.pipe(res);

    // Função para adicionar watermark em cada página
    const addWatermark = () => {
      if (ordem.logo) {
        const logoPath = join(logosDir, ordem.logo);
        if (fs.existsSync(logoPath)) {
          try {
            // Adicionar logo como watermark no fundo (opacidade reduzida)
            const watermarkWidth = 500;
            const watermarkHeight = (watermarkWidth * 756) / 1600;
            const watermarkX = (595 - watermarkWidth) / 2;
            const watermarkY = 500; // Posicionar mais para baixo na página
            
            doc.opacity(0.08); // Opacidade de 8% para não interferir com o texto
            doc.image(logoPath, watermarkX, watermarkY, { width: watermarkWidth, height: watermarkHeight });
            doc.opacity(1); // Restaurar opacidade normal
          } catch (e) {
            console.error('Erro ao adicionar watermark:', e);
          }
        }
      }
    };

    // Adicionar watermark na primeira página
    addWatermark();

    let yPos = 20;

    // Logo centralizado no topo
    if (ordem.logo) {
      const logoPath = join(logosDir, ordem.logo);
      if (fs.existsSync(logoPath)) {
        try {
          // Manter proporção original: 1600x756
          const logoWidth = 150;
          const logoHeight = (logoWidth * 756) / 1600; // Calcula altura mantendo proporção
          const logoX = (595 - logoWidth) / 2;
          doc.image(logoPath, logoX, yPos, { width: logoWidth, height: logoHeight });
          yPos += logoHeight + 15;
        } catch (e) {
          console.error('Erro ao carregar logo:', e);
          yPos += 20;
        }
      }
    }

    // Informações da empresa (centralizadas abaixo do logo)
    doc.fontSize(15).font('Helvetica-Bold').fillColor('#2c3e50').text(ordem.empresa_nome, 30, yPos, { width: 535, align: 'center' });
    yPos += 16;
    
    // Separador visual
    doc.strokeColor('#667eea').lineWidth(1).moveTo(150, yPos).lineTo(445, yPos).stroke();
    yPos += 12;
    
    // Dados da empresa em grid (2 colunas)
    const col1X = 30;
    const col2X = 310;
    const col1Width = 260;
    const col2Width = 255;
    
    // Linha 1: CNPJ | Telefone Celular
    doc.fontSize(8).font('Helvetica-Bold').fillColor('#667eea').text('CNPJ:', col1X, yPos);
    doc.fontSize(9).font('Helvetica').fillColor('black').text(ordem.cnpj || '-', col1X + 35, yPos, { width: col1Width - 35 });
    
    doc.fontSize(8).font('Helvetica-Bold').fillColor('#667eea').text('Telefone Celular:', col2X, yPos);
    doc.fontSize(9).font('Helvetica').fillColor('black').text(ordem.telefone_celular || '-', col2X + 90, yPos, { width: col2Width - 90 });
    yPos += 12;
    
    // Linha 2: Endereço | Telefone Fixo
    const enderecoStartY = yPos;
    doc.fontSize(8).font('Helvetica-Bold').fillColor('#667eea').text('Endereço:', col1X, yPos);
    const enderecoHeight = doc.heightOfString(ordem.endereco || '-', { width: col1Width - 50 });
    doc.fontSize(9).font('Helvetica').fillColor('black').text(ordem.endereco || '-', col1X + 50, yPos, { width: col1Width - 50 });
    
    doc.fontSize(8).font('Helvetica-Bold').fillColor('#667eea').text('Telefone Fixo:', col2X, enderecoStartY);
    doc.fontSize(9).font('Helvetica').fillColor('black').text(ordem.telefone_fixo || '-', col2X + 90, enderecoStartY, { width: col2Width - 90 });
    yPos = enderecoStartY + enderecoHeight + 8;
    
    // Linha 3: Email | Telefone
    doc.fontSize(8).font('Helvetica-Bold').fillColor('#667eea').text('Email:', col1X, yPos);
    doc.fontSize(9).font('Helvetica').fillColor('black').text(ordem.email || '-', col1X + 35, yPos, { width: col1Width - 35 });
    
    doc.fontSize(8).font('Helvetica-Bold').fillColor('#667eea').text('Telefone:', col2X, yPos);
    doc.fontSize(9).font('Helvetica').fillColor('black').text(ordem.telefone || '-', col2X + 90, yPos, { width: col2Width - 90 });
    yPos += 20;

    // Número da OS à direita (em uma posição fixa no topo)
    const osX = 400;
    let osY = 20;
    doc.fontSize(10).font('Helvetica-Bold').text('ORDEM DE SERVIÇO', osX, osY, { align: 'right', width: 165 });
    osY += 12;
    doc.fontSize(16).font('Helvetica-Bold').fillColor('#667eea').text(`#${ordem.numero}`, osX, osY, { align: 'right', width: 165 });
    osY += 18;
    doc.fontSize(8).font('Helvetica').fillColor('black').text(`Data: ${new Date(ordem.data_criacao).toLocaleDateString('pt-BR')}`, osX, osY, { align: 'right', width: 165 });
    osY += 10;
    doc.text(`Status: ${ordem.status}`, osX, osY, { align: 'right', width: 165 });

    // Linha divisória
    doc.moveTo(30, yPos).lineTo(565, yPos).stroke();
    yPos += 15;

    // Seção de dados do cliente com layout em grid
    doc.fontSize(11).font('Helvetica-Bold').fillColor('#667eea').text('DADOS DO CLIENTE', 30, yPos);
    yPos += 15;
    doc.fillColor('black').fontSize(9).font('Helvetica');
    
    // Grid 2 colunas para dados do cliente
    const colWidth = 260;
    const clienteY = yPos;
    
    // Coluna 1
    doc.font('Helvetica-Bold').fontSize(8).text('Nome:', 30, clienteY);
    doc.font('Helvetica').fontSize(9).text(ordem.cliente_nome, 30, clienteY + 12, { width: colWidth });
    
    doc.font('Helvetica-Bold').fontSize(8).text('CPF/CNPJ:', 30, clienteY + 28);
    doc.font('Helvetica').fontSize(9).text(ordem.cpf_cnpj || '-', 30, clienteY + 40, { width: colWidth });
    
    // Coluna 2
    doc.font('Helvetica-Bold').fontSize(8).text('Telefone:', 310, clienteY);
    doc.font('Helvetica').fontSize(9).text(ordem.cliente_telefone || '-', 310, clienteY + 12, { width: colWidth });
    
    doc.font('Helvetica-Bold').fontSize(8).text('Email:', 310, clienteY + 28);
    doc.font('Helvetica').fontSize(9).text(ordem.cliente_email || '-', 310, clienteY + 40, { width: colWidth });
    
    // Endereço em linha cheia
    yPos = clienteY + 60;
    doc.font('Helvetica-Bold').fontSize(8).text('Endereço:', 30, yPos);
    doc.font('Helvetica').fontSize(9).text(ordem.cliente_endereco || '-', 30, yPos + 12, { width: 535 });
    yPos += 30;

    // Descrição da ordem (sem fundo para aparecer a marca d'água)
    if (ordem.descricao) {
      doc.fillColor('#667eea').fontSize(11).font('Helvetica-Bold').text('DESCRIÇÃO DA ORDEM', 30, yPos);
      yPos += 15;
      doc.fillColor('black').fontSize(9).font('Helvetica').text(ordem.descricao, 30, yPos, { width: 535, align: 'left' });
      yPos += 50;
    }

    // Tabela de itens
    doc.fontSize(11).font('Helvetica-Bold').text('ITENS DA ORDEM', 30, yPos);
    yPos += 15;

    const tableY = yPos;
    const rowHeight = 18;
    const colDescricao = 30;
    const colQtd = 320;
    const colValor = 400;
    const colSubtotal = 480;

    // Cabeçalho da tabela
    doc.fillColor('#667eea').rect(30, tableY, 535, rowHeight).fill();
    doc.fillColor('white').fontSize(9).font('Helvetica-Bold');
    doc.text('Descrição', colDescricao + 5, tableY + 4, { width: 280 });
    doc.text('Qtd', colQtd, tableY + 4, { width: 70, align: 'center' });
    doc.text('Valor Unit.', colValor, tableY + 4, { width: 70, align: 'right' });
    doc.text('Subtotal', colSubtotal, tableY + 4, { width: 70, align: 'right' });

    yPos = tableY + rowHeight;
    doc.fillColor('black').font('Helvetica').fontSize(8);

    // Linhas da tabela
    itens.forEach((item, index) => {
      if (yPos > 720) {
        doc.addPage();
        addWatermark(); // Adicionar watermark na nova página
        yPos = 30;
      }

      const bgColor = index % 2 === 0 ? '#f9f9f9' : 'white';
      doc.fillColor(bgColor).rect(30, yPos, 535, rowHeight).fill();
      
      doc.fillColor('black');
      doc.text(item.descricao || '', colDescricao + 5, yPos + 4, { width: 280 });
      doc.text(parseFloat(item.quantidade || 0).toFixed(2), colQtd, yPos + 4, { width: 70, align: 'center' });
      doc.text(`R$ ${parseFloat(item.valor_unitario || 0).toFixed(2)}`, colValor, yPos + 4, { width: 70, align: 'right' });
      doc.text(`R$ ${parseFloat(item.subtotal || 0).toFixed(2)}`, colSubtotal, yPos + 4, { width: 70, align: 'right' });

      yPos += rowHeight;
    });

    // Linha de total
    doc.fillColor('#e8eaf6').rect(30, yPos, 535, rowHeight).fill();
    doc.fillColor('black').font('Helvetica-Bold').fontSize(9);
    doc.text('TOTAL:', colValor, yPos + 4, { width: 70, align: 'right' });
    doc.text(`R$ ${total.toFixed(2)}`, colSubtotal, yPos + 4, { width: 70, align: 'right' });

    yPos += rowHeight + 15;

    // Observações
    if (ordem.observacoes) {
      doc.fontSize(11).font('Helvetica-Bold').text('OBSERVAÇÕES', 30, yPos);
      yPos += 12;
      doc.fontSize(9).font('Helvetica').text(ordem.observacoes, 30, yPos, { width: 505 });
      yPos += 40;
    }

    // Rodapé
    doc.fontSize(8).fillColor('#999').text(`Documento gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`, 30, 750, { width: 505, align: 'center' });

    doc.end();
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    res.status(500).json({ error: error.message });
  }
});

// Função para hash de senha
function hashPassword(senha) {
  return crypto.createHash('sha256').update(senha).digest('hex');
}

// Rota de registro (apenas admin pode criar usuários)
app.post('/api/auth/register', (req, res) => {
  const { email, senha, nome, adminId } = req.body;

  if (!email || !senha || !nome) {
    return res.status(400).json({ error: 'Email, senha e nome são obrigatórios' });
  }

  if (!adminId) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  // Verificar se o usuário é admin
  db.get('SELECT role FROM usuarios WHERE id = ?', [adminId], (err, user) => {
    if (err || !user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Apenas administradores podem criar usuários' });
    }

    const senhaHash = hashPassword(senha);

    db.run(
      'INSERT INTO usuarios (email, senha, nome, role) VALUES (?, ?, ?, ?)',
      [email, senhaHash, nome, 'user'],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ error: 'Email já cadastrado' });
          }
          return res.status(500).json({ error: 'Erro ao registrar usuário' });
        }
        res.json({ id: this.lastID, email, nome, role: 'user' });
      }
    );
  });
});

// Rota de login
app.post('/api/auth/login', (req, res) => {
  const { email, senha } = req.body;

  console.log('Tentativa de login:', email);

  if (!email || !senha) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }

  const senhaHash = hashPassword(senha);
  console.log('Hash da senha:', senhaHash.substring(0, 10) + '...');

  db.get(
    'SELECT id, email, nome, role FROM usuarios WHERE email = ? AND senha = ?',
    [email, senhaHash],
    (err, user) => {
      if (err) {
        console.error('Erro ao fazer login:', err);
        return res.status(500).json({ error: 'Erro ao fazer login: ' + err.message });
      }

      if (!user) {
        console.log('Usuário não encontrado ou senha incorreta');
        return res.status(401).json({ error: 'Email ou senha incorretos' });
      }

      console.log('Login bem-sucedido:', email);
      res.json({ id: user.id, email: user.email, nome: user.nome, role: user.role });
    }
  );
});

// Rota para verificar se usuário está autenticado
app.get('/api/auth/me', (req, res) => {
  const userId = req.headers['x-user-id'];
  
  if (!userId) {
    return res.status(401).json({ error: 'Não autenticado' });
  }

  db.get(
    'SELECT id, email, nome FROM usuarios WHERE id = ?',
    [userId],
    (err, user) => {
      if (err || !user) {
        return res.status(401).json({ error: 'Usuário não encontrado' });
      }
      res.json(user);
    }
  );
});

// Rota para listar todos os usuários (apenas admin)
app.get('/api/usuarios', (req, res) => {
  const userId = req.headers['x-user-id'];
  
  if (!userId) {
    return res.status(401).json({ error: 'Não autenticado' });
  }

  // Verificar se é admin
  db.get('SELECT role FROM usuarios WHERE id = ?', [userId], (err, user) => {
    if (err || !user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Apenas administradores podem acessar' });
    }

    db.all(
      'SELECT id, email, nome, role, created_at FROM usuarios ORDER BY created_at DESC',
      (err, usuarios) => {
        if (err) {
          return res.status(500).json({ error: 'Erro ao listar usuários' });
        }
        res.json(usuarios);
      }
    );
  });
});

// Rota para deletar usuário (apenas admin)
app.delete('/api/usuarios/:id', (req, res) => {
  const userId = req.headers['x-user-id'];
  const usuarioId = req.params.id;
  
  if (!userId) {
    return res.status(401).json({ error: 'Não autenticado' });
  }

  // Verificar se é admin
  db.get('SELECT role FROM usuarios WHERE id = ?', [userId], (err, user) => {
    if (err || !user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Apenas administradores podem deletar usuários' });
    }

    // Não permitir deletar admin
    db.get('SELECT role FROM usuarios WHERE id = ?', [usuarioId], (err, usuarioDeleta) => {
      if (usuarioDeleta && usuarioDeleta.role === 'admin') {
        return res.status(403).json({ error: 'Não é possível deletar administradores' });
      }

      db.run('DELETE FROM usuarios WHERE id = ?', [usuarioId], function(err) {
        if (err) {
          return res.status(500).json({ error: 'Erro ao deletar usuário' });
        }
        res.json({ message: 'Usuário deletado com sucesso' });
      });
    });
  });
});

// Rota raiz que redireciona para o frontend
app.get('/', (req, res) => {
  res.json({ message: 'API Manager OS - Acesse http://localhost:3000 para usar o sistema' });
});

// Rota de debug para verificar usuários (remover em produção)
app.get('/api/debug/usuarios', (req, res) => {
  db.all('SELECT id, email, nome, role FROM usuarios', (err, usuarios) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(usuarios);
  });
});

// Rota de debug para verificar empresas e seus telefones
app.get('/api/debug/empresas', (req, res) => {
  db.all('SELECT id, nome, cnpj, telefone, telefone_celular, telefone_fixo, email FROM empresas', (err, empresas) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(empresas);
  });
});

// Rota de debug para verificar dados de uma ordem específica
app.get('/api/debug/ordem/:id', async (req, res) => {
  try {
    const ordem = await dbGet(`
      SELECT os.*, e.nome as empresa_nome, e.cnpj, e.endereco, e.telefone, e.telefone_celular, e.telefone_fixo, e.email, e.logo,
             c.nome as cliente_nome, c.cpf_cnpj, c.endereco as cliente_endereco, c.telefone as cliente_telefone, c.email as cliente_email
      FROM ordens_servico os
      JOIN empresas e ON os.empresa_id = e.id
      JOIN clientes c ON os.cliente_id = c.id
      WHERE os.id = ?
    `, [req.params.id]);

    if (!ordem) {
      return res.status(404).json({ error: 'Ordem não encontrada' });
    }

    res.json({
      empresa_nome: ordem.empresa_nome,
      telefone: ordem.telefone,
      telefone_celular: ordem.telefone_celular,
      telefone_fixo: ordem.telefone_fixo,
      email: ordem.email
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Servir index.html para rotas não encontradas (React Router)
app.get('*', (req, res) => {
  const indexPath = join(clientBuildPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({ error: 'Rota não encontrada' });
  }
});

// Iniciar servidor imediatamente
console.log('Iniciando servidor na porta', PORT);
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando em http://0.0.0.0:${PORT}`);
});

server.on('error', (err) => {
  console.error('Erro ao iniciar servidor:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('Erro não capturado:', err);
  process.exit(1);
});
