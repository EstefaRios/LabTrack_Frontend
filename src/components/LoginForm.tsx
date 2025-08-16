import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginPaciente } from '../api/auth';
import { useAuthStore } from '../store/auth.store';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setToken } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    tipoIdentificacion: "",
    numeroIdentificacion: "",
    fechaNacimiento: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      console.log('Datos enviados:', {
        tipo: formData.tipoIdentificacion,
        numero: formData.numeroIdentificacion,
        fechaNacimiento: formData.fechaNacimiento
      });
      
      const response = await loginPaciente({
        tipo: formData.tipoIdentificacion,
        numero: formData.numeroIdentificacion,
        fechaNacimiento: formData.fechaNacimiento
      });
      
      console.log('Respuesta del servidor:', response);
      setToken(response.access_token);
      
      // Siempre redireccionar al home después del login
      navigate('/home', { replace: true });
    } catch (err: unknown) {
      console.error('Error completo:', err);
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      console.error('Error response:', error.response);
      const errorMessage = error.response?.data?.message || error.message || 'Error al iniciar sesión';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md shadow-2xl border border-blue-200/20 bg-white/95 backdrop-blur-lg relative z-10 rounded-lg">
      <div className="space-y-2 pb-4 p-6">
        <div className="flex justify-center lg:hidden mb-2">
          <img src="/src/assets/images/labtrack.png" alt="LabTrack" className="h-12 w-auto rounded-lg" />
        </div>

        <div className="text-center lg:text-left">
          <h1 className="text-2xl font-bold text-slate-800 font-sans mb-1">Iniciar Sesión</h1>
          <p className="text-slate-600 text-sm font-sans">
            Ingrese sus datos para acceder a sus resultados de laboratorio
          </p>
        </div>
      </div>

      <div className="pt-2 px-6 pb-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="tipo-identificacion" className="text-sm font-medium text-slate-800 font-sans">
              Tipo de Identificación
            </label>
            <select
              id="tipo-identificacion"
              className="w-full h-12 px-4 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-sans"
              value={formData.tipoIdentificacion}
              onChange={(e) => setFormData({ ...formData, tipoIdentificacion: e.target.value })}
              required
            >
              <option value="">Seleccione tipo de documento</option>
              <option value="CC">Cédula de Ciudadanía</option>
              <option value="CE">Cédula de Extranjería</option>
              <option value="PA">Pasaporte</option>
              <option value="TI">Tarjeta de Identidad</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="numero-identificacion" className="text-sm font-medium text-slate-800 font-sans">
              Número de Identificación
            </label>
            <input
              id="numero-identificacion"
              type="text"
              placeholder="Ingrese su número de documento"
              value={formData.numeroIdentificacion}
              onChange={(e) => setFormData({ ...formData, numeroIdentificacion: e.target.value })}
              className="w-full h-12 px-4 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-sans"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="fecha-nacimiento" className="text-sm font-medium text-slate-800 font-sans">
              Fecha de Nacimiento
            </label>
            <input
              id="fecha-nacimiento"
              type="date"
              value={formData.fechaNacimiento}
              onChange={(e) => setFormData({ ...formData, fechaNacimiento: e.target.value })}
              className="w-full h-12 px-4 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-sans"
              required
            />
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700 text-sm font-medium flex items-center">
                <span className="mr-2">⚠️</span>
                {error}
              </p>
            </div>
          )}

          <button
            type="submit"
            className="w-full h-12 bg-slate-700 hover:bg-slate-800 text-white border border-slate-700 hover:border-slate-800 font-semibold text-base transition-all duration-200 shadow-lg hover:shadow-xl font-sans mt-6 rounded-md"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-blue-900/30 border-t-blue-900 rounded-full animate-spin"></div>
                <span>Verificando...</span>
              </div>
            ) : (
              "Ingresar"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;