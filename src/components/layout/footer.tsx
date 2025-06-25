import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, MapPin, Phone } from 'lucide-react';
import { FooterProps } from '@/types/layout-components';

// Função auxiliar para verificar se há links de mídia social
function hasSocialMediaLinks(socialMedia?: {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  [key: string]: any;
}): boolean {
  if (!socialMedia) return false;
  
  return Boolean(
    socialMedia.facebook ||
    socialMedia.twitter ||
    socialMedia.instagram ||
    socialMedia.linkedin ||
    socialMedia.youtube
  );
}

// Função auxiliar para verificar se há endereço
function hasAddress(address?: {
  street?: string;
  number?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  [key: string]: any;
}): boolean {
  if (!address) return false;
  return Boolean(address.city || address.street);
}

const Footer: React.FC<FooterProps> = ({ blogSettings }) => {
  if (!blogSettings) return null;
  
  const currentYear = new Date().getFullYear();
  
  // Encontrar o menu do rodapé
  const footerMenu = blogSettings.menus?.find(menu => menu.location === 'footer');
  // Ordenar os itens do menu por ordem
  const menuItems = footerMenu?.items?.sort((a, b) => (a.order || 0) - (b.order || 0)) || [];

  // Verificar se há informações para exibir
  const hasContactInfo = Boolean(blogSettings.contactEmail || blogSettings.contactPhone);
  const hasAddressInfo = hasAddress(blogSettings.address);
  const hasSocialMediaInfo = hasSocialMediaLinks(blogSettings.socialMedia);

  return (
    <footer className="bg-gray-900 text-white w-full">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <Image
                src={blogSettings?.logo || "/logo-white.png"}
                alt={`${blogSettings?.name || "Blog"} Logo`}
                width={150}
                height={40}
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-gray-400 mb-4 max-w-md">
              {blogSettings?.description || "Um blog moderno sobre tecnologia, desenvolvimento web e as últimas tendências do mundo digital. Compartilhamos conhecimento e experiências para ajudar você a se manter atualizado."}
            </p>
            
            {/* Redes Sociais */}
            {hasSocialMediaInfo && blogSettings.socialMedia && (
              <div className="flex space-x-4">
                {blogSettings.socialMedia.facebook && (
                  <a
                    href={blogSettings.socialMedia.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook className="h-5 w-5" />
                  </a>
                )}
                {blogSettings.socialMedia.twitter && (
                  <a
                    href={blogSettings.socialMedia.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label="Twitter"
                  >
                    <Twitter className="h-5 w-5" />
                  </a>
                )}
                {blogSettings.socialMedia.instagram && (
                  <a
                    href={blogSettings.socialMedia.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                )}
                {blogSettings.socialMedia.linkedin && (
                  <a
                    href={blogSettings.socialMedia.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                )}
                {blogSettings.socialMedia.youtube && (
                  <a
                    href={blogSettings.socialMedia.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label="YouTube"
                  >
                    <Youtube className="h-5 w-5" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Menu do rodapé */}
          {menuItems.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">{footerMenu?.name || 'Links Rápidos'}</h3>
              <ul className="space-y-2">
                {menuItems.map((item) => (
                  <li key={item.url}>
                    <Link
                      href={item.url}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Links Úteis */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Links Úteis</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/sobre" className="text-gray-400 hover:text-white transition-colors">
                  Sobre
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contato" className="text-gray-400 hover:text-white transition-colors">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Entre em Contato</h3>
            <ul className="space-y-3">
              {hasContactInfo && (
                <>
                  {blogSettings.contactEmail && (
                    <li className="flex items-start">
                      <Mail className="h-5 w-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                      <a
                        href={`mailto:${blogSettings.contactEmail}`}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        {blogSettings.contactEmail}
                      </a>
                    </li>
                  )}
                  {blogSettings.contactPhone && (
                    <li className="flex items-start">
                      <Phone className="h-5 w-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                      <a
                        href={`tel:${blogSettings.contactPhone.replace(/[^0-9+]/g, '')}`}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        {blogSettings.contactPhone}
                      </a>
                    </li>
                  )}
                </>
              )}
              {hasAddressInfo && blogSettings.address && (
                <li className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400">
                    {blogSettings.address.street && (
                      <>
                        {blogSettings.address.street}
                        {blogSettings.address.number && `, ${blogSettings.address.number}`}
                        {blogSettings.address.complement && `, ${blogSettings.address.complement}`}
                        <br />
                      </>
                    )}
                    {blogSettings.address.neighborhood && (
                      <>
                        {blogSettings.address.neighborhood}
                        <br />
                      </>
                    )}
                    {blogSettings.address.city && `${blogSettings.address.city}`}
                    {blogSettings.address.state && `, ${blogSettings.address.state}`}
                    {blogSettings.address.zipCode && (
                      <>
                        <br />
                        CEP: {blogSettings.address.zipCode}
                      </>
                    )}
                    {blogSettings.address.country && (
                      <>
                        <br />
                        {blogSettings.address.country}
                      </>
                    )}
                  </span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 border-t border-gray-800 pt-8">
          <div className="max-w-md mx-auto md:mx-0">
            <h3 className="text-lg font-semibold mb-4">Assine nossa Newsletter</h3>
            <p className="text-gray-400 mb-4">
              Receba as últimas atualizações e artigos diretamente na sua caixa de entrada.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Seu e-mail"
                className="flex-grow px-4 py-2 rounded-l-md text-gray-900 focus:outline-none"
                required
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-r-md transition-colors"
              >
                Assinar
              </button>
            </form>
          </div>
        </div>

        {/* Rodapé inferior */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-500 text-sm mb-4 md:mb-0">
                &copy; {currentYear} {blogSettings.name}. Todos os direitos reservados.
              </p>
              
              <div className="flex space-x-6">
                <Link href="/politica-de-privacidade" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Política de Privacidade
                </Link>
                <Link href="/termos-de-uso" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Termos de Uso
                </Link>
                <Link href="/mapa-do-site" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Mapa do Site
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
