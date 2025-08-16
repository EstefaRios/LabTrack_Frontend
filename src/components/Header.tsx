import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import { getPerfil } from '../api/paciente';
import { getPersonaIdFromToken } from '../api/client';

interface HeaderProps {
  patientName?: string;
}

const Header: React.FC<HeaderProps> = ({ patientName = "Nombre paciente" }) => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [name, setName] = useState(patientName);
  const [sexoBiologico, setSexoBiologico] = useState<string | null>(null);
  const [showTypewriter, setShowTypewriter] = useState(true);
  const [animationFinished, setAnimationFinished] = useState(false);

  useEffect(() => {
    const personaId = getPersonaIdFromToken();
    if (personaId) {
      getPerfil(personaId)
        .then(p => {
          setName(p?.nombreCompleto ?? patientName);
          setSexoBiologico(p?.sexo);
        })
        .catch(() => {});
    }
  }, [patientName]);

  useEffect(() => {
    // Controlar la duración de la animación de escritura
    const timer = setTimeout(() => {
      setAnimationFinished(true);
    }, 4500); // Duración de la animación más larga (4s) + buffer

    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleLogoClick = () => {
    navigate('/home');
  };

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm w-full relative z-20">
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-3 sm:space-x-6">
            <button 
              onClick={handleLogoClick}
              className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
            >
              <img 
                src="/src/assets/images/labtrack.png" 
                alt="LabTrack Logo" 
                className="w-full h-full object-contain logo-animate"
              />
            </button>
            <div className="hidden sm:block">
              <h1 className="text-lg sm:text-xl font-bold shine-text">LabTrack</h1>
              <p className={`text-xs sm:text-sm text-slate-500 ${
                animationFinished ? 'typewriter-finished' : 'typewriter-subtitle'
              }`}>Innovación y salud, siempre contigo</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-6">
            <div className="text-right hidden md:block">
              <p className={`text-sm text-slate-500 ${
                animationFinished ? 'typewriter-finished' : 'typewriter-welcome'
              }`}>{sexoBiologico === 'Femenino' ? 'Bienvenida' : 'Bienvenido'},</p>
              <p className={`text-lg font-semibold text-slate-800 ${
                animationFinished ? 'typewriter-finished' : 'typewriter-name'
              }`}>{name}</p>
            </div>
            <div className="h-10 w-px bg-slate-200 hidden md:block"></div>
            <button
              onClick={handleLogout}
              className="bg-slate-800 hover:bg-slate-900 text-white px-3 py-2 sm:px-6 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <span className="hidden sm:inline">Cerrar sesión</span>
              <span className="sm:hidden">Salir</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;