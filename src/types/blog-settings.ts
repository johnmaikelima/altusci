// Tipos para endereço
export interface Address {
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  [key: string]: any; // Para permitir propriedades adicionais
}

// Tipos para mídias sociais
export interface SocialMedia {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  [key: string]: any; // Para permitir propriedades adicionais
}

// Tipos para configuração do WhatsApp
export interface WhatsappConfig {
  number: string;
  message: string;
  hoverText: string;
  enabled: boolean;
  [key: string]: any; // Para permitir propriedades adicionais
}

// Tipos para itens de menu
export interface MenuItem {
  _id?: string;
  name: string;
  url: string;
  order?: number;
  isCTA?: boolean;
  [key: string]: any; // Para permitir propriedades adicionais
}

// Tipos para menus
export interface Menu {
  _id?: string;
  name: string;
  location: string;
  items: MenuItem[];
  [key: string]: any; // Para permitir propriedades adicionais
}

// Tipos para as configurações de SMTP
export interface SmtpAuth {
  user: string;
  pass: string;
  [key: string]: any; // Para permitir propriedades adicionais
}

export interface SmtpSettings {
  host: string;
  port: number;
  secure: boolean;
  auth: SmtpAuth;
  from?: string;
  [key: string]: any; // Para permitir propriedades adicionais
}

// Tipos para o formulário de contato
export interface ContactFormSettings {
  enabled: boolean;
  captchaEnabled: boolean;
  recipientEmail?: string;
  [key: string]: any; // Para permitir propriedades adicionais
}

// Interface principal das configurações do blog
export interface BlogSettings {
  _id?: string;
  name: string;
  description?: string;
  logo?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactWhatsapp?: string;
  contactAddress?: string | Address;
  contactHours?: string;
  contactMapUrl?: string;
  smtp?: SmtpSettings;
  contactForm?: ContactFormSettings;
  menus?: Menu[];
  legacyMenuItems?: MenuItem[];
  address?: Address;
  socialMedia?: SocialMedia;
  whatsappConfig?: WhatsappConfig;
  __v?: number;
  [key: string]: any; // Para permitir propriedades adicionais
}
