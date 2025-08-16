import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrdenes } from '../api/paciente';
import { getPersonaIdFromToken } from '../api/client';

type Orden = {
  id: number | string;
  fecha: string | null;
  documento: string | null;
  numero: string | number | null;
  selected: boolean;
};

const PAGE_SIZE = 20;

const OrdenesTable: React.FC = () => {
  const navigate = useNavigate();
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({ pagina: 1, total: 0 });
  const [filters, setFilters] = useState({
    numeroOrden: '',
    fechaInicio: '',
    fechaFin: '',
  });

  const fetchOrdenes = async () => {
    const personaId = getPersonaIdFromToken() ?? Number(localStorage.getItem('personaId'));
    if (!personaId) {
      setError('No se pudo obtener la información del usuario');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const r = await getOrdenes({
        personaId,
        pagina: pagination.pagina,
        limite: PAGE_SIZE,
        busca: filters.numeroOrden || undefined,
        desde: filters.fechaInicio || undefined,
        hasta: filters.fechaFin || undefined,
      });

      setOrdenes(r.items.map((o) => ({ ...o, selected: false })) as Orden[]);
      setPagination({ pagina: r.page, total: r.total });
    } catch (err: unknown) {
      const errorMessage = err && typeof err === 'object' && 'response' in err 
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message 
        : undefined;
      setError(errorMessage || 'Error al cargar las órdenes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdenes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.pagina]);

  const handleFilterChange = () => {
    setPagination((p) => ({ ...p, pagina: 1 }));
    fetchOrdenes();
  };

  const toggleSelection = (id: number | string) => {
    setOrdenes((arr) =>
      arr.map((o) => (o.id === id ? { ...o, selected: !o.selected } : o)),
    );
  };

  const viewResults = (ordenId: number | string) => {
    // ✅ ruta correcta del frontend
    navigate(`/resultados/${ordenId}`);
  };

  const nextPage = () => {
    if (pagination.pagina * PAGE_SIZE < pagination.total) {
      setPagination((p) => ({ ...p, pagina: p.pagina + 1 }));
    }
  };

  const prevPage = () => {
    if (pagination.pagina > 1) {
      setPagination((p) => ({ ...p, pagina: p.pagina - 1 }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Órdenes de Laboratorio</h1>
          <p className="text-slate-600 mt-1">Gestiona y consulta tus órdenes médicas</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-gradient-to-r from-teal-50 to-teal-100 px-4 py-2 rounded-xl border border-teal-200">
            <p className="text-sm font-semibold text-teal-800">{pagination.total} órdenes</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4 sm:p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-slate-100 rounded-lg">
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h2 className="text-base sm:text-lg font-semibold text-slate-800">Filtros de Búsqueda</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Número de orden</label>
            <input
              type="text"
              placeholder="Ej: 84684"
              value={filters.numeroOrden}
              onChange={(e) => setFilters({ ...filters, numeroOrden: e.target.value })}
              className="w-full h-12 px-4 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Fecha inicial</label>
            <input
              type="date"
              value={filters.fechaInicio}
              onChange={(e) => setFilters({ ...filters, fechaInicio: e.target.value })}
              className="w-full h-12 px-4 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Fecha final</label>
            <input
              type="date"
              value={filters.fechaFin}
              onChange={(e) => setFilters({ ...filters, fechaFin: e.target.value })}
              className="w-full h-12 px-4 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all duration-200"
            />
          </div>

          <div className="flex items-end sm:col-span-2 lg:col-span-1">
            <button
              onClick={handleFilterChange}
              className="w-full h-12 bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-900 hover:to-slate-800 text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <span className="hidden sm:inline">Buscar Órdenes</span>
              <span className="sm:hidden">Buscar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h3 className="text-lg font-semibold text-slate-800">Resultados</h3>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <p className="text-slate-500">Cargando órdenes...</p>
          </div>
        ) : (
          <>
            {/* Vista de tabla para pantallas grandes */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left py-3 px-3 sm:py-4 sm:px-6 font-semibold text-slate-700">
                      <input type="checkbox" className="rounded border-slate-300 text-teal-600 focus:ring-teal-400" />
                    </th>
                    <th className="text-left py-3 px-3 sm:py-4 sm:px-6 font-semibold text-slate-700 text-sm sm:text-base">Fecha</th>
                    <th className="text-left py-3 px-3 sm:py-4 sm:px-6 font-semibold text-slate-700 text-sm sm:text-base">Documento</th>
                    <th className="text-left py-3 px-3 sm:py-4 sm:px-6 font-semibold text-slate-700 text-sm sm:text-base">Número de Orden</th>
                    <th className="text-left py-3 px-3 sm:py-4 sm:px-6 font-semibold text-slate-700 text-sm sm:text-base">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {ordenes.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                        No se encontraron órdenes
                      </td>
                    </tr>
                  ) : (
                    ordenes.map((orden, index) => (
                      <tr
                        key={String(orden.id)}
                        className={`border-b border-slate-100 hover:bg-slate-50 transition-colors duration-200 ${index % 2 === 0 ? "bg-white" : "bg-slate-25"}`}
                      >
                        <td className="py-3 px-3 sm:py-4 sm:px-6">
                          <input 
                            type="checkbox" 
                            checked={orden.selected}
                            onChange={() => toggleSelection(orden.id)}
                            className="rounded border-slate-300 text-teal-600 focus:ring-teal-400" 
                          />
                        </td>
                        <td className="py-3 px-3 sm:py-4 sm:px-6">
                          <div className="flex items-center space-x-1 sm:space-x-2">
                            <div className="p-1 bg-slate-100 rounded-lg">
                              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                            <span className="text-slate-700 font-medium text-xs sm:text-sm">
                              {orden.fecha ? new Date(orden.fecha).toLocaleDateString() : '-'}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3 sm:py-4 sm:px-6 text-slate-600 text-xs sm:text-sm">{orden.documento ?? '-'}</td>
                        <td className="py-3 px-3 sm:py-4 sm:px-6">
                          <span className="bg-slate-100 text-slate-800 px-2 py-1 sm:px-3 rounded-full text-xs sm:text-sm font-semibold">
                            #{orden.numero ?? '-'}
                          </span>
                        </td>
                        <td className="py-3 px-3 sm:py-4 sm:px-6">
                          <button
                            onClick={() => viewResults(orden.id)}
                            className="bg-teal-50 hover:bg-teal-100 text-teal-700 hover:text-teal-800 px-2 py-1 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 border border-teal-200 hover:border-teal-300"
                          >
                            Ver Resultados
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Vista de tarjetas para pantallas pequeñas */}
            <div className="lg:hidden space-y-4 p-4">
              {ordenes.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-500">No se encontraron órdenes</p>
                </div>
              ) : (
                ordenes.map((orden) => (
                  <div key={String(orden.id)} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          checked={orden.selected}
                          onChange={() => toggleSelection(orden.id)}
                          className="rounded border-slate-300 text-teal-600 focus:ring-teal-400" 
                        />
                        <span className="bg-slate-100 text-slate-800 px-3 py-1 rounded-full text-sm font-semibold">
                          #{orden.numero ?? '-'}
                        </span>
                      </div>
                      <button
                        onClick={() => viewResults(orden.id)}
                        className="bg-teal-50 hover:bg-teal-100 text-teal-700 hover:text-teal-800 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 border border-teal-200 hover:border-teal-300"
                      >
                        Ver Resultados
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="p-1 bg-white rounded-lg">
                          <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <span className="text-sm text-slate-600">Fecha:</span>
                        <span className="text-sm font-medium text-slate-800">
                          {orden.fecha ? new Date(orden.fecha).toLocaleDateString() : '-'}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <div className="p-1 bg-white rounded-lg">
                          <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>
                        <span className="text-sm text-slate-600">Documento:</span>
                        <span className="text-sm font-medium text-slate-800">{orden.documento ?? '-'}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center space-x-2">
            <button 
              onClick={prevPage}
              disabled={pagination.pagina === 1}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-semibold">{pagination.pagina}</span>
            <button 
              onClick={nextPage}
              disabled={pagination.pagina * PAGE_SIZE >= pagination.total}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          {pagination.total > 0 && (
            <p className="text-sm text-slate-600 font-medium">
              Mostrando <span className="font-semibold text-slate-800">{Math.min(pagination.pagina * PAGE_SIZE, pagination.total)}</span> de{" "}
              <span className="font-semibold text-slate-800">{pagination.total}</span> órdenes
            </p>
          )}
        </div>
    </div>
  );
};

export default OrdenesTable;
