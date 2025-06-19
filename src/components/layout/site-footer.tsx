'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

interface MenuItem {
  name: string;
  url: string;
  order: number;
}

interface BlogAddress {
  street: string;
  number: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

interface BlogSocialMedia {
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
  youtube: string;
}

interface FooterLink {
  label: string;
  url: string;
  isExternal: boolean;
}

interface FooterColumn {
  title: string;
  links: Array<FooterLink | null>;
}

interface BlogSettings {
  name: string;
  contactEmail: string;
  contactPhone: string;
  contactWhatsapp: string;
  address: BlogAddress;
  socialMedia: BlogSocialMedia;
  menus: MenuItem[];
}

type FooterProps = {
  themeSettings?: {
    colors: {
      primary: string;
      background: string;
      text: string;
    };
    footer: {
      showCopyright: boolean;
      copyrightText: string;
      showSocialLinks: boolean;
      socialLinks: Array<{
        platform: string;
        url: string;
        icon: string;
      }>;
      columns: Array<{
        title: string;
        links: Array<{
          label: string;
          url: string;
          isExternal: boolean;
        }>;
      }>;
    };
  };
};

export default function SiteFooter({ themeSettings }: FooterProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [settings, setSettings] = useState<FooterProps['themeSettings']>();

  // Estado para armazenar as configurações do blog
  const [blogSettings, setBlogSettings] = useState<BlogSettings | null>(null);

  // Carregar configurações do tema e do blog
  useEffect(() => {
    const fetchThemeSettings = async () => {
      try {
        const response = await fetch('/api/theme-settings');
        if (response.ok) {
          const data = await response.json();
          setSettings(data);
        }
      } catch (error) {
        console.error('Erro ao carregar configurações do tema:', error);
      }
    };

    const fetchBlogSettings = async () => {
      try {
        const response = await fetch('/api/settings/blog');
        if (response.ok) {
          const data = await response.json();
          setBlogSettings(data);
        }
      } catch (error) {
        console.error('Erro ao carregar configurações do blog:', error);
      }
    };

    fetchThemeSettings();
    fetchBlogSettings();
    setMounted(true);
  }, []);

  // Use as configurações fornecidas ou as configurações padrão
  const footerSettings = settings?.footer || themeSettings?.footer || {
    showCopyright: true,
    copyrightText: `© ${new Date().getFullYear()} ${blogSettings?.name || 'Blog'}. Todos os direitos reservados.`,
    showSocialLinks: true,
    socialLinks: [
      { platform: 'Twitter', url: blogSettings?.socialMedia?.twitter || 'https://twitter.com', icon: 'twitter' },
      { platform: 'Facebook', url: blogSettings?.socialMedia?.facebook || 'https://facebook.com', icon: 'facebook' },
      { platform: 'Instagram', url: blogSettings?.socialMedia?.instagram || 'https://instagram.com', icon: 'instagram' },
      { platform: 'LinkedIn', url: blogSettings?.socialMedia?.linkedin || 'https://linkedin.com', icon: 'linkedin' },
      { platform: 'YouTube', url: blogSettings?.socialMedia?.youtube || 'https://youtube.com', icon: 'youtube' },
    ].filter((link: {platform: string, url: string, icon: string}) => link.url && link.url !== ''),
    columns: [
      // Menu dinâmico configurado pelo administrador
      blogSettings?.menus && blogSettings.menus.length > 0 ? {
        title: 'Menu',
        links: blogSettings.menus
          .sort((a: MenuItem, b: MenuItem) => a.order - b.order)
          .map((item: MenuItem) => ({
            label: item.name,
            url: item.url,
            isExternal: item.url.startsWith('http') || item.url.startsWith('mailto:') || item.url.startsWith('tel:'),
          })),
      } : null,
      // Menu padrão de links úteis
      {
        title: 'Links Úteis',
        links: [
          { label: 'Home', url: '/', isExternal: false },
          { label: 'Blog', url: '/blog', isExternal: false },
          { label: 'Sobre', url: '/sobre', isExternal: false },
        ],
      },
      {
        title: 'Legal',
        links: [
          { label: 'Política de Privacidade', url: '/politica-de-privacidade', isExternal: false },
        ],
      },
      {
        title: 'Contato',
        links: [
          blogSettings?.contactEmail ? { label: `Email: ${blogSettings.contactEmail}`, url: `mailto:${blogSettings.contactEmail}`, isExternal: true } : null,
          blogSettings?.contactPhone ? { label: `Telefone: ${blogSettings.contactPhone}`, url: `tel:${blogSettings.contactPhone}`, isExternal: true } : null,
          blogSettings?.contactWhatsapp ? { label: `WhatsApp: ${blogSettings.contactWhatsapp}`, url: `https://wa.me/${blogSettings.contactWhatsapp.replace(/\D/g, '')}`, isExternal: true } : null,
        ].filter(Boolean),
      },
      // Adicionar coluna de endereço se houver informações de endereço disponíveis
      blogSettings?.address && (
        blogSettings.address.street || 
        blogSettings.address.city || 
        blogSettings.address.state
      ) ? {
        title: 'Endereço',
        links: [
          blogSettings.address.street && blogSettings.address.number ? 
            { label: `${blogSettings.address.street}, ${blogSettings.address.number}`, url: '#', isExternal: false } : null,
          blogSettings.address.city && blogSettings.address.state ? 
            { label: `${blogSettings.address.city} - ${blogSettings.address.state}`, url: '#', isExternal: false } : null,
          blogSettings.address.zipCode ? 
            { label: `CEP: ${blogSettings.address.zipCode}`, url: '#', isExternal: false } : null,
          blogSettings.address.country ? 
            { label: blogSettings.address.country, url: '#', isExternal: false } : null,
        ].filter(Boolean),
      } : null,
    ].filter(column => column && column.links && column.links.length > 0),
  };

  const colors = settings?.colors || themeSettings?.colors || {
    primary: '#2563eb',
    background: '#ffffff',
    text: '#111827',
  };

  // Evitar problemas de hidratação
  if (!mounted) {
    return null;
  }

  return (
    <footer
      style={{
        backgroundColor: colors.background + '05',
        color: colors.text,
        borderTop: `1px solid ${colors.text}10`,
        padding: '2rem 0',
      }}
    >
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 style={{ color: colors.primary, fontWeight: 'bold', marginBottom: '1rem' }}>
              Blog
            </h3>
            <p style={{ color: colors.text, marginBottom: '1rem' }}>
              Um blog simples e elegante para compartilhar suas ideias com o mundo.
            </p>
            {footerSettings.showSocialLinks && (
              <div className="flex gap-4">
                {footerSettings.socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: colors.primary,
                      width: '2rem',
                      height: '2rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%',
                      border: `1px solid ${colors.primary}`,
                    }}
                  >
                    {link.platform.charAt(0)}
                  </a>
                ))}
              </div>
            )}
          </div>

          {footerSettings.columns.map((column, index) => (
            column && (
              <div key={index}>
                <h3 style={{ color: colors.primary, fontWeight: 'bold', marginBottom: '1rem' }}>
                  {column.title}
                </h3>
                <ul className="space-y-2">
                  {column.links.filter((link: any) => link !== null).map((link: any, linkIndex: number) => (
                    link && (
                      <li key={linkIndex}>
                        {link.isExternal ? (
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: colors.text }}
                            className="hover:underline"
                          >
                            {link.label}
                          </a>
                        ) : (
                          <Link
                            href={link.url}
                            style={{ color: colors.text }}
                            className="hover:underline"
                          >
                            {link.label}
                          </Link>
                        )}
                      </li>
                    )
                  ))}
                </ul>
              </div>
            )
          ))}
        </div>

        {footerSettings.showCopyright && (
          <div
            style={{
              borderTop: `1px solid ${colors.text}10`,
              marginTop: '2rem',
              paddingTop: '1rem',
              textAlign: 'center',
              color: colors.text + '80',
            }}
          >
            {footerSettings.copyrightText}
          </div>
        )}
      </div>
    </footer>
  );
}
