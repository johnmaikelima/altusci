import { connectToDatabase } from './mongoose';
import BlogSettingsModel from '@/models/blog-settings';
import { serializeDocument } from './serialize';
import { BlogSettings } from '@/types/blog-settings';

/**
 * Busca as configurações do blog diretamente do banco de dados
 * @returns Configurações do blog ou null se não encontrar
 */
export async function getServerSettings(): Promise<BlogSettings | null> {
  try {
    await connectToDatabase();
    const settingsDoc = await BlogSettingsModel.findOne().lean();
    
    if (!settingsDoc) {
      // Tenta criar configurações padrão se não existirem
      try {
        const BlogSettingsModelWithStatics = BlogSettingsModel as any;
        const newSettings = typeof BlogSettingsModelWithStatics.findOneOrCreate === 'function'
          ? await BlogSettingsModelWithStatics.findOneOrCreate()
          : await BlogSettingsModel.create({});
          
        if (newSettings) {
          return serializeDocument(newSettings) as BlogSettings;
        }
      } catch (createError) {
        console.error('Erro ao criar configurações padrão do blog:', createError);
      }
      return null;
    }
    
    return serializeDocument(settingsDoc) as BlogSettings;
  } catch (error) {
    console.error('Erro ao buscar configurações do blog:', error);
    return null;
  }
}

/**
 * Busca as configurações de contato do blog
 * @returns Objeto com as informações de contato
 */
export async function getContactInfo() {
  const settings = await getServerSettings();
  
  if (!settings) {
    return {
      email: null,
      phone: null,
      address: null,
      hours: null,
      mapUrl: null,
    };
  }
  
  return {
    email: settings.contactEmail || null,
    phone: settings.contactPhone || null,
    address: settings.contactAddress || null,
    hours: settings.contactHours || null,
    mapUrl: settings.contactMapUrl || null,
  };
}
