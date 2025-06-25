import { MenuItem, Menu, Address, SocialMedia, WhatsappConfig } from './blog-settings';

export interface HeaderProps {
  categories?: {
    _id: string;
    name: string;
    slug: string;
    description?: string;
  }[];
  blogSettings: {
    name: string;
    description: string;
    logo: string;
    menus?: Menu[];
    [key: string]: any;
  };
}

export interface FooterProps {
  blogSettings: {
    name: string;
    description: string;
    logo: string;
    menus?: Menu[];
    contactEmail?: string;
    contactPhone?: string;
    contactWhatsapp?: string;
    address?: Address;
    socialMedia?: SocialMedia;
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
    address?: Address;
    socialMedia?: SocialMedia;
    menus?: Menu[];
    [key: string]: any;
  };
}
