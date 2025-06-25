import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import BlogSettingsModel from '@/models/blog-settings';
import { withAdminAuth } from '@/lib/auth';

export const POST = withAdminAuth(async (req: Request) => {
  try {
    await connectToDatabase();
    
    const data = await req.json();
    const { section, settings } = data;
    
    if (!section || !settings) {
      return NextResponse.json(
        { error: 'Seção e configurações são obrigatórias' },
        { status: 400 }
      );
    }
    
    // Buscar configurações ou criar se não existirem
    let blogSettings = await BlogSettingsModel.findOne();
    
    if (!blogSettings) {
      blogSettings = new BlogSettingsModel();
    }
    
    // Atualizar apenas a seção específica
    switch (section) {
      case 'smtp':
        blogSettings.smtp = {
          ...blogSettings.smtp,
          ...settings,
          auth: {
            ...blogSettings.smtp?.auth,
            ...settings.auth
          }
        };
        break;
        
      case 'contactForm':
        blogSettings.contactForm = {
          ...blogSettings.contactForm,
          ...settings
        };
        break;
        
      case 'whatsapp':
        blogSettings.whatsappConfig = {
          ...blogSettings.whatsappConfig,
          ...settings
        };
        break;
        
      case 'contact':
        if (settings.contactEmail !== undefined) blogSettings.contactEmail = settings.contactEmail;
        if (settings.contactPhone !== undefined) blogSettings.contactPhone = settings.contactPhone;
        if (settings.contactWhatsapp !== undefined) blogSettings.contactWhatsapp = settings.contactWhatsapp;
        break;
        
      case 'address':
        blogSettings.address = {
          ...blogSettings.address,
          ...settings
        };
        break;
        
      default:
        return NextResponse.json(
          { error: 'Seção inválida' },
          { status: 400 }
        );
    }
    
    await blogSettings.save();
    
    return NextResponse.json({
      success: true,
      message: `Configurações de ${section} atualizadas com sucesso`,
      settings: blogSettings
    });
  } catch (error) {
    console.error('Erro ao atualizar configurações:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar configurações', message: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
});
