import './globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/components/providers/auth-provider';
import { BlogSettingsProvider } from '@/components/providers/blog-settings-provider';
import { Metadata } from 'next';
import { getServerSettings } from '@/lib';
import { BlogSettings } from '@/types/blog-settings';

// Buscar configurações do blog para usar como metadata
export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await getServerSettings();
    
    if (settings?.name) {
      return {
        metadataBase: new URL('http://localhost:3000'),
        title: {
          template: '%s',
          default: String(settings.name)
        },
        description: settings.description ? String(settings.description) : 'Manutenção de Notebook com a Altustec',
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

// Buscar configurações iniciais do blog no servidor
async function getInitialSettings(): Promise<BlogSettings | null> {
  try {
    return await getServerSettings();
  } catch (error) {
    console.error('Erro ao buscar configurações iniciais do blog:', error);
    return null;
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialSettings = await getInitialSettings();
  
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <AuthProvider>
            <BlogSettingsProvider initialSettings={initialSettings}>
              {children}
              <Toaster position="top-right" />
            </BlogSettingsProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
