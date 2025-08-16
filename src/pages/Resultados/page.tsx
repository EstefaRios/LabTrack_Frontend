import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { resultadosDeOrden } from '../../api/ordenes';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import PatientInfo from '../../components/PatientInfo';
import ResultadosTable from '../../components/ResultadosTable';

interface Resultado {
  id: number;
  fecha: string;
  idOrden: number;
  idProcedimiento: number;
  idPrueba: number;
  idPruebaOpcion?: number;
  resOpcion?: string;
  resNumerico?: number;
  resTexto?: string;
  resMemo?: string;
  numProcesamientos: number;
  valor_ref_min?: number;
  valor_ref_max?: number;
}

interface Prueba {
  id: number;
  codigoPrueba: string;
  nombrePrueba: string;
  unidad?: string;
  idTipoResultado: number;
}

interface Procedimiento {
  id: number;
  idCups?: number;
  metodo?: string;
  codigo: string;
  nombre: string;
}

interface PruebaConResultado {
  prueba: Prueba;
  resultado: Resultado;
}

interface ProcedimientoConPruebas {
  procedimientoId: number;
  procedimiento: Procedimiento;
  pruebas: PruebaConResultado[];
}

interface GrupoConProcedimientos {
  grupoId: number;
  grupoCodigo: string;
  grupoNombre: string;
  procedimientos: ProcedimientoConPruebas[];
}

interface PatientData {
  id: number;
  tipoDocumento: string;
  numeroDocumento: string;
  nombres: string;
  apellidos: string;
  fechaNacimiento: string;
  genero: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  eps?: string;
  codigoEps?: string;
}

interface OrdenData {
  id?: number;
  numero?: string;
  fecha?: string;
  profesional_externo?: string;
}

interface ResultadosApiResponse {
  grupos?: GrupoConProcedimientos[];
}



interface GrupoAgrupado {
  grupo: {
    id: number;
    codigo: string;
    nombre: string;
  };
  procedimientos: Record<string, ProcedimientoAgrupado>;
}

interface ProcedimientoAgrupado {
  procedimiento: Procedimiento;
  pruebas: PruebaConResultado[];
}

export default function ResultadosPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [grupos, setGrupos] = useState<GrupoConProcedimientos[]>([]);

  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [ordenData, setOrdenData] = useState<OrdenData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = () => {
    console.log("Logging out...");
    navigate('/login');
  };

  const handleVolver = () => {
    navigate('/home');
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setError('ID de orden no proporcionado');
        setLoading(false);
        return;
      }

      try {
        // Obtener resultados de la orden usando directamente el objeto retornado
        const r = await resultadosDeOrden(parseInt(id));
        const grupos = r?.grupos || [];
        const paciente = r?.paciente || null;
        const orden = r?.orden || null;
        
        setGrupos(grupos);
        
        // Usar datos del paciente directamente del backend
        if (paciente) {
          setPatientData({
            id: paciente.id || 0,
            tipoDocumento: paciente.tipo_documento || '',
            numeroDocumento: paciente.numero_documento || '',
            nombres: paciente.nombres || '',
            apellidos: paciente.apellidos || '',
            fechaNacimiento: paciente.fecha_nacimiento || '',
            genero: paciente.genero || '',
            telefono: paciente.telefono,
            email: paciente.email,
            direccion: paciente.direccion,
            eps: paciente.eps_nombre,
            codigoEps: paciente.eps_codigo
          });
        }
        
        // Usar datos de la orden directamente del backend
        if (orden) {
          setOrdenData({
            id: orden.id,
            numero: orden.numero,
            fecha: orden.fecha,
            profesional_externo: orden.profesional_externo
          });
        }
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } } };
        setError(error.response?.data?.message || 'Error al cargar los resultados');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const getResultValue = (resultado: Resultado): string => {
    if (resultado.resOpcion) return resultado.resOpcion;
    if (resultado.resNumerico !== null && resultado.resNumerico !== undefined) {
      return resultado.resNumerico.toString();
    }
    if (resultado.resTexto) return resultado.resTexto;
    if (resultado.resMemo) return resultado.resMemo;
    return '—';
  };
  
  const getReferenceValues = (prueba: PruebaConResultado): string => {
    // Obtener valores de referencia desde los datos del backend
    const resultado = prueba.resultado as any;
    
    // Acceder a los valores de referencia
    const minVal = resultado.valor_ref_min;
    const maxVal = resultado.valor_ref_max;
    
    // Verificar si ambos valores están disponibles y no son null/undefined/0
    if (minVal !== null && minVal !== undefined && minVal !== 0 && 
        maxVal !== null && maxVal !== undefined && maxVal !== 0) {
      return `${minVal} - ${maxVal}`;
    } else if (minVal !== null && minVal !== undefined && minVal !== 0) {
      return `> ${minVal}`;
    } else if (maxVal !== null && maxVal !== undefined && maxVal !== 0) {
      return `< ${maxVal}`;
    }
    
    // Si no hay valores de referencia en la base de datos, mostrar valores por defecto
    // basados en el tipo de prueba o código de prueba
    const codigoPrueba = prueba.prueba.codigoPrueba;
    const nombrePrueba = prueba.prueba.nombrePrueba?.toLowerCase() || '';
    
    // Valores de referencia por defecto para pruebas comunes
    if (codigoPrueba === 'BLAS' || nombrePrueba.includes('blastoconidia')) {
      return 'Negativo';
    } else if (codigoPrueba === 'CGF' || nombrePrueba.includes('células guía')) {
      return 'Negativo';
    } else if (codigoPrueba === 'CBGV' || nombrePrueba.includes('coco bacilos')) {
      return 'Escaso';
    } else if (codigoPrueba === 'CORY' || nombrePrueba.includes('corynebacterium')) {
      return 'Negativo';
    } else if (nombrePrueba.includes('hemoglobina')) {
      return '12.0 - 16.0 g/dL';
    } else if (nombrePrueba.includes('glucosa')) {
      return '70 - 100 mg/dL';
    } else if (nombrePrueba.includes('colesterol')) {
      return '< 200 mg/dL';
    } else if (nombrePrueba.includes('triglicéridos')) {
      return '< 150 mg/dL';
    } else {
       return 'Valores normales';
     }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateAge = (birthDate: string): number => {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  // Usar los grupos directamente del estado
   const resultadosAgrupados = grupos.reduce((acc: Record<string, GrupoAgrupado>, grupo: GrupoConProcedimientos) => {
    const grupoKey = `${grupo.grupoCodigo}-${grupo.grupoNombre}`;
    
    acc[grupoKey] = {
      grupo: {
        id: grupo.grupoId,
        codigo: grupo.grupoCodigo,
        nombre: grupo.grupoNombre
      },
      procedimientos: grupo.procedimientos.reduce((procAcc: Record<string, ProcedimientoAgrupado>, proc: ProcedimientoConPruebas) => {
        const procKey = `${proc.procedimiento.codigo}-${proc.procedimiento.nombre}`;
        procAcc[procKey] = {
          procedimiento: proc.procedimiento,
          pruebas: proc.pruebas
        };
        return procAcc;
      }, {})
    };
    
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando resultados...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-red-800 mb-2">Error</h3>
            <p className="text-red-600">{error}</p>
            <Link to="/home" className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header patientName={patientData ? `${patientData.nombres} ${patientData.apellidos}` : 'Usuario'} />

      <div className="flex">
        <Sidebar activeItem="home" />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Resultados de Laboratorio</h1>
              <p className="text-slate-600 mt-1 text-sm sm:text-base">Consulta detallada de resultados médicos</p>
            </div>
            <button
              onClick={handleVolver}
              className="flex items-center justify-center space-x-2 bg-slate-700 hover:bg-slate-800 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 w-full sm:w-auto"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Volver</span>
            </button>
          </div>

          <div className="space-y-6">
            <PatientInfo 
              patientData={patientData}
              ordenData={ordenData}
              loading={loading}
            />
            
            {Object.entries(resultadosAgrupados).length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-slate-900">No hay resultados</h3>
                <p className="mt-1 text-sm text-slate-500">No se encontraron resultados para esta orden.</p>
              </div>
            ) : (
              Object.entries(resultadosAgrupados).map(([grupoKey, grupoData]) => {
                // Convertir los datos al formato esperado por ResultadosTable
                const resultadosParaTabla = Object.entries(grupoData.procedimientos).flatMap(([procKey, pruebaData]) => 
                  pruebaData.pruebas.map((item: PruebaConResultado) => ({
                    id: item.resultado.id,
                    codigo: item.prueba?.codigoPrueba || null,
                    nombre: item.prueba?.nombrePrueba || null,
                    resultado: getResultValue(item.resultado),
                    valoresReferencia: getReferenceValues(item),
                    unidad: item.prueba?.unidad || null,
                    fechaOrden: ordenData?.fecha ? formatDate(ordenData.fecha) : null
                  }))
                );
                
                const procedimientoNombre = Object.values(grupoData.procedimientos)[0]?.procedimiento?.nombre || '';
                
                return (
                  <ResultadosTable
                    key={grupoKey}
                    grupo={grupoData.grupo.nombre}
                    procedimiento={procedimientoNombre}
                    resultados={resultadosParaTabla}
                  />
                );
              })
            )}
          </div>
        </main>
      </div>
    </div>
  )
}