// Tipos específicos para componentes de layout

export interface LayoutMenuItem {
  _id: string;
  name: string;
  url: string;
  order: number;
  isCTA?: boolean;
}

export interface LayoutMenu {
  _id: string;
  name: string;
  location: string;
  items: LayoutMenuItem[];
}

export interface LayoutAddress {
  street: string;
  number: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  [key: string]: any;
}

export interface LayoutSocialMedia {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  [key: string]: any;
}

export interface LayoutWhatsappConfig {
  number: string;
  message: string;
  hoverText: string;
  enabled: boolean;
  [key: string]: any;
}

export interface LayoutBlogSettings {
  name: string;
  description: string;
  logo: string;
  menus: LayoutMenu[];
  contactEmail?: string;
  contactPhone?: string;
  contactWhatsapp?: string;
  address?: LayoutAddress;
  socialMedia?: LayoutSocialMedia;
  whatsappConfig?: LayoutWhatsappConfig;
  [key: string]: any;
}

export interface LayoutCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface HeaderProps {
  categories: LayoutCategory[];
  blogSettings: {
    name: string;
    description: string;
    logo: string;
    menus: LayoutMenu[];
    [key: string]: any;
  };
}

export interface FooterProps {
  blogSettings: {
    name: string;
    description: string;
    logo: string;
    menus: LayoutMenu[];
    contactEmail?: string;
    contactPhone?: string;
    contactWhatsapp?: string;
    address?: LayoutAddress;
    socialMedia?: LayoutSocialMedia;
    [key: string]: any;
  };
}

export interface TopbarProps {
  blogSettings?: {
    name: string;
    description: string;
    logo?: string;
    contactEmail?: string;
    contactPhone?: string;
    contactWhatsapp?: string;
    address?: LayoutAddress;
    socialMedia?: LayoutSocialMedia;
    menus?: LayoutMenu[];
    [key: string]: any;
  };
}
