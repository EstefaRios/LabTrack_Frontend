import React from 'react';

interface Resultado {
  id?: string | number | null;
  codigo: string | null;
  nombre: string | null;
  resultado: string | number | null;
  valoresReferencia: string | null;
  unidad: string | null;
  fechaOrden?: string | null;
}

interface ResultadosTableProps {
  grupo?: string;
  procedimiento?: string;
  resultados?: Resultado[];
  observaciones?: string;
}

const ResultadosTable: React.FC<ResultadosTableProps> = ({
  grupo = 'Resultados de laboratorio',
  procedimiento = '',
  resultados = [],
  observaciones,
}) => {
  const defaultObservaciones =
    "Los resultados de este examen deben ser interpretados por un profesional médico calificado. Estos valores pueden variar según las condiciones del paciente y el método de análisis utilizado.";

  const obs = observaciones || defaultObservaciones;
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">{grupo}</h2>
          {procedimiento && <p className="text-lg font-semibold text-slate-600">{procedimiento}</p>}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left py-4 px-4 font-semibold text-slate-700 border-b border-slate-200">Código</th>
                <th className="text-left py-4 px-4 font-semibold text-slate-700 border-b border-slate-200">
                  Nombre de la prueba
                </th>
                <th className="text-left py-4 px-4 font-semibold text-slate-700 border-b border-slate-200">
                  Resultado
                </th>
                <th className="text-left py-4 px-4 font-semibold text-slate-700 border-b border-slate-200">Unidad</th>
                <th className="text-left py-4 px-4 font-semibold text-slate-700 border-b border-slate-200">
                  Valores de Referencia
                </th>
                <th className="text-left py-4 px-4 font-semibold text-slate-700 border-b border-slate-200">
                  Fecha de Orden
                </th>
              </tr>
            </thead>
            <tbody>
              {resultados.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    Sin resultados
                  </td>
                </tr>
              ) : (
                resultados.map((resultado, index) => (
                  <tr key={String(resultado.id ?? index)} className="border-b border-slate-100 hover:bg-slate-50 transition-colors duration-200">
                    <td className="py-4 px-4">
                      <span className="bg-slate-100 text-slate-800 px-3 py-1 rounded-full text-sm font-semibold">
                        {resultado.codigo ?? '-'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-700 font-medium">{resultado.nombre ?? '-'}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          String(resultado.resultado).toUpperCase() === "NEGATIVO"
                            ? "bg-green-100 text-green-800"
                            : String(resultado.resultado).toUpperCase() === "POSITIVO"
                              ? "bg-red-100 text-red-800"
                              : "bg-slate-100 text-slate-800"
                        }`}
                      >
                        {resultado.resultado ?? '-'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-600">{resultado.unidad ?? '-'}</td>
                    <td className="py-4 px-4 text-slate-600">{resultado.valoresReferencia ?? '-'}</td>
                    <td className="py-4 px-4 text-slate-600">{resultado.fechaOrden ?? '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-amber-100 rounded-lg">
            <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-800">Observaciones</h3>
        </div>
        <p className="text-slate-600 leading-relaxed mb-6">{obs}</p>

        <div className="border-t border-slate-200 pt-4">
          <p className="text-center text-sm text-slate-500 italic">
            Este documento ha sido generado electrónicamente y es válido sin firma autógrafa
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultadosTable;
