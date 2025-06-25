import { BlogSettings as BaseBlogSettings, Menu, MenuItem } from './blog-settings';

// Interface estendida para o layout principal
export interface LayoutBlogSettings extends Omit<BaseBlogSettings, 'description' | 'logo' | 'menus' | 'whatsappConfig' | 'address' | 'socialMedia' | 'legacyMenuItems'> {
  description: string;
  logo: string;
  menus: Menu[];
  whatsappConfig?: {
    number: string;
    message: string;
    hoverText: string;
    enabled: boolean;
  };
  address?: {
    street: string;
    number: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    [key: string]: any;
  };
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    [key: string]: any;
  };
  legacyMenuItems?: MenuItem[];
  [key: string]: any;
}
