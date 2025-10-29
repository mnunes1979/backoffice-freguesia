import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://portal-freguesias-freguesia-api.3isjct.easypanel.host/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================
// MAPEAMENTO DE ENDPOINTS
// Mapeia os endpoints antigos para os novos
// ============================================

const endpointMapping = {
  // Notícias: /noticias → /news
  '/noticias': '/news',
  
  // Incidências: /incidencias → /incidents
  '/incidencias': '/incidents',
  
  // Utilizadores: /users → /admin/users
  '/users': '/admin/users',
  
  // Links e Slides já estão corretos, mas incluímos para clareza
  '/links': '/links',
  '/slides': '/slides',
};

// Função para mapear URL
const mapUrl = (url) => {
  if (!url) return url;
  
  // Extrair o path base (sem query params e IDs)
  const urlParts = url.split('?');
  let path = urlParts[0];
  const queryParams = urlParts[1] ? `?${urlParts[1]}` : '';
  
  // Verificar cada mapeamento
  for (const [oldPath, newPath] of Object.entries(endpointMapping)) {
    if (path === oldPath) {
      // Match exato
      return `${newPath}${queryParams}`;
    } else if (path.startsWith(oldPath + '/')) {
      // Match com ID ou subpath (ex: /noticias/123 → /news/123)
      const remainder = path.substring(oldPath.length);
      return `${newPath}${remainder}${queryParams}`;
    }
  }
  
  return url;
};

// Interceptor para mapear endpoints ANTES de enviar
api.interceptors.request.use(
  (config) => {
    // Mapear URL
    if (config.url) {
      const originalUrl = config.url;
      config.url = mapUrl(config.url);
      
      // Log para debug (remove em produção)
      if (originalUrl !== config.url) {
        console.log(`🔄 API mapping: ${originalUrl} → ${config.url}`);
      }
    }
    
    // Adicionar token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ============================================
// TRANSFORMAÇÃO AUTOMÁTICA DE RESPOSTAS
// Backend responde: { success, data: { news: [...] } }
// Backoffice espera: response.data = [...]
// ============================================

const transformResponse = (response) => {
  // Se não há data ou não é do backend, retorna como está
  if (!response || !response.data) {
    return response;
  }
  
  const data = response.data;
  
  // Se resposta tem formato do backend: { success, data: { ... } }
  if (data.success !== undefined && data.data) {
    // Extrair o conteúdo real (news, incidents, etc)
    const innerData = data.data;
    
    // Se innerData tem apenas uma propriedade, usar o valor dela
    const keys = Object.keys(innerData);
    if (keys.length === 1) {
      // Ex: { news: [...] } → retorna o array diretamente
      response.data = innerData[keys[0]];
      console.log(`🔄 Transformed response: ${keys[0]} array`);
    } else {
      // Se tem múltiplas propriedades, retorna o innerData
      response.data = innerData;
      console.log(`🔄 Transformed response: multiple keys`);
    }
  }
  
  return response;
};

// Interceptor para tratar respostas e erros
api.interceptors.response.use(
  (response) => {
    // Transformar resposta
    response = transformResponse(response);
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
