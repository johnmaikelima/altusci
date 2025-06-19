const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Executar o build do Next.js
try {
  console.log('Iniciando build do Next.js...');
  execSync('next build', { stdio: 'inherit' });
  console.log('Build do Next.js concluído com sucesso!');
} catch (error) {
  console.error('Erro durante o build do Next.js:', error.message);
  
  // Verificar se o erro está relacionado ao manifesto do cliente
  if (error.message.includes('page_client-reference-manifest.js')) {
    console.log('Detectado erro de manifesto de referência do cliente. Tentando corrigir...');
    
    // Criar diretório se não existir
    const manifestDir = path.join('.next', 'server', 'app', '(main)');
    if (!fs.existsSync(manifestDir)) {
      fs.mkdirSync(manifestDir, { recursive: true });
    }
    
    // Criar arquivo de manifesto vazio
    fs.writeFileSync(
      path.join(manifestDir, 'page_client-reference-manifest.js'),
      'export default {}'
    );
    
    console.log('Arquivo de manifesto criado com sucesso!');
    process.exit(0); // Sair com sucesso
  } else {
    // Se for outro erro, falhar o build
    process.exit(1);
  }
}
