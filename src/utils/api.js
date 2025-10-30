import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://portal-freguesias-freguesia-api.3isjct.easypanel.host/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use(
  (config) => {
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

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
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


// === Multipart helpers for news & incidents (added) ===
export const newsService = {
  async create(data, files=[]) {
    const form = new FormData();
    form.append('data', JSON.stringify(data));
    (files||[]).forEach(f=>form.append('images', f));
    const res = await api.post('/api/news', form, { headers:{ 'Content-Type':'multipart/form-data' }});
    return res.data;
  },
  async update(id, data, files=[]) {
    const form = new FormData();
    form.append('data', JSON.stringify(data));
    (files||[]).forEach(f=>form.append('images', f));
    const res = await api.put(`/api/news/${id}`, form, { headers:{ 'Content-Type':'multipart/form-data' }});
    return res.data;
  }
};

export const incidentsService = {
  async create(data, files=[]) {
    const form = new FormData();
    form.append('data', JSON.stringify(data));
    (files||[]).forEach(f=>form.append('images', f));
    const res = await api.post('/api/incidents', form, { headers:{ 'Content-Type':'multipart/form-data' }});
    return res.data;
  },
  async update(id, data, files=[]) {
    const form = new FormData();
    form.append('data', JSON.stringify(data));
    (files||[]).forEach(f=>form.append('images', f));
    const res = await api.put(`/api/incidents/${id}`, form, { headers:{ 'Content-Type':'multipart/form-data' }});
    return res.data;
  }
};
