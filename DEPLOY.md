# Guia de Deploy - Manager OS

## Deploy no Coolify

O Coolify pode fazer deploy automático se você configurar corretamente. Aqui estão as instruções:

### Pré-requisitos
- Conta no Coolify
- Repositório Git (GitHub, GitLab, etc.)
- Projeto enviado para o repositório

### Passo 1: Preparar o Repositório

1. Inicialize um repositório Git (se ainda não tiver):
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <sua-url-do-repositorio>
git push -u origin main
```

### Passo 2: Configurar no Coolify

1. Acesse o painel do Coolify
2. Clique em "New Project"
3. Selecione seu repositório Git
4. Configure as seguintes variáveis de ambiente:

```
NODE_ENV=production
PORT=5000
```

### Passo 3: Configurar o Build

O Coolify detectará automaticamente:
- **Backend**: Usa o `Dockerfile` na raiz
- **Frontend**: Usa o `Dockerfile` em `client/`

Se usar `docker-compose.yml`, o Coolify também pode fazer deploy automático.

### Passo 4: Deploy Automático

Para ativar deploy automático:
1. No Coolify, vá para "Settings"
2. Ative "Auto Deploy on Push"
3. Agora, cada push para a branch principal fará deploy automático

### Estrutura de Arquivos

```
ManagerOs/
├── Dockerfile (backend)
├── docker-compose.yml
├── server.js
├── package.json
├── database.db
├── logos/
├── client/
│   ├── Dockerfile (frontend)
│   ├── package.json
│   ├── src/
│   └── public/
```

### Variáveis de Ambiente (Produção)

Adicione no Coolify:
```
NODE_ENV=production
DATABASE_PATH=/app/database.db
LOGOS_PATH=/app/logos
```

### Volumes Persistentes

Configure no Coolify para manter:
- `/app/database.db` - Banco de dados
- `/app/logos` - Logos das empresas

### Troubleshooting

**Erro: "Cannot find module"**
- Certifique-se que `package.json` está na raiz
- Verifique se todas as dependências estão listadas

**Erro: "Port already in use"**
- O Coolify gerencia as portas automaticamente
- Não precisa especificar porta no código

**Banco de dados não persiste**
- Configure volumes no Coolify para `/app/database.db`

### Comandos Úteis

```bash
# Build local com Docker
docker-compose build

# Rodar localmente com Docker
docker-compose up

# Parar containers
docker-compose down
```

### URLs Após Deploy

- **Frontend**: `https://seu-dominio.com`
- **Backend API**: `https://seu-dominio.com/api`

### Credenciais Padrão (Altere Após Deploy!)

- **Email Admin**: `admin@manageros.com`
- **Senha Admin**: `admin123`

⚠️ **IMPORTANTE**: Altere a senha do admin após o primeiro login em produção!
