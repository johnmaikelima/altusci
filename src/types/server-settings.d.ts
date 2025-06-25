import { BlogSettings } from './blog-settings';

declare module '@/lib/server-settings' {
  export function getServerSettings(): Promise<BlogSettings | null>;
  
  export interface ContactInfo {
    email: string | null;
    phone: string | null;
    address: string | null;
    hours: string | null;
    mapUrl: string | null;
  }
  
  export function getContactInfo(): Promise<ContactInfo>;
}
