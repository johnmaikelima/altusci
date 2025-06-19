import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Topbar from '@/components/layout/topbar';
import { Metadata } from 'next';
import { connectToDatabase } from '@/lib/mongoose';
import CategoryModel from '@/models/category';
import BlogSettingsModel from '@/models/blog-settings';

// Interfaces para tipagem
interface MenuItem {
  _id: string;
  name: string;
  url: string;
  order: number;
  isCTA?: boolean;
}

interface Menu {
  _id: string;
  name: string;
  location: string;
  items: MenuItem[];
}

interface Address {
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
}

interface SocialMedia {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
}

interface BlogSettings {
  _id?: string;
  name: string;
  description: string;
  logo: string;
  menus: Menu[];
  contactEmail?: string;
  contactPhone?: string;
  address?: Address;
  socialMedia?: SocialMedia;
  legacyMenuItems?: MenuItem[];
}

// Desabilitar cache para garantir que sempre tenhamos os dados mais recentes
export const revalidate = 0;

// Metadata será gerada dinamicamente com base nas configurações do blog
export async function generateMetadata(): Promise<Metadata> {
  await connectToDatabase();
  
  try {
    // Buscar configurações do blog
    const settings = await BlogSettingsModel.findOne().lean() as BlogSettings || { 
      name: 'Blog Moderno', 
      description: 'Um blog sobre tecnologia e desenvolvimento web' 
    };
    
    return {
      title: settings.name,
      description: settings.description,
    };
  } catch (error) {
    console.error('Erro ao buscar configurações do blog:', error);
    return {
      title: 'Blog Moderno',
      description: 'Um blog sobre tecnologia e desenvolvimento web',
    };
  }
};

// Função para buscar categorias do MongoDB
async function getCategories() {
  await connectToDatabase();
  
  try {
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
async function getBlogSettings(): Promise<BlogSettings> {
  await connectToDatabase();
  
  try {
    // Buscar configurações ou usar valores padrão
    const settings = await BlogSettingsModel.findOne().lean() as any || {
      name: 'Blog Moderno',
      description: 'Um blog sobre tecnologia e desenvolvimento web',
      logo: '/logo.png'
    };
    
    // Converter _id para string se existir
    if (settings._id) {
      settings._id = settings._id.toString();
    }
    
    // Verificar se existem menus configurados
    const menus = settings.menus || [];
    
    // Converter os menus e seus itens para objetos JavaScript simples
    const serializedMenus = menus.map((menu: any) => ({
      _id: menu._id ? menu._id.toString() : undefined,
      name: menu.name,
      location: menu.location,
      items: (menu.items || []).map((item: any) => ({
        _id: item._id ? item._id.toString() : undefined,
        name: item.name,
        url: item.url,
        order: item.order,
        isCTA: item.isCTA
      }))
    }));
    
    // Migrar menus legados para o novo formato se necessário
    if (!serializedMenus.length && settings.legacyMenuItems?.length) {
      // Criar um menu padrão com os itens legados
      const legacyItems = settings.legacyMenuItems.map((item: any, index: number) => ({
        _id: item._id ? item._id.toString() : `legacy-${index}`,
        name: item.name,
        url: item.url,
        order: index,
        isCTA: item.isCTA || false
      }));
      
      serializedMenus.push({
        _id: 'legacy-menu',
        name: 'Menu Principal',
        location: 'header',
        items: legacyItems
      });
    }
    
    // Serializar informações de contato e endereço
    const serializedAddress = settings.address ? {
      street: settings.address.street || '',
      number: settings.address.number || '',
      complement: settings.address.complement || '',
      neighborhood: settings.address.neighborhood || '',
      city: settings.address.city || '',
      state: settings.address.state || '',
      country: settings.address.country || '',
      zipCode: settings.address.zipCode || ''
    } : undefined;
    
    const serializedSocialMedia = settings.socialMedia ? {
      facebook: settings.socialMedia.facebook || '',
      twitter: settings.socialMedia.twitter || '',
      instagram: settings.socialMedia.instagram || '',
      linkedin: settings.socialMedia.linkedin || '',
      youtube: settings.socialMedia.youtube || ''
    } : undefined;
    
    // Retornar objeto serializado
    return {
      name: settings.name,
      description: settings.description,
      logo: settings.logo || '/logo.png',
      menus: serializedMenus,
      contactEmail: settings.contactEmail || '',
      contactPhone: settings.contactPhone || '',
      address: serializedAddress,
      socialMedia: serializedSocialMedia
    };
  } catch (error) {
    console.error('Erro ao buscar configurações do blog:', error);
    return {
      name: 'Blog Moderno',
      description: 'Um blog sobre tecnologia e desenvolvimento web',
      logo: '/logo.png',
      menus: [],
      contactEmail: '',
      contactPhone: '',
      address: undefined,
      socialMedia: undefined
    };
  }
}

export default async function MainSiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Buscar categorias e configurações do MongoDB
  const categories = await getCategories();
  const blogSettings = await getBlogSettings();
  
  return (
    <div className="flex flex-col min-h-screen bg-white w-full">
      <Topbar blogSettings={blogSettings} />
      <Header categories={categories} blogSettings={blogSettings} />
      <main className="flex-grow pt-32 w-full">
        <div className="w-full">
          {children}
        </div>
      </main>
      <Footer blogSettings={blogSettings} />
    </div>
  );
}
