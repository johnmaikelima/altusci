import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Topbar from '@/components/layout/topbar';
import GlobalWhatsAppButton from '@/components/global-whatsapp-button';
import { Toaster } from '@/components/ui/toaster';
import { Metadata } from 'next';
import { connectToDatabase, getServerSettings } from '@/lib';
import { convertToLayoutSettings } from '@/lib/blog-utils';
import CategoryModel from '@/models/category';

// Configurações para forçar renderização dinâmica e resolver problemas de build
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Importar tipos compartilhados
import { BlogSettings } from '@/types/blog-settings';
import { LayoutBlogSettings } from '@/types/layout-components';

// Desabilitar cache para garantir que sempre tenhamos os dados mais recentes
export const revalidate = 0;

// Metadata será gerada dinamicamente com base nas configurações do blog
export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await getServerSettings();
    
    // Forçar o título a ser o nome do blog sem sufixos
    return {
      title: {
        absolute: settings?.name || 'ALTUS', // Força o título absoluto sem template
      },
      description: settings?.description || 'Manutenção de Notebook com a Altustec',
    };
  } catch (error) {
    console.error('Erro ao buscar configurações do blog:', error);
    return {
      title: {
        absolute: 'ALTUS', // Força o título absoluto sem template
      },
      description: 'Manutenção de Notebook com a Altustec',
    };
  }
};

// Função para buscar categorias do MongoDB
async function getCategories() {
  try {
    await connectToDatabase();
    const categories = await CategoryModel.find().sort({ name: 1 }).lean();
    
    // Formatar as categorias para o frontend e converter para objetos JavaScript simples
    return categories.map((category: any) => ({
      _id: category._id.toString(),
      name: category.name,
      slug: category.slug,
      description: category.description || ''
    }));
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    return [];
  }
}

// Função para buscar configurações do blog
async function getBlogSettings(): Promise<LayoutBlogSettings> {
  try {
    const settings = await getServerSettings();
    return convertToLayoutSettings(settings);
  } catch (error) {
    console.error('Erro ao buscar configurações do blog:', error);
    return convertToLayoutSettings(null);
  }
}

// Interface para as props do layout
export default async function MainSiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Buscar categorias e configurações do MongoDB
  const categories = await getCategories();
  const blogSettings = await getBlogSettings();
  
  // Extrair as propriedades necessárias para cada componente
  const { name, description, logo, contactEmail, contactPhone, contactWhatsapp, address, socialMedia, menus = [], whatsappConfig } = blogSettings;
  
  return (
    <div className="flex flex-col min-h-screen bg-white w-full">
      <Topbar blogSettings={{
        name,
        description,
        logo,
        contactEmail,
        contactPhone,
        contactWhatsapp,
        address,
        socialMedia,
        menus
      }} />
      
      <Header 
        categories={categories} 
        blogSettings={{
          name,
          description: description || '',
          logo: logo || '/logo.png',
          menus
        }} 
      />
      
      <main className="flex-grow pt-32 w-full">
        <div className="w-full">
          {children}
        </div>
      </main>
      
      <Footer 
        blogSettings={{
          name,
          description: description || '',
          logo: logo || '/logo.png',
          menus,
          contactEmail,
          contactPhone,
          contactWhatsapp,
          address,
          socialMedia
        }} 
      />
      
      {/* Botão global de WhatsApp que será exibido apenas quando habilitado nas configurações */}
      {whatsappConfig?.enabled && (
        <GlobalWhatsAppButton 
          config={{
            number: whatsappConfig?.number || contactWhatsapp || '',
            message: whatsappConfig?.message || 'Olá! Vim pelo site e gostaria de algumas informações.',
            hoverText: whatsappConfig?.hoverText || 'Precisa de ajuda? Fale conosco!',
            enabled: true
          }}
        />
      )}
      
      <Toaster />
    </div>
  );
}
