import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, CheckCircle, XCircle, Clock, MapPin, Calendar, Image as ImageIcon } from 'lucide-react';
import api from '../api';
import Header from '../components/Header';

const Incidencias = () => {
  const [incidencias, setIncidencias] = useState([]);
  const [filteredIncidencias, setFilteredIncidencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedIncidencia, setSelectedIncidencia] = useState(null);

  useEffect(() => {
    fetchIncidencias();
  }, []);

  useEffect(() => {
    filterIncidencias();
  }, [incidencias, searchTerm, statusFilter]);

  const fetchIncidencias = async () => {
    try {
      const response = await api.get('/incidencias');
      setIncidencias(response.data);
    } catch (error) {
      console.error('Erro ao carregar incidências:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterIncidencias = () => {
    let filtered = [...incidencias];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(inc =>
        inc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inc.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(inc => inc.status === statusFilter);
    }

    setFilteredIncidencias(filtered);
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await api.put(`/incidencias/${id}/status`, { status: newStatus });
      fetchIncidencias();
      setSelectedIncidencia(null);
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Erro ao atualizar status');
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pendente: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      em_analise: 'bg-blue-100 text-blue-800 border-blue-200',
      em_resolucao: 'bg-orange-100 text-orange-800 border-orange-200',
      resolvida: 'bg-green-100 text-green-800 border-green-200',
    };

    const labels = {
      pendente: 'Pendente',
      em_analise: 'Em Análise',
      em_resolucao: 'Em Resolução',
      resolvida: 'Resolvida',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
      <Header title="Gestão de Incidências" />

      <div className="p-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Pesquisar por título ou localização..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-3 text-gray-400" size={20} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="all">Todos os Estados</option>
                <option value="pendente">Pendente</option>
                <option value="em_analise">Em Análise</option>
                <option value="em_resolucao">Em Resolução</option>
                <option value="resolvida">Resolvida</option>
              </select>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            A mostrar {filteredIncidencias.length} de {incidencias.length} incidências
          </div>
        </div>

        {/* Incidencias Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Título
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Localização
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredIncidencias.map((incidencia) => (
                  <tr key={incidencia._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {incidencia.photos && incidencia.photos.length > 0 && (
                          <ImageIcon className="text-gray-400 mr-2" size={16} />
                        )}
                        <div className="text-sm font-medium text-gray-900">{incidencia.title}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="mr-1" size={14} />
                        {incidencia.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(incidencia.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="mr-1" size={14} />
                        {formatDate(incidencia.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => setSelectedIncidencia(incidencia)}
                        className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                      >
                        <Eye size={16} className="mr-1" />
                        Ver Detalhes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredIncidencias.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhuma incidência encontrada</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Detalhes */}
      {selectedIncidencia && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">Detalhes da Incidência</h3>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <p className="text-gray-900 font-semibold">{selectedIncidencia.title}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <p className="text-gray-700">{selectedIncidencia.description}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Localização</label>
                <p className="text-gray-900">{selectedIncidencia.location}</p>
              </div>

              {selectedIncidencia.gpsCoordinates && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Coordenadas GPS</label>
                  <p className="text-gray-900 font-mono text-sm">{selectedIncidencia.gpsCoordinates}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado Atual</label>
                {getStatusBadge(selectedIncidencia.status)}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Alterar Estado</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => updateStatus(selectedIncidencia._id, 'pendente')}
                    className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors border border-yellow-300"
                  >
                    Pendente
                  </button>
                  <button
                    onClick={() => updateStatus(selectedIncidencia._id, 'em_analise')}
                    className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors border border-blue-300"
                  >
                    Em Análise
                  </button>
                  <button
                    onClick={() => updateStatus(selectedIncidencia._id, 'em_resolucao')}
                    className="px-4 py-2 bg-orange-100 text-orange-800 rounded-lg hover:bg-orange-200 transition-colors border border-orange-300"
                  >
                    Em Resolução
                  </button>
                  <button
                    onClick={() => updateStatus(selectedIncidencia._id, 'resolvida')}
                    className="px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors border border-green-300"
                  >
                    Resolvida
                  </button>
                </div>
              </div>

              {selectedIncidencia.photos && selectedIncidencia.photos.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fotografias</label>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedIncidencia.photos.map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`Foto ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg border border-gray-200"
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="text-sm text-gray-500">
                <p>Criada em: {formatDate(selectedIncidencia.createdAt)}</p>
                <p>Atualizada em: {formatDate(selectedIncidencia.updatedAt)}</p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setSelectedIncidencia(null)}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Incidencias;
