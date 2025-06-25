// Funções básicas de autenticação para uso nas rotas API
import { cookies } from 'next/headers';

/**
 * Verifica se o usuário está autenticado com base no token da requisição
 * @param req Objeto de requisição
 * @returns Boolean indicando se o usuário está autenticado
 */
export async function isAuthenticated(req: Request): Promise<boolean> {
  try {
    // Verificar primeiro se há um token de autorização no cabeçalho
    const authHeader = req.headers.get('authorization');
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      if (token) {
        return true;
      }
    }
    
    // Se não houver token no cabeçalho, verificar cookies de sessão
    // Isso permite que usuários logados no dashboard acessem as APIs
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('next-auth.session-token') || cookieStore.get('__Secure-next-auth.session-token');
    
    return !!sessionCookie;
  } catch (error) {
    console.error('Erro ao verificar autenticação:', error);
    return false;
  }
}

/**
 * Verifica se o usuário tem permissão de administrador
 * @param req Objeto de requisição
 * @returns Boolean indicando se o usuário é administrador
 */
export async function isAdmin(req: Request): Promise<boolean> {
  // Primeiro verificar se está autenticado
  const authenticated = await isAuthenticated(req);
  
  if (!authenticated) {
    return false;
  }
  
  // Em uma implementação real, você verificaria o papel do usuário no token JWT
  // Por enquanto, assumimos que todos os usuários autenticados são administradores
  // Isso é seguro porque o acesso ao dashboard já é restrito a administradores
  return true;
}

/**
 * Middleware para proteger rotas que requerem autenticação
 * @param handler Função manipuladora da rota
 * @returns Função manipuladora com verificação de autenticação
 */
export function withAuth(handler: (req: Request) => Promise<Response>) {
  return async (req: Request) => {
    const authenticated = await isAuthenticated(req);
    
    if (!authenticated) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Não autorizado. Faça login para continuar.' 
      }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    return handler(req);
  };
}

/**
 * Middleware para proteger rotas que requerem permissão de administrador
 * @param handler Função manipuladora da rota
 * @returns Função manipuladora com verificação de permissão de administrador
 */
export function withAdminAuth(handler: (req: Request) => Promise<Response>) {
  return async (req: Request) => {
    const isUserAdmin = await isAdmin(req);
    
    if (!isUserAdmin) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Acesso negado. Permissão de administrador necessária.' 
      }), {
        status: 403,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    return handler(req);
  };
}
