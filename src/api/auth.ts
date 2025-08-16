import { api } from './client';

type LoginDto = {
  tipo: string;            // 'CC', 'TI', etc.
  numero: string;          // documento
  fechaNacimiento: string; // 'YYYY-MM-DD'
};

export async function loginPaciente(dto: LoginDto) {
  const payload = {
    tipo: dto.tipo,
    numero: dto.numero,
    fechaNacimiento: dto.fechaNacimiento,
  };

  const { data } = await api.post('/auth/login-paciente', payload);

  if (data?.access_token) {
    localStorage.setItem('token', data.access_token);
  }
  if (data?.personaId != null) {
    localStorage.setItem('personaId', String(data.personaId));
  }

  return data;
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('personaId');
}
