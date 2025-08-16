import { api } from './client';

export async function listarNotificaciones(idUsuario: number, pagina = 1, limite = 10) {
  const { data } = await api.get('/notificaciones', { params: { idUsuario, pagina, limite } });
  return data;
}

export async function conteoNoLeidas(idUsuario: number) {
  const { data } = await api.get(`/notificaciones/conteo-no-leidas/${idUsuario}`);
  return data?.total ?? 0;
}

export async function marcarLeida(id: number | string) {
  const { data } = await api.post(`/notificaciones/${id}/leida`);
  return data;
}
