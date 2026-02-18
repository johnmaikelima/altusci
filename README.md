# Manager OS - Sistema de Ordem de Serviço

Sistema completo de gerenciamento de ordens de serviço desenvolvido com Node.js, React e SQLite.

## Características

- ✅ Cadastro de múltiplas empresas com logo e informações
- ✅ Cadastro de clientes
- ✅ Cadastro de produtos/serviços
- ✅ Criação, edição e exclusão de ordens de serviço
- ✅ Impressão de ordens de serviço em PDF
- ✅ Banco de dados em arquivo (SQLite) - sem necessidade de configuração
- ✅ Interface moderna e responsiva

## Instalação

### Pré-requisitos
- Node.js (versão 14 ou superior)
- npm

### Passos

1. **Instalar dependências do backend:**
```bash
npm install
```

2. **Instalar dependências do frontend:**
```bash
cd client
npm install
cd ..
```

## Execução

### Opção 1: Executar em dois terminais (recomendado para desenvolvimento)

**Terminal 1 - Backend:**
```bash
npm start
```
O servidor rodará em `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
npm run client
```
A aplicação abrirá em `http://localhost:3000`

### Opção 2: Executar apenas o backend
```bash
npm start
```

## Estrutura do Projeto

```
ManagerOs/
├── server.js                 # Servidor Node.js/Express
├── package.json             # Dependências do backend
├── database.db              # Banco de dados SQLite (criado automaticamente)
├── logos/                   # Pasta para armazenar logos das empresas
├── client/                  # Aplicação React
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── pages/
│   │       ├── Empresas.js
│   │       ├── Clientes.js
│   │       ├── Produtos.js
│   │       ├── Ordens.js
│   │       ├── CriarOrdem.js
│   │       └── EditarOrdem.js
│   └── package.json
└── README.md
```

## Funcionalidades

### Empresas
- Cadastrar novas empresas
- Adicionar logo, CNPJ, endereço, telefone e email
- Editar informações da empresa
- Deletar empresa
- Logo aparece no cabeçalho da ordem de serviço

### Clientes
- Cadastrar novos clientes
- Adicionar CPF/CNPJ, endereço, telefone e email
- Editar informações do cliente
- Deletar cliente

### Produtos/Serviços
- Cadastrar produtos e serviços com preço
- Editar informações
- Deletar produtos
- Classificar como produto ou serviço

### Ordens de Serviço
- Criar nova ordem selecionando empresa e cliente
- Adicionar múltiplos itens (produtos/serviços)
- Editar ordem existente
- Deletar ordem
- Imprimir ordem em formato HTML (pronto para PDF)
- Acompanhar status (Aberta, Em Andamento, Concluída, Cancelada)
- Adicionar descrição e observações

## Banco de Dados

O sistema utiliza SQLite com banco de dados em arquivo (`database.db`). O banco é criado automaticamente na primeira execução com as seguintes tabelas:

- **empresas**: Informações das empresas
- **clientes**: Dados dos clientes
- **produtos**: Produtos e serviços disponíveis
- **ordens_servico**: Ordens de serviço
- **itens_ordem**: Itens de cada ordem

## API Endpoints

### Empresas
- `GET /api/empresas` - Listar todas as empresas
- `GET /api/empresas/:id` - Obter empresa específica
- `POST /api/empresas` - Criar nova empresa
- `PUT /api/empresas/:id` - Atualizar empresa
- `DELETE /api/empresas/:id` - Deletar empresa

### Clientes
- `GET /api/clientes` - Listar todos os clientes
- `GET /api/clientes/:id` - Obter cliente específico
- `POST /api/clientes` - Criar novo cliente
- `PUT /api/clientes/:id` - Atualizar cliente
- `DELETE /api/clientes/:id` - Deletar cliente

### Produtos
- `GET /api/produtos` - Listar todos os produtos
- `GET /api/produtos/:id` - Obter produto específico
- `POST /api/produtos` - Criar novo produto
- `PUT /api/produtos/:id` - Atualizar produto
- `DELETE /api/produtos/:id` - Deletar produto

### Ordens de Serviço
- `GET /api/ordens` - Listar todas as ordens
- `GET /api/ordens/:id` - Obter ordem específica
- `POST /api/ordens` - Criar nova ordem
- `PUT /api/ordens/:id` - Atualizar ordem
- `DELETE /api/ordens/:id` - Deletar ordem
- `GET /imprimir/:id` - Gerar HTML para impressão

## Tecnologias Utilizadas

### Backend
- **Express.js** - Framework web
- **SQLite3** - Banco de dados
- **CORS** - Controle de acesso
- **Body-parser** - Parser de requisições

### Frontend
- **React** - Biblioteca UI
- **Axios** - Cliente HTTP
- **React Router** - Roteamento
- **CSS3** - Estilização

## Notas Importantes

1. **Logos**: As logos das empresas são armazenadas em base64 no banco de dados e em arquivos na pasta `logos/`
2. **Impressão**: A rota `/imprimir/:id` gera um HTML formatado que pode ser impresso ou salvo como PDF
3. **Números de Ordem**: Gerados automaticamente no formato `OS-YYYYMMDD-XXXX`
4. **Responsividade**: A interface se adapta a diferentes tamanhos de tela

## Troubleshooting

### Porta 5000 já está em uso
```bash
# Mude a porta no server.js ou encerre o processo que está usando a porta
```

### Porta 3000 já está em uso
```bash
# A aplicação React tentará usar a próxima porta disponível
```

### Banco de dados corrompido
```bash
# Delete o arquivo database.db e reinicie o servidor
# O banco será recriado automaticamente
```

## Licença

Este projeto é de código aberto e pode ser usado livremente.
