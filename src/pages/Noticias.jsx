import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Image as ImageIcon, Calendar, Eye } from 'lucide-react';
import api from '../utils/api';
import Header from '../components/Header';

const Noticias = () => {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingNoticia, setEditingNoticia] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: '',
    category: 'geral'
  });

  useEffect(() => {
    fetchNoticias();
  }, []);

  const fetchNoticias = async () => {
    try {
      const response = await api.get('/noticias');
      setNoticias(response.data);
    } catch (error) {
      console.error('Erro ao carregar notícias:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingNoticia) {
        await api.put(`/noticias/${editingNoticia._id}`, formData);
      } else {
        await api.post('/noticias', formData);
      }
      fetchNoticias();
      closeModal();
    } catch (error) {
      console.error('Erro ao salvar notícia:', error);
      alert('Erro ao salvar notícia');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja eliminar esta notícia?')) return;
    
    try {
      await api.delete(`/noticias/${id}`);
      fetchNoticias();
    } catch (error) {
      console.error('Erro ao eliminar notícia:', error);
      alert('Erro ao eliminar notícia');
    }
  };

  const openModal = (noticia = null) => {
    if (noticia) {
      setEditingNoticia(noticia);
      setFormData({
        title: noticia.title,
        content: noticia.content,
        image: noticia.image || '',
        category: noticia.category || 'geral'
      });
    } else {
      setEditingNoticia(null);
      setFormData({
        title: '',
        content: '',
        image: '',
        category: 'geral'
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingNoticia(null);
    setFormData({
      title: '',
      content: '',
      image: '',
      category: 'geral'
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <Header title="Gestão de Notícias" />

      <div className="p-8">
        {/* Add Button */}
        <div className="mb-6">
          <button
            onClick={() => openModal()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 font-semibold"
          >
            <Plus size={20} />
            <span>Adicionar Notícia</span>
          </button>
        </div>

        {/* Noticias Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {noticias.map((noticia) => (
            <div key={noticia._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {noticia.image && (
                <img
                  src={noticia.image}
                  alt={noticia.title}
                  className="w-full h-48 object-cover"
                />
              )}
              {!noticia.image && (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <ImageIcon className="text-gray-400" size={48} />
                </div>
              )}

              <div className="p-6">
                <div className="flex items-center text-xs text-gray-500 mb-2">
                  <Calendar size={14} className="mr-1" />
                  {formatDate(noticia.createdAt)}
                </div>

                <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                  {noticia.title}
                </h3>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {noticia.content}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {noticia.category}
                  </span>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => openModal(noticia)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(noticia._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {noticias.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-500">Nenhuma notícia criada ainda</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">
                {editingNoticia ? 'Editar Notícia' : 'Adicionar Notícia'}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="geral">Geral</option>
                  <option value="eventos">Eventos</option>
                  <option value="obras">Obras</option>
                  <option value="avisos">Avisos</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Conteúdo *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL da Imagem
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://exemplo.com/imagem.jpg"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {formData.image && (
                  <div className="mt-2">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  {editingNoticia ? 'Atualizar' : 'Criar'} Notícia
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Noticias;
