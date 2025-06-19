const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Criar diretamente os diretórios e arquivos necessários antes do build
console.log('Preparando ambiente para o build...');

// Criar diretório para o manifesto se não existir
const manifestDir = path.join('.next', 'server', 'app', '(main)');
if (!fs.existsSync(manifestDir)) {
  fs.mkdirSync(manifestDir, { recursive: true });
  console.log(`Diretório criado: ${manifestDir}`);
}

// Criar arquivo de manifesto vazio
const manifestPath = path.join(manifestDir, 'page_client-reference-manifest.js');
fs.writeFileSync(manifestPath, 'export default {}')
const layoutManifestPath = path.join(manifestDir, 'layout_client-reference-manifest.js');
fs.writeFileSync(layoutManifestPath, 'export default {}')
console.log('Arquivos de manifesto criados com sucesso!');

// Executar o build do Next.js
try {
  console.log('Iniciando build do Next.js...');
  execSync('next build', { stdio: 'inherit' });
  console.log('Build do Next.js concluído com sucesso!');
  process.exit(0);
} catch (error) {
  console.error('Erro durante o build do Next.js:', error.message);
  process.exit(1);
}
