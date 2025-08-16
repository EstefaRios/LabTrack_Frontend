"use client"

import React, { useState, useEffect } from 'react';
import { getPerfil } from '../api/paciente';
import { getPersonaIdFromToken } from '../api/client';
import femeninoImg from '../assets/images/Femenino.png';
import masculinoImg from '../assets/images/Masculino.png';

export default function WelcomeSection() {
  const [sexoBiologico, setSexoBiologico] = useState<string | null>(null);
  const [nombrePaciente, setNombrePaciente] = useState<string>('');

  useEffect(() => {
    const fetchPatientInfo = async () => {
      const personaId = getPersonaIdFromToken();
      if (!personaId) return;

      try {
        const perfil = await getPerfil(personaId);
        setSexoBiologico(perfil?.sexo);
        setNombrePaciente(perfil?.nombreCompleto || '');
      } catch (error) {
        console.error('Error al obtener información del paciente:', error);
      }
    };

    fetchPatientInfo();
  }, []);

  const getGenderImage = () => {
    if (sexoBiologico === 'Femenino' || sexoBiologico === 'F') {
      return femeninoImg;
    } else if (sexoBiologico === 'Masculino' || sexoBiologico === 'M') {
      return masculinoImg;
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4 sm:p-6 mb-6">
      <div className="flex flex-col sm:flex-row items-center sm:space-x-6 space-y-4 sm:space-y-0">
        <div className="w-24 h-20 sm:w-32 sm:h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center flex-shrink-0">
          {getGenderImage() ? (
            <img 
               src={getGenderImage()!} 
               alt={sexoBiologico || 'Paciente'} 
               className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
             />
          ) : (
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          )}
        </div>

        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 profile-title-animate break-words">Hola, {nombrePaciente}</h2>
          </div>
          <p className="text-slate-600 text-base sm:text-lg welcome-portal-animate">{sexoBiologico === 'Femenino' ? 'Bienvenida' : 'Bienvenido'} al portal</p>
        </div>
      </div>
    </div>
  );
}