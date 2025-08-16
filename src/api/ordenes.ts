import { api } from './client';

export async function listarOrdenes(params: {
  personaId: number;
  pagina?: number;
  limite?: number;
  busca?: string;
  desde?: string;
  hasta?: string;
}) {
  const { data } = await api.get('/ordenes', { params });
  return data;
}

export async function resultadosDeOrden(idOrden: number | string) {
  const { data } = await api.get(`/ordenes/${idOrden}/resultados`);
  return data;
}
