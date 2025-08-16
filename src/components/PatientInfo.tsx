import React, { useState, useEffect } from 'react';
import { getPerfil } from '../api/paciente';
import { getPersonaIdFromToken } from '../api/client';
import { useAuthStore } from '../store/auth.store';

interface PatientData {
  paciente: string;
  identificacion: string;
  sexoEdad: string;
  administradora: string;
  telefono: string;
  medico: string;
  fechaOrden: string;
}

interface PatientInfoProps {
  ordenId?: string;
  data?: PatientData; // si viene, se usa directamente
  patientData?: any;
  ordenData?: any;
  loading?: boolean;
}

const PatientInfo: React.FC<PatientInfoProps> = ({ ordenId, data, patientData: externalPatientData, ordenData, loading: externalLoading }) => {
  const { token } = useAuthStore();
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Utilidad para edad
  const calcularEdad = (fechaNac?: string | null): string => {
    if (!fechaNac) return 'N/A';
    const nacimiento = new Date(fechaNac);
    if (isNaN(nacimiento.getTime())) return 'N/A';
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return `${edad}`;
  };

  // Si pasan "data" por props, la usamos; si no, consultamos el perfil
  useEffect(() => {
    if (data) {
      setPatientData(data);
      return;
    }

    const fetchPatientInfo = async () => {
      // PersonaId desde el JWT o, si no, desde localStorage (sin mezclar ?? con ||)
      const fromToken = getPersonaIdFromToken();
      const fromStorageRaw = Number(localStorage.getItem('personaId'));
      const fromStorage = isNaN(fromStorageRaw) ? null : fromStorageRaw;

      const personaId = (fromToken ?? fromStorage); // <- solo ?? aquí
      if (!personaId) {
        setError('No se pudo obtener la información del usuario');
        return;
      }

      setLoading(true);
      setError('');

      try {
        const perfil = await getPerfil(Number(personaId));
        // `perfil` viene normalizado desde src/api/paciente.ts:
        // { tipo, numero, fechaNacimiento, sexo, celular, direccion, correo, nombreCompleto, raw }

        const rawData = perfil.raw as {
          nombre1?: string;
          nombre2?: string;
          apellido1?: string;
          apellido2?: string;
          numeroid?: string;
          num_documento?: string;
          eps?: string;
          administradora?: string;
          aseguradora?: string;
          entidad?: string;
          telefono?: string;
          tel_movil?: string;
          medico?: string;
        } | null;

        const nombre =
          perfil.nombreCompleto ||
          [
            rawData?.nombre1,
            rawData?.nombre2,
            rawData?.apellido1,
            rawData?.apellido2,
          ]
            .filter(Boolean)
            .join(' ') ||
          'No especificado';

        const identificacion =
          perfil?.numero ||
          rawData?.numeroid ||
          rawData?.num_documento ||
          'No especificado';

        const sexo = perfil?.sexo || 'N/A';
        const edad = calcularEdad(perfil?.fechaNacimiento);

        const administradora =
          perfil?.eps ||
          perfil?.eps_nombre ||
          externalPatientData?.eps ||
          rawData?.eps ||
          rawData?.administradora ||
          rawData?.aseguradora ||
          rawData?.entidad ||
          'No especificado';

        const telefono =
          perfil?.celular ||
          rawData?.telefono ||
          rawData?.tel_movil ||
          'No especificado';

        const medico = ordenData?.profesional_externo || rawData?.medico || 'No especificado';

        const fechaOrden = ordenData?.fecha 
          ? new Date(ordenData.fecha).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            })
          : new Date().toLocaleDateString();

        setPatientData({
          paciente: nombre,
          identificacion,
          sexoEdad: `${sexo}/${edad} años`,
          administradora,
          telefono,
          medico,
          fechaOrden,
        });
      } catch (err: unknown) {
        const errorMessage = err && typeof err === 'object' && 'response' in err 
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message 
          : undefined;
        setError(
          errorMessage || 'Error al cargar la información del paciente'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPatientInfo();
    // recalcula si cambia el token (nuevo login) o la orden (cambio de vista)
  }, [ordenId, token, data]);

  // Data para pintar si aún no hay nada
  const displayData: PatientData =
    data ||
    patientData || {
      paciente: 'Cargando...',
      identificacion: 'Cargando...',
      sexoEdad: 'Cargando...',
      administradora: 'Cargando...',
      telefono: 'Cargando...',
      medico: 'Cargando...',
      fechaOrden: 'Cargando...',
    };

  const patientFields = [
    { label: "Paciente:", value: displayData.paciente, span: "col-span-1" },
    { label: "Identificación:", value: displayData.identificacion, span: "col-span-1" },
    { label: "Sexo/Edad:", value: displayData.sexoEdad, span: "col-span-1" },
    { label: "Administradora de salud:", value: displayData.administradora, span: "col-span-1" },
    { label: "Teléfono:", value: displayData.telefono, span: "col-span-1" },
    { label: "Médico:", value: displayData.medico, span: "col-span-1" },
    { label: "Fecha orden:", value: displayData.fechaOrden, span: "col-span-1" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-teal-100 rounded-lg">
          <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-slate-800">Información del Paciente</h2>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {loading && !patientData && (
        <div className="text-center py-4">
          <p className="text-gray-500 text-sm">Cargando información del paciente...</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        {patientFields.map((field, index) => (
          <div key={index} className={`${field.span} flex flex-col space-y-1`}>
            <span className="text-sm font-semibold text-slate-600">{field.label}</span>
            <span className="text-sm text-slate-800 font-medium break-words">{field.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientInfo;
