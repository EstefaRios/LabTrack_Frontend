import { api } from './client';

/** ---------- PERFIL ---------- */
export type Perfil = {
  tipo: string | null;
  numero: string | null;
  fechaNacimiento: string | null;
  sexo: string | null;
  celular: string | null;
  direccion: string | null;
  correo: string | null;
  nombreCompleto: string | null;
  eps: string | null;
  eps_codigo: string | null;
  eps_nombre: string | null;
  raw: unknown;
};

export async function getPerfil(personaId: number): Promise<Perfil> {
  const { data: p } = await api.get('/perfil', { params: { personaId } });

  // ✅ Agrupamos los "||" en paréntesis para no mezclarlos directamente con "??"
  const nombreCompleto =
    p?.nombreCompleto ??
    (
      [p?.nombre, p?.apellidos].filter(Boolean).join(' ') ||
      [p?.nombre1, p?.nombre2, p?.apellido1, p?.apellido2].filter(Boolean).join(' ') ||
      [p?.nombres, p?.apellidos].filter(Boolean).join(' ') ||
      null
    );

  return {
    tipo:
      p?.tipo ??
      p?.tipoIdentificacion ??
      p?.tipoId ??
      p?.tipo_identificacion ??
      p?.id_tipoid ??
      p?.tipo_documento ??
      null,
    numero:
      p?.numero ??
      p?.numeroIdentificacion ??
      p?.documento ??
      p?.numeroId ??
      p?.numeroid ??
      p?.num_documento ??
      null,
    fechaNacimiento:
      p?.fechaNacimiento ??
      p?.fecha_nacimiento ??
      p?.fechanac ??
      p?.fecha_nac ??
      null,
    sexo:
      p?.sexo ??
      p?.sexoBiologico ??
      p?.sexo_biologico ??
      p?.sexoNombre ??
      p?.id_sexobiologico ??
      null,
    celular: p?.celular ?? p?.tel_movil ?? p?.telMovil ?? p?.telefono ?? null,
    direccion: p?.direccion ?? p?.direccion_residencia ?? null,
    correo: p?.correo ?? p?.email ?? null,
    eps: p?.eps ?? p?.eps_nombre ?? null,
    eps_codigo: p?.eps_codigo ?? null,
    eps_nombre: p?.eps_nombre ?? null,
    nombreCompleto,
    raw: p,
  };
}

/** ---------- ÓRDENES ---------- */
export type Orden = {
  id: number | string | null;
  fecha: string | null;
  documento: string | null;
  numero: string | number | null;
  raw: unknown;
};

function normalizeListResponse(r: unknown): { items: unknown[]; page: number; total: number } {
  const response = r as { data?: unknown; items?: unknown[]; pagina?: number; page?: number; total?: number; count?: number };
  
  let items: unknown[] = [];
  if (Array.isArray(r)) {
    items = r;
  } else if (Array.isArray(response?.items)) {
    items = response.items;
  } else if (Array.isArray(response?.data)) {
    items = response.data;
  }
  
  return {
    items,
    page: Number(response?.pagina ?? response?.page ?? 1),
    total: Number(response?.total ?? response?.count ?? (Array.isArray(r) ? r.length : 0)),
  };
}

export async function getOrdenes(params: {
  personaId: number;
  pagina?: number;
  limite?: number;
  busca?: string;
  desde?: string;
  hasta?: string;
}): Promise<{ items: Orden[]; page: number; total: number }> {
  const { data } = await api.get('/ordenes', { params });
  const { items, page, total } = normalizeListResponse(data);

  const list: Orden[] = items.map((o: unknown) => {
    const orden = o as { id?: number | string; id_orden?: number | string; orden_id?: number | string; fecha?: string; fecha_orden?: string; fechaorden?: string; documento?: string; documento_orden?: string; numeroid?: string; num_documento?: string; numero_documento?: string; documento_paciente?: string; paciente_documento?: string; numero?: number | string; numero_orden?: number | string; num_orden?: number | string };
    return {
      id: orden.id ?? orden.id_orden ?? orden.orden_id ?? null,
      fecha: orden.fecha ?? orden.fecha_orden ?? orden.fechaorden ?? null,
      documento: orden.documento ?? orden.documento_orden ?? orden.numeroid ?? orden.num_documento ?? orden.numero_documento ?? orden.documento_paciente ?? orden.paciente_documento ?? null,
      numero: orden.numero ?? orden.numero_orden ?? orden.num_orden ?? orden.id_orden ?? orden.id ?? null,
      raw: o,
    };
  });

  return { items: list, page, total };
}

/** ---------- RESULTADOS ---------- */
export async function getResultados(idOrden: number | string) {
  const { data } = await api.get(`/ordenes/${idOrden}/resultados`);
  const arr = Array.isArray(data) ? data : (data?.data ?? []);
  return arr.map((r: unknown) => {
    const resultado = r as { codigo?: string; id_prueba?: string; prueba_codigo?: string; nombre?: string; prueba?: string; nombre_prueba?: string; resultado?: string; valor?: string; unidad?: string; unidad_medida?: string; valoresReferencia?: string; rango_referencia?: string; referencia?: string };
    return {
      codigo: resultado.codigo ?? resultado.id_prueba ?? resultado.prueba_codigo ?? null,
      nombre: resultado.nombre ?? resultado.prueba ?? resultado.nombre_prueba ?? null,
      resultado: resultado.resultado ?? resultado.valor ?? null,
      unidad: resultado.unidad ?? resultado.unidad_medida ?? null,
      valoresReferencia: resultado.valoresReferencia ?? resultado.rango_referencia ?? resultado.referencia ?? null,
      raw: r,
    };
  });
}
