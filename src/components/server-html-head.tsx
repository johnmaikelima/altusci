"use client";

// Componente para renderizar HTML no head
import Script from 'next/script';
import { parse } from 'node-html-parser';

interface ServerHtmlHeadProps {
  metaTags: string;
  scripts: string;
  rawHtml: string; // HTML bruto para renderização direta
}

// Função para extrair meta tags do HTML bruto
function extractMetaTags(html: string): React.ReactNode[] {
  if (!html) return [];
  
  try {
    const root = parse(html);
    const metaTags = root.querySelectorAll('meta');
    
    return metaTags.map((tag, index) => {
      const attrs: Record<string, string> = {};
      
      // Extrair todos os atributos da meta tag
      Object.entries(tag.attributes).forEach(([key, value]) => {
        attrs[key] = value as string;
      });
      
      // Renderizar a meta tag como um elemento React
      return <meta key={`meta-${index}`} {...attrs} />;
    });
  } catch (error) {
    console.error('Erro ao extrair meta tags:', error);
    return [];
  }
}

export function ServerHtmlHead({ metaTags, scripts, rawHtml }: ServerHtmlHeadProps) {
  // Extrair meta tags para renderização direta
  const metaElements = extractMetaTags(rawHtml);
  
  return (
    <>
      {/* Renderizar meta tags diretamente */}
      {metaElements}
      
      {/* Renderizar outros elementos do head usando um script */}
      {metaTags && (
        <Script
          id="custom-head-meta"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              // Esta função é executada no servidor e no cliente
              (function() {
                var metaString = ${JSON.stringify(metaTags)};
                
                // No cliente, injetamos os elementos no head
                if (typeof window !== 'undefined') {
                  var fragment = document.createRange().createContextualFragment(metaString);
                  document.head.appendChild(fragment);
                }
              })();
            `
          }}
        />
      )}
      
      {/* Renderizar scripts usando um script que executa após a interatividade */}
      {scripts && (
        <Script
          id="custom-head-scripts"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var scriptString = ${JSON.stringify(scripts)};
                
                if (typeof window !== 'undefined') {
                  var fragment = document.createRange().createContextualFragment(scriptString);
                  document.head.appendChild(fragment);
                }
              })();
            `
          }}
        />
      )}
    </>
  );
}
