'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ImageUpload } from '@/components/image-upload';

interface HeroSectionProps {
  section: {
    type: string;
    title?: string;
    subtitle?: string;
    content?: string;
    buttonText?: string;
    buttonLink?: string;
    backgroundColor?: string;
    textColor?: string;
    imageUrl?: string;
  };
  onUpdate: (updatedSection: any) => void;
}

export function HeroSectionEditor({ section, onUpdate }: HeroSectionProps) {
  const [sectionData, setSectionData] = useState({
    title: section.title || '',
    subtitle: section.subtitle || '',
    content: section.content || '',
    buttonText: section.buttonText || '',
    buttonLink: section.buttonLink || '',
    backgroundColor: section.backgroundColor || '#f8fafc',
    textColor: section.textColor || '#1e293b',
    imageUrl: section.imageUrl || ''
  });

  useEffect(() => {
    setSectionData({
      title: section.title || '',
      subtitle: section.subtitle || '',
      content: section.content || '',
      buttonText: section.buttonText || '',
      buttonLink: section.buttonLink || '',
      backgroundColor: section.backgroundColor || '#f8fafc',
      textColor: section.textColor || '#1e293b',
      imageUrl: section.imageUrl || ''
    });
  }, [section]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSectionData(prev => ({
      ...prev,
      [name]: value
    }));

    onUpdate({
      ...section,
      [name]: value
    });
  };

  const handleImageSelected = (imageUrl: string) => {
    setSectionData(prev => ({
      ...prev,
      imageUrl
    }));

    onUpdate({
      ...section,
      imageUrl
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Editar Seção Hero</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            name="title"
            value={sectionData.title}
            onChange={handleChange}
            placeholder="Título principal"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="subtitle">Subtítulo</Label>
          <Input
            id="subtitle"
            name="subtitle"
            value={sectionData.subtitle}
            onChange={handleChange}
            placeholder="Subtítulo ou slogan"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Conteúdo</Label>
          <Textarea
            id="content"
            name="content"
            value={sectionData.content}
            onChange={handleChange}
            placeholder="Conteúdo HTML da seção"
            rows={4}
          />
          <p className="text-xs text-muted-foreground">
            Você pode usar HTML para formatação
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="buttonText">Texto do Botão</Label>
            <Input
              id="buttonText"
              name="buttonText"
              value={sectionData.buttonText}
              onChange={handleChange}
              placeholder="Ex: Saiba Mais"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="buttonLink">Link do Botão</Label>
            <Input
              id="buttonLink"
              name="buttonLink"
              value={sectionData.buttonLink}
              onChange={handleChange}
              placeholder="Ex: /contato ou https://..."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="backgroundColor">Cor de Fundo</Label>
            <div className="flex gap-2">
              <Input
                id="backgroundColor"
                name="backgroundColor"
                type="color"
                value={sectionData.backgroundColor}
                onChange={handleChange}
                className="w-12 h-10 p-1"
              />
              <Input
                type="text"
                name="backgroundColor"
                value={sectionData.backgroundColor}
                onChange={handleChange}
                placeholder="#ffffff"
                className="flex-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="textColor">Cor do Texto</Label>
            <div className="flex gap-2">
              <Input
                id="textColor"
                name="textColor"
                type="color"
                value={sectionData.textColor}
                onChange={handleChange}
                className="w-12 h-10 p-1"
              />
              <Input
                type="text"
                name="textColor"
                value={sectionData.textColor}
                onChange={handleChange}
                placeholder="#000000"
                className="flex-1"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <ImageUpload
            onImageSelected={handleImageSelected}
            currentImageUrl={sectionData.imageUrl}
            label="Imagem de Fundo"
            helpText="Adicione uma imagem de fundo para a seção hero (opcional)"
          />
          <p className="text-xs text-muted-foreground">
            {sectionData.imageUrl ? 
              "A imagem de fundo terá prioridade sobre a cor de fundo" : 
              "Se não definir uma imagem, a cor de fundo será utilizada"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
