import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Iniciando Manager OS...\n');

// Iniciar servidor backend
const serverProcess = spawn('npm', ['run', 'dev'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
});

// Aguardar um pouco antes de iniciar o frontend
setTimeout(() => {
  console.log('\n📱 Iniciando frontend...\n');
  
  // Iniciar frontend com variáveis de ambiente
  const clientProcess = spawn('npm', ['start'], {
    cwd: `${__dirname}/client`,
    stdio: 'inherit',
    shell: true,
    env: {
      ...process.env,
      REACT_APP_API_URL: 'http://localhost:5000',
      WDS_SOCKET_HOST: 'localhost',
      WDS_SOCKET_PORT: '3000',
      DANGEROUSLY_DISABLE_HOST_CHECK: 'true'
    }
  });

  // Tratamento de erros
  clientProcess.on('error', (err) => {
    console.error('Erro ao iniciar frontend:', err);
  });
}, 3000);

// Tratamento de erros do servidor
serverProcess.on('error', (err) => {
  console.error('Erro ao iniciar servidor:', err);
});

// Tratamento de saída
process.on('SIGINT', () => {
  console.log('\n\n⛔ Encerrando aplicação...');
  process.exit(0);
});
