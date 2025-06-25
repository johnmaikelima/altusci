import './globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/components/providers/auth-provider';
import { Toaster } from 'react-hot-toast';
import { Metadata } from 'next';
import { connectToDatabase } from '@/lib/mongoose';
import BlogSettingsModel from '@/models/blog-settings';

// Buscar configurações do blog para usar como metadata
export async function generateMetadata(): Promise<Metadata> {
  try {
    // Conectar ao banco de dados
    await connectToDatabase();
    
    // Buscar configurações do blog e serializar para evitar problemas com objetos MongoDB
    const settings = await BlogSettingsModel.findOne().lean();
    
    // Serializar manualmente para garantir que não há objetos complexos
    const serializedSettings = settings ? JSON.parse(JSON.stringify(settings)) : null;
    
    // Se encontrou configurações, usar o nome do blog como título padrão
    if (serializedSettings && serializedSettings.name) {
      return {
        metadataBase: new URL('http://localhost:3000'),
        title: {
          template: '%s',
          default: String(serializedSettings.name)
        },
        description: serializedSettings.description ? String(serializedSettings.description) : 'Manutenção de Notebook com a Altustec',
      };
    }
  } catch (error) {
    console.error('Erro ao buscar configurações do blog para metadata:', error);
  }
  
  // Fallback para caso de erro ou se não encontrar configurações
  return {
    metadataBase: new URL('http://localhost:3000'),
    title: {
      template: '%s',
      default: 'ALTUS'
    },
    description: 'Manutenção de Notebook com a Altustec',
  };
}

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <AuthProvider>
            {children}
            <Toaster position="top-right" />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
