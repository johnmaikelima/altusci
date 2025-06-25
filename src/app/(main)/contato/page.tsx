import { Metadata } from 'next';
import Link from 'next/link';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import MapEmbed from '@/components/contact/map-embed';
import ContactForm from '@/components/contact/contact-form';
import { getServerSettings } from '@/lib';

// Função para gerar metadados dinâmicos para a página
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getServerSettings();
  
  return {
    title: settings?.name ? `Contato - ${settings.name}` : 'Contato',
    description: settings?.description || 'Entre em contato conosco para mais informações',
  };
}

export default async function ContatoPage() {
  // Buscar configurações do blog usando a função auxiliar
  const settings = await getServerSettings();
  
  // Se não houver configurações, mostrar uma mensagem
  if (!settings) {
    return (
      <div className="container mx-auto py-12">
        <h1 className="text-4xl font-bold text-center mb-8">Entre em Contato</h1>
        <p className="text-center text-muted-foreground">Carregando informações de contato...</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-center mb-4">Entre em Contato</h1>
      <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
        Estamos prontos para atender suas necessidades. Entre em contato conosco através do formulário ou utilize os canais diretos abaixo.
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Card de informações de contato */}
        <Card className="h-full shadow-lg border-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          <CardHeader>
            <CardTitle className="text-2xl">Informações de Contato</CardTitle>
            <CardDescription>Escolha a melhor forma de nos contatar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {settings?.contactEmail && (
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Email</h3>
                  <a href={`mailto:${settings.contactEmail}`} className="text-primary hover:underline">
                    {settings.contactEmail}
                  </a>
                </div>
              </div>
            )}
            
            {settings?.contactPhone && (
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">WhatsApp</h3>
                  <a href={`https://wa.me/${settings.contactPhone.replace(/\D/g, '')}`} className="text-primary hover:underline">
                    {settings.contactPhone}
                  </a>
                </div>
              </div>
            )}
            
            {settings?.contactAddress && (
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Endereço</h3>
                  <p className="text-muted-foreground">{settings.contactAddress}</p>
                  {settings?.contactHours && (
                    <div className="mt-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{settings.contactHours}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Mapa */}
            {settings?.contactAddress && (
              <div className="mt-8">
                <MapEmbed 
                  address={settings.contactAddress} 
                  height="200"
                  className="rounded-lg shadow-md"
                />
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Formulário de contato */}
        {settings?.contactForm?.enabled && (
          <Card className="h-full shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-2xl">Envie uma mensagem</CardTitle>
              <CardDescription>Preencha o formulário abaixo e entraremos em contato o mais breve possível.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-2">
                  Ao enviar este formulário, você concorda com nossa <Link href="/politica-de-privacidade" className="text-primary hover:underline">Política de Privacidade</Link>.
                </p>
              </div>
              
              <ContactForm 
                captchaEnabled={settings?.contactForm?.captchaEnabled} 
                termsEnabled={true}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
