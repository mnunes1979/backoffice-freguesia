import React, { useState } from 'react';
import { Save, Lock, Bell, Globe, Database } from 'lucide-react';
import Header from '../components/Header';

const Configuracoes = () => {
  const [saved, setSaved] = useState(false);
  const [config, setConfig] = useState({
    siteName: 'União de Freguesias',
    siteDescription: 'Portal de transparência e gestão cidadã',
    contactEmail: 'geral@freguesia.pt',
    contactPhone: '+351 258 000 000',
    address: 'Rua Principal, 4990-000 Ponte de Lima',
    facebookUrl: '',
    instagramUrl: '',
    emailNotifications: true,
    publicIncidences: true,
    requireApproval: true,
  });

  const handleSave = (e) => {
    e.preventDefault();
    // Aqui seria guardado no backend
    localStorage.setItem('siteConfig', JSON.stringify(config));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <Header title="Configurações" />

      <div className="p-8">
        <form onSubmit={handleSave} className="max-w-4xl">
          {/* Site Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center mb-4">
              <Globe className="text-blue-600 mr-2" size={24} />
              <h3 className="text-lg font-bold text-gray-800">Informações do Site</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Site
                </label>
                <input
                  type="text"
                  value={config.siteName}
                  onChange={(e) => setConfig({ ...config, siteName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  value={config.siteDescription}
                  onChange={(e) => setConfig({ ...config, siteDescription: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email de Contacto
                  </label>
                  <input
                    type="email"
                    value={config.contactEmail}
                    onChange={(e) => setConfig({ ...config, contactEmail: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    value={config.contactPhone}
                    onChange={(e) => setConfig({ ...config, contactPhone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Morada
                </label>
                <input
                  type="text"
                  value={config.address}
                  onChange={(e) => setConfig({ ...config, address: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center mb-4">
              <Globe className="text-blue-600 mr-2" size={24} />
              <h3 className="text-lg font-bold text-gray-800">Redes Sociais</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL do Facebook
                </label>
                <input
                  type="url"
                  value={config.facebookUrl}
                  onChange={(e) => setConfig({ ...config, facebookUrl: e.target.value })}
                  placeholder="https://facebook.com/..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL do Instagram
                </label>
                <input
                  type="url"
                  value={config.instagramUrl}
                  onChange={(e) => setConfig({ ...config, instagramUrl: e.target.value })}
                  placeholder="https://instagram.com/..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center mb-4">
              <Bell className="text-blue-600 mr-2" size={24} />
              <h3 className="text-lg font-bold text-gray-800">Notificações</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">Notificações por Email</p>
                  <p className="text-sm text-gray-600">Receber emails de novas incidências</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.emailNotifications}
                    onChange={(e) => setConfig({ ...config, emailNotifications: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Incidences Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center mb-4">
              <Database className="text-blue-600 mr-2" size={24} />
              <h3 className="text-lg font-bold text-gray-800">Gestão de Incidências</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">Incidências Públicas</p>
                  <p className="text-sm text-gray-600">Mostrar incidências no portal público</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.publicIncidences}
                    onChange={(e) => setConfig({ ...config, publicIncidences: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">Aprovação Manual</p>
                  <p className="text-sm text-gray-600">Incidências precisam aprovação antes de serem públicas</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.requireApproval}
                    onChange={(e) => setConfig({ ...config, requireApproval: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* API Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-bold text-blue-800 mb-3">Informações da API</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start">
                <Database className="text-blue-600 mr-2 flex-shrink-0 mt-1" size={16} />
                <div>
                  <p className="font-semibold text-blue-900">Backend URL:</p>
                  <p className="text-blue-700 font-mono text-xs break-all">
                    https://portal-freguesias-freguesia-api.3isjct.easypanel.host/api
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Lock className="text-blue-600 mr-2 flex-shrink-0 mt-1" size={16} />
                <div>
                  <p className="font-semibold text-blue-900">Status:</p>
                  <p className="text-blue-700">Conectado e Funcional</p>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center space-x-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 font-semibold"
            >
              <Save size={20} />
              <span>Guardar Configurações</span>
            </button>

            {saved && (
              <div className="text-green-600 font-medium flex items-center">
                ✓ Configurações guardadas com sucesso!
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Configuracoes;
