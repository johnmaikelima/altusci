'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Send } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';

interface ContactFormProps {
  captchaEnabled?: boolean;
  termsEnabled?: boolean;
}

export default function ContactForm({ captchaEnabled = true, termsEnabled = true }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    phone: '',
    message: '',
    captchaAnswer: '',
    acceptTerms: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { toast } = useToast();
  
  // Captcha simples - usando useState com inicialização lazy para evitar erro de hidratação
  const [captcha, setCaptcha] = useState<{num1: number, num2: number} | null>(null);
  
  // Inicializar captcha apenas no lado do cliente após a montagem do componente
  useEffect(() => {
    setCaptcha({
      num1: Math.floor(Math.random() * 10),
      num2: Math.floor(Math.random() * 10),
    });
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, acceptTerms: checked }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verificar termos
    if (termsEnabled && !formData.acceptTerms) {
      toast({
        title: "Termos não aceitos",
        description: "Você precisa aceitar os termos de privacidade para enviar o formulário.",
        variant: "destructive",
      });
      return;
    }
    
    // Verificar captcha
    if (captchaEnabled && captcha) {
      const correctAnswer = (captcha.num1 + captcha.num2).toString();
      if (formData.captchaAnswer !== correctAnswer) {
        toast({
          title: "Erro de verificação",
          description: "A resposta do captcha está incorreta. Por favor, tente novamente.",
          variant: "destructive",
        });
        return;
      }
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        setFormStatus('success');
        setFormData({
          name: '',
          email: '',
          subject: '',
          phone: '',
          message: '',
          captchaAnswer: '',
          acceptTerms: false
        });
        // Gerar novo captcha
        setCaptcha({
          num1: Math.floor(Math.random() * 10),
          num2: Math.floor(Math.random() * 10),
        });
        toast({
          title: "Mensagem enviada",
          description: "Sua mensagem foi enviada com sucesso. Entraremos em contato em breve.",
          variant: "default",
        });
      } else {
        setFormStatus('error');
        toast({
          title: "Erro ao enviar",
          description: "Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente mais tarde.",
          variant: "destructive",
        });
      }
    } catch (error) {
      setFormStatus('error');
      toast({
        title: "Erro ao enviar",
        description: "Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome</Label>
          <Input 
            id="name" 
            name="name" 
            placeholder="Seu nome" 
            required 
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            name="email" 
            type="email" 
            placeholder="seu.email@exemplo.com" 
            required 
            value={formData.email}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="subject">Assunto</Label>
          <Input 
            id="subject" 
            name="subject" 
            placeholder="Assunto da mensagem" 
            required 
            value={formData.subject}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">WhatsApp</Label>
          <Input 
            id="phone" 
            name="phone" 
            placeholder="(00) 00000-0000" 
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="message">Mensagem</Label>
        <Textarea 
          id="message" 
          name="message" 
          placeholder="Digite sua mensagem aqui..." 
          rows={5} 
          required 
          value={formData.message}
          onChange={handleChange}
        />
      </div>
      
      {termsEnabled && (
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="acceptTerms" 
            checked={formData.acceptTerms} 
            onCheckedChange={handleCheckboxChange} 
          />
          <Label htmlFor="acceptTerms" className="text-sm">
            Concordo com a <Link href="/politica-de-privacidade" className="text-primary hover:underline">Política de Privacidade</Link>
          </Label>
        </div>
      )}
      
      {captchaEnabled && captcha && (
        <div className="space-y-2">
          <Label htmlFor="captcha">
            Verificação: Quanto é {captcha.num1} + {captcha.num2}?
          </Label>
          <Input 
            id="captchaAnswer" 
            name="captchaAnswer" 
            placeholder="Digite a resposta" 
            required 
            value={formData.captchaAnswer}
            onChange={handleChange}
          />
        </div>
      )}
      
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Enviando...
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Enviar Mensagem
          </>
        )}
      </Button>
    </form>
  );
}
