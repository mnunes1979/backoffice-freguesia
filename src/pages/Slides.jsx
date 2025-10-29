import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Image as ImageIcon, Eye, EyeOff } from 'lucide-react';
import api from '../api';
import Header from '../components/Header';
import ImageUpload from '../components/ImageUpload';

const Slides = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    order: 1
  });

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const response = await api.get('/slides');
      setSlides(response.data);
    } catch (error) {
      console.error('Erro ao carregar slides:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/slides', formData);
      fetchSlides();
      closeModal();
    } catch (error) {
      console.error('Erro ao adicionar slide:', error);
      alert('Erro ao adicionar slide');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja eliminar este slide?')) return;
    
    try {
      await api.delete(`/slides/${id}`);
      fetchSlides();
    } catch (error) {
      console.error('Erro ao eliminar slide:', error);
      alert('Erro ao eliminar slide');
    }
  };

  const toggleActive = async (id, currentStatus) => {
    try {
      await api.put(`/slides/${id}`, { active: !currentStatus });
      fetchSlides();
    } catch (error) {
      console.error('Erro ao atualizar slide:', error);
      alert('Erro ao atualizar slide');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({
      title: '',
      image: '',
      order: 1
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
      <Header title="Gestão de Slides" />

      <div className="p-8">
        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-800 text-sm">
            <strong>💡 Dica:</strong> Os slides aparecem na página principal em rotação automática. 
            Use imagens com dimensões 1920x600 pixels para melhor visualização.
          </p>
        </div>

        {/* Add Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 font-semibold"
          >
            <Plus size={20} />
            <span>Adicionar Slide</span>
          </button>
        </div>

        {/* Slides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {slides.map((slide) => (
            <div key={slide._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x200?text=Imagem+Não+Disponível';
                  }}
                />
                {!slide.active && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-semibold bg-red-600 px-4 py-2 rounded-full">
                      Inativo
                    </span>
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {slide.title}
                </h3>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <span>Ordem: {slide.order}</span>
                  <span className={`px-2 py-1 rounded ${slide.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {slide.active ? 'Ativo' : 'Inativo'}
                  </span>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => toggleActive(slide._id, slide.active)}
                    className={`flex-1 py-2 rounded-lg transition-colors font-semibold ${
                      slide.active
                        ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    }`}
                  >
                    {slide.active ? (
                      <span className="flex items-center justify-center">
                        <EyeOff size={16} className="mr-1" />
                        Desativar
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <Eye size={16} className="mr-1" />
                        Ativar
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(slide._id)}
                    className="px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {slides.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <ImageIcon className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500">Nenhum slide criado ainda</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-xl w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">Adicionar Novo Slide</h3>
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
                  placeholder="Ex: Festa de São João 2025"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <ImageUpload
                  label="Imagem do Slide"
                  value={formData.image}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                  maxSizeMB={2}
                  required={false}
                />
                <p className="text-xs text-gray-500 mt-2">
                  💡 Recomendado: 1920x600 pixels • A imagem será comprimida automaticamente
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ordem de Exibição
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Slides com ordem menor aparecem primeiro
                </p>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Adicionar Slide
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

export default Slides;
