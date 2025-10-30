import React, { useState, useEffect } from 'react';
import { Search, Shield, User, Trash2, Mail, Calendar } from 'lucide-react';
import api from '../utils/api';
import Header from '../components/Header';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    fetchUsuarios();
  }, []);

  useEffect(() => {
    filterUsuarios();
  }, [usuarios, searchTerm, roleFilter]);

  const fetchUsuarios = async () => {
    try {
      const response = await api.get('/users');
      setUsuarios(response.data);
    } catch (error) {
      console.error('Erro ao carregar utilizadores:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterUsuarios = () => {
    let filtered = [...usuarios];

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    setFilteredUsuarios(filtered);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja eliminar este utilizador?')) return;
    
    try {
      await api.delete(`/users/${id}`);
      fetchUsuarios();
    } catch (error) {
      console.error('Erro ao eliminar utilizador:', error);
      alert('Erro ao eliminar utilizador');
    }
  };

  const toggleRole = async (id, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (!window.confirm(`Alterar utilizador para ${newRole === 'admin' ? 'Administrador' : 'Utilizador'}?`)) return;
    
    try {
      await api.put(`/users/${id}/role`, { role: newRole });
      fetchUsuarios();
    } catch (error) {
      console.error('Erro ao alterar role:', error);
      alert('Erro ao alterar role do utilizador');
    }
  };

  const getRoleBadge = (role) => {
    if (role === 'admin') {
      return (
        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold border border-purple-200 flex items-center">
          <Shield size={12} className="mr-1" />
          Admin
        </span>
      );
    }
    return (
      <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold border border-gray-200 flex items-center">
        <User size={12} className="mr-1" />
        Utilizador
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
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
      <Header title="Gestão de Utilizadores" />

      <div className="p-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Utilizadores</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{usuarios.length}</p>
              </div>
              <User className="text-blue-600" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Administradores</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">
                  {usuarios.filter(u => u.role === 'admin').length}
                </p>
              </div>
              <Shield className="text-purple-600" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Utilizadores Normais</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {usuarios.filter(u => u.role === 'user').length}
                </p>
              </div>
              <User className="text-green-600" size={32} />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Pesquisar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todas as Funções</option>
              <option value="admin">Apenas Administradores</option>
              <option value="user">Apenas Utilizadores</option>
            </select>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            A mostrar {filteredUsuarios.length} de {usuarios.length} utilizadores
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilizador
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Função
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data de Registo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsuarios.map((usuario) => (
                  <tr key={usuario._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {usuario.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{usuario.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail size={14} className="mr-1" />
                        {usuario.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRoleBadge(usuario.role)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-1" />
                        {formatDate(usuario.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => toggleRole(usuario._id, usuario.role)}
                          className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                            usuario.role === 'admin'
                              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                          }`}
                        >
                          {usuario.role === 'admin' ? 'Remover Admin' : 'Tornar Admin'}
                        </button>
                        <button
                          onClick={() => handleDelete(usuario._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsuarios.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhum utilizador encontrado</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Usuarios;
