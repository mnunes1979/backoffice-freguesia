import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader } from 'lucide-react';
import imageCompression from 'browser-image-compression';

const ImageUpload = ({ value, onChange, label = "Imagem", maxSizeMB = 1, required = false }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(value || null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // Opções de compressão
  const compressionOptions = {
    maxSizeMB: maxSizeMB,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: 'image/jpeg',
  };

  const compressImage = async (file) => {
    try {
      console.log(`📦 Tamanho original: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
      
      const compressedFile = await imageCompression(file, compressionOptions);
      
      console.log(`✅ Tamanho comprimido: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`);
      console.log(`📉 Redução: ${(((file.size - compressedFile.size) / file.size) * 100).toFixed(1)}%`);
      
      return compressedFile;
    } catch (error) {
      console.error('Erro ao comprimir imagem:', error);
      throw error;
    }
  };

  const uploadToServer = async (file) => {
    try {
      setIsUploading(true);
      setError('');

      // Primeiro comprimir a imagem
      const compressedFile = await compressImage(file);

      // Criar FormData
      const formData = new FormData();
      formData.append('image', compressedFile, compressedFile.name || 'image.jpg');

      // Upload para o servidor
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'https://portal-freguesias-freguesia-api.3isjct.easypanel.host/api';
      
      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Erro ao fazer upload da imagem');
      }

      const data = await response.json();
      
      // A API deve retornar { success: true, data: { url: "https://..." } }
      const imageUrl = data.data?.url || data.url;
      
      if (!imageUrl) {
        throw new Error('URL da imagem não retornada pela API');
      }

      setPreview(imageUrl);
      onChange(imageUrl);
      
      return imageUrl;
    } catch (error) {
      console.error('Erro no upload:', error);
      setError(error.message || 'Erro ao fazer upload da imagem');
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = async (file) => {
    if (!file) return;

    // Validar tipo de ficheiro
    if (!file.type.startsWith('image/')) {
      setError('Por favor selecione apenas ficheiros de imagem');
      return;
    }

    // Validar tamanho (máximo 10MB antes da compressão)
    if (file.size > 10 * 1024 * 1024) {
      setError('Imagem muito grande. Máximo 10MB');
      return;
    }

    try {
      // Mostrar preview local imediatamente
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Fazer upload
      await uploadToServer(file);
    } catch (error) {
      // Erro já tratado no uploadToServer
      setPreview(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange('');
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* Area de Upload / Preview */}
      {!preview ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={openFileDialog}
          className={`
            relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-all duration-200
            ${isDragging 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100'
            }
            ${isUploading ? 'pointer-events-none opacity-50' : ''}
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
            required={required && !preview}
          />

          {isUploading ? (
            <div className="flex flex-col items-center space-y-3">
              <Loader className="text-blue-600 animate-spin" size={48} />
              <p className="text-sm text-gray-600 font-medium">
                A comprimir e fazer upload...
              </p>
              <p className="text-xs text-gray-500">
                Por favor aguarde, não feche a janela
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-3">
              <Upload className="text-gray-400" size={48} />
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Clique para selecionar ou arraste uma imagem
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, WEBP até 10MB • Será comprimida automaticamente
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-64 object-cover rounded-lg border border-gray-200"
            onError={() => {
              setError('Erro ao carregar preview da imagem');
            }}
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors shadow-lg"
            title="Remover imagem"
          >
            <X size={18} />
          </button>
          {isUploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
              <div className="bg-white px-4 py-3 rounded-lg flex items-center space-x-2">
                <Loader className="text-blue-600 animate-spin" size={20} />
                <span className="text-sm font-medium">A processar...</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mensagem de Erro */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start">
          <X className="text-red-600 mt-0.5 mr-2 flex-shrink-0" size={16} />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Informação sobre compressão */}
      {preview && !isUploading && !error && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start">
          <ImageIcon className="text-green-600 mt-0.5 mr-2 flex-shrink-0" size={16} />
          <p className="text-xs text-green-800 font-medium">
            ✓ Imagem carregada e comprimida com sucesso
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
