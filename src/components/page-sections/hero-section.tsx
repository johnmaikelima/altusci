'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { HtmlContent } from './html-content';
import Link from 'next/link';
import Image from 'next/image';

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  content?: string;
  buttonText?: string;
  buttonLink?: string;
  backgroundColor?: string;
  textColor?: string;
  imageUrl?: string;
}

export function HeroSection({
  title,
  subtitle,
  content,
  buttonText,
  buttonLink,
  backgroundColor = '#f8fafc',
  textColor = '#1e293b',
  imageUrl
}: HeroSectionProps) {
  // Determinar se temos uma imagem de fundo
  const hasBackgroundImage = !!imageUrl;
  
  return (
    <section 
      className={`py-16 px-4 md:px-6 lg:px-8 relative ${hasBackgroundImage ? 'min-h-[500px] flex items-center' : ''}`}
      style={{ 
        backgroundColor: hasBackgroundImage ? 'transparent' : backgroundColor,
        color: textColor
      }}
    >
      {hasBackgroundImage && (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{ 
              backgroundImage: `url(${imageUrl})`,
              opacity: 0.8 // Ajuste a opacidade conforme necessário
            }}
          />
          <div 
            className="absolute inset-0" 
            style={{ 
              backgroundColor: 'rgba(0,0,0,0.4)' // Overlay escuro para melhorar a legibilidade do texto
            }}
          />
        </div>
      )}
      <div className="container mx-auto max-w-5xl relative z-10">
        <div className="text-center mb-8">
          <h1 
            className="text-4xl md:text-5xl font-bold mb-4" 
            style={{ color: hasBackgroundImage ? '#ffffff' : textColor }}
          >
            {title}
          </h1>
          
          {subtitle && (
            <h2 
              className="text-xl md:text-2xl mb-6 opacity-90" 
              style={{ color: hasBackgroundImage ? '#ffffff' : textColor }}
            >
              {subtitle}
            </h2>
          )}
          
          {content && (
            <div 
              className="max-w-3xl mx-auto mb-8" 
              style={{ color: hasBackgroundImage ? '#ffffff' : 'inherit' }}
            >
              <HtmlContent content={content} />
            </div>
          )}
          
          {buttonText && buttonLink && (
            <Button 
              asChild 
              size="lg" 
              className={`mt-4 ${hasBackgroundImage ? 'bg-white text-black hover:bg-gray-200' : ''}`}
              variant={hasBackgroundImage ? 'outline' : 'default'}
            >
              <Link href={buttonLink}>
                {buttonText}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
