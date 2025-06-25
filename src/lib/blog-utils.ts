import { BlogSettings } from '@/types/blog-settings';
import { LayoutBlogSettings, LayoutMenu, LayoutAddress, LayoutSocialMedia, LayoutWhatsappConfig } from '@/types/layout-components';

export function convertToLayoutSettings(settings: BlogSettings | null): LayoutBlogSettings {
  if (!settings) {
    return {
      name: 'ALTUS',
      description: 'Manutenção de Notebook com a Altustec',
      logo: '/logo.png',
      menus: [],
      contactEmail: '',
      contactPhone: '',
      contactWhatsapp: '',
      whatsappConfig: {
        number: '',
        message: 'Olá! Vim pelo site e gostaria de algumas informações.',
        hoverText: 'Precisa de ajuda? Fale conosco!',
        enabled: false
      }
    };
  }

  // Converter menus
  const menus: LayoutMenu[] = (settings.menus || []).map(menu => ({
    _id: menu._id ? String(menu._id) : '',
    name: menu.name || 'Menu',
    location: menu.location || 'header',
    items: (menu.items || []).map(item => ({
      _id: item._id ? String(item._id) : '',
      name: item.name || 'Item',
      url: item.url || '#',
      order: typeof item.order === 'number' ? item.order : 0,
      isCTA: Boolean(item.isCTA)
    }))
  }));

  // Converter endereço
  const address: LayoutAddress | undefined = settings.address ? {
    street: settings.address.street || '',
    number: settings.address.number || '',
    city: settings.address.city || '',
    state: settings.address.state || '',
    country: settings.address.country || '',
    zipCode: settings.address.zipCode || ''
  } : undefined;

  // Converter mídias sociais
  const socialMedia: LayoutSocialMedia | undefined = settings.socialMedia ? {
    facebook: settings.socialMedia.facebook,
    twitter: settings.socialMedia.twitter,
    instagram: settings.socialMedia.instagram,
    linkedin: settings.socialMedia.linkedin,
    youtube: settings.socialMedia.youtube
  } : undefined;

  // Converter configuração do WhatsApp
  const whatsappConfig: LayoutWhatsappConfig | undefined = settings.whatsappConfig ? {
    number: settings.whatsappConfig.number || '',
    message: settings.whatsappConfig.message || 'Olá! Vim pelo site e gostaria de algumas informações.',
    hoverText: settings.whatsappConfig.hoverText || 'Precisa de ajuda? Fale conosco!',
    enabled: Boolean(settings.whatsappConfig.enabled)
  } : undefined;

  // Retornar objeto convertido
  return {
    _id: settings._id ? String(settings._id) : undefined,
    name: settings.name || 'Meu Blog',
    description: settings.description || 'Um blog incrível sobre tecnologia e programação',
    logo: settings.logo || '/logo.png',
    menus,
    contactEmail: settings.contactEmail,
    contactPhone: settings.contactPhone,
    contactWhatsapp: settings.contactWhatsapp,
    address,
    socialMedia,
    whatsappConfig
  };
}
