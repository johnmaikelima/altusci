// Funções básicas de autenticação para uso nas rotas API

/**
 * Verifica se o usuário está autenticado com base no token da requisição
 * @param req Objeto de requisição
 * @returns Boolean indicando se o usuário está autenticado
 */
export async function isAuthenticated(req: Request): Promise<boolean> {
  try {
    // Obter o token de autorização do cabeçalho
    const authHeader = req.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return false;
    }
    
    // Em uma implementação real, você verificaria o token JWT
    // Por enquanto, apenas verificamos se existe um token
    const token = authHeader.split(' ')[1];
    return !!token;
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
