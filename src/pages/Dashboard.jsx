import React, { useState, useEffect } from 'react';
import { AlertTriangle, Newspaper, Users, Image, TrendingUp, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../api';
import Header from '../components/Header';

const Dashboard = () => {
  const [stats, setStats] = useState({
    incidencias: { total: 0, pendentes: 0, emAnalise: 0, emResolucao: 0, resolvidas: 0 },
    noticias: 0,
    usuarios: 0,
    slides: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [incidenciasRes, noticiasRes, usuariosRes, slidesRes] = await Promise.all([
        api.get('/incidencias'),
        api.get('/noticias'),
        api.get('/users'),
        api.get('/slides')
      ]);

      const incidencias = incidenciasRes.data;
      const stats = {
        incidencias: {
          total: incidencias.length,
          pendentes: incidencias.filter(i => i.status === 'pendente').length,
          emAnalise: incidencias.filter(i => i.status === 'em_analise').length,
          emResolucao: incidencias.filter(i => i.status === 'em_resolucao').length,
          resolvidas: incidencias.filter(i => i.status === 'resolvida').length,
        },
        noticias: noticiasRes.data.length,
        usuarios: usuariosRes.data.length,
        slides: slidesRes.data.length
      };

      setStats(stats);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const incidenciasData = [
    { name: 'Pendentes', value: stats.incidencias.pendentes, color: '#fbbf24' },
    { name: 'Em Análise', value: stats.incidencias.emAnalise, color: '#3b82f6' },
    { name: 'Em Resolução', value: stats.incidencias.emResolucao, color: '#f97316' },
    { name: 'Resolvidas', value: stats.incidencias.resolvidas, color: '#10b981' },
  ];

  const barChartData = [
    { name: 'Incidências', total: stats.incidencias.total },
    { name: 'Notícias', total: stats.noticias },
    { name: 'Utilizadores', total: stats.usuarios },
    { name: 'Slides', total: stats.slides },
  ];

  const StatCard = ({ icon: Icon, title, value, color, subtitle }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
          {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
        </div>
        <div className={`${color} bg-opacity-10 p-3 rounded-lg`}>
          <Icon className={color} size={28} />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <Header title="Dashboard" />
      
      <div className="p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={AlertTriangle}
            title="Total Incidências"
            value={stats.incidencias.total}
            color="text-blue-600"
            subtitle={`${stats.incidencias.pendentes} pendentes`}
          />
          <StatCard
            icon={Newspaper}
            title="Notícias"
            value={stats.noticias}
            color="text-green-600"
          />
          <StatCard
            icon={Users}
            title="Utilizadores"
            value={stats.usuarios}
            color="text-purple-600"
          />
          <StatCard
            icon={Image}
            title="Slides Ativos"
            value={stats.slides}
            color="text-orange-600"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Bar Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <TrendingUp className="mr-2" size={20} />
              Visão Geral
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Clock className="mr-2" size={20} />
              Estado das Incidências
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={incidenciasData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {incidenciasData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Incidências Details */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Detalhes das Incidências
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-yellow-800 font-semibold text-2xl">{stats.incidencias.pendentes}</p>
              <p className="text-yellow-600 text-sm mt-1">Pendentes</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-blue-800 font-semibold text-2xl">{stats.incidencias.emAnalise}</p>
              <p className="text-blue-600 text-sm mt-1">Em Análise</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <p className="text-orange-800 font-semibold text-2xl">{stats.incidencias.emResolucao}</p>
              <p className="text-orange-600 text-sm mt-1">Em Resolução</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-green-800 font-semibold text-2xl">{stats.incidencias.resolvidas}</p>
              <p className="text-green-600 text-sm mt-1">Resolvidas</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
