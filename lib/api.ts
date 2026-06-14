const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ─── Helper base ────────────────────────────────────────────
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Error desconocido" }));
    let msg = "Error en la solicitud";
    if (typeof error.detail === "string") {
      msg = error.detail;
    } else if (Array.isArray(error.detail)) {
      msg = error.detail.map((err: any) => `${err.loc.join(".")}: ${err.msg}`).join(", ");
    } else if (error.detail && typeof error.detail === "object") {
      msg = JSON.stringify(error.detail);
    }
    throw new Error(msg);
  }

  return res.json();
}

// ─── AUTH ────────────────────────────────────────────────────
export const authService = {
  login: (email: string, contrasena: string) =>
  fetchAPI("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, contrasena }),
  }),
 registro: (datos: {
  code: string;
  name1: string;
  name2?: string;
  last_name1: string;
  last_name2?: string;
  email: string;
  cellphone?: string;
  usertype_id: string;
  contrasena: string;
}) =>
  fetchAPI("/auth/registro", {
    method: "POST",
    body: JSON.stringify(datos),
  }),
};

// ─── ESPACIOS ────────────────────────────────────────────────
export const espaciosService = {
  obtenerTodos: (filtros?: { tipo?: string; capacidad_min?: number; building_id?: string }) => {
    const params = new URLSearchParams();
    if (filtros?.tipo) params.append("tipo", filtros.tipo);
    if (filtros?.capacidad_min) params.append("capacidad_min", String(filtros.capacidad_min));
    if (filtros?.building_id) params.append("building_id", filtros.building_id);
    return fetchAPI(`/espacios/?${params.toString()}`);
  },

  obtenerUno: (space_id: string, building_id: string) =>
    fetchAPI(`/espacios/${space_id}/${building_id}`),

  crear: (datos: {
    SPACE_ID: string;
    BUILDING_ID: string;
    Name: string;
    CAPACITY: number;
    SPACE_TYPE_ID: string;
  }) =>
    fetchAPI("/espacios/", {
      method: "POST",
      body: JSON.stringify(datos),
    }),
};

// ─── RESERVAS ────────────────────────────────────────────────
export const reservasService = {
  obtenerTodas: (filtros?: { code?: string; fecha?: string }) => {
    const params = new URLSearchParams();
    if (filtros?.code) params.append("code", filtros.code);
    if (filtros?.fecha) params.append("fecha", filtros.fecha);
    return fetchAPI(`/reservas/?${params.toString()}`);
  },

  obtenerUna: (reservation_number: string) =>
    fetchAPI(`/reservas/${reservation_number}`),

  crear: (datos: {
    reservation_number: string;
    date: string;
    code: string;
  }) =>
    fetchAPI("/reservas/", {
      method: "POST",
      body: JSON.stringify(datos),
    }),

  actualizar: (
    reservation_number: string,
    datos: {
    date: string;
    code: string;
    }
  ) =>
  fetchAPI(`/reservas/${reservation_number}`, {
    method: "PUT",
    body: JSON.stringify(datos),
  }),

  cancelar: (reservation_number: string, solicitante_code: string) =>
    fetchAPI(`/reservas/${reservation_number}?solicitante_code=${solicitante_code}`, {
      method: "DELETE",
    }),

  agregarDetalle: (
    reservation_number: string,
    detalle: {
      line_number: number;
      reservation_number: string;
      space_id: string;
      building_id: string;
      start_time: string;
      end_time: string;
      status: string;
    }
  ) =>
    fetchAPI(`/reservas/${reservation_number}/detalles`, {
      method: "POST",
      body: JSON.stringify(detalle),
    }),

  actualizarDetalle: (
    reservation_number: string,
    line_number: number,
    detalle: {
      line_number: number;
      reservation_number: string;
      space_id: string;
      building_id: string;
      start_time: string;
      end_time: string;
      status: string;
    }
  ) =>
    fetchAPI(`/reservas/${reservation_number}/detalles/${line_number}`, {
      method: "PUT",
      body: JSON.stringify(detalle),
    }),

  actualizarEstadoDetalle: (
    reservation_number: string,
    line_number: number,
    status: string
  ) =>
    fetchAPI(`/reservas/${reservation_number}/detalles/${line_number}/estado?status=${status}`, {
      method: "PATCH",
    }),
};

// ─── USUARIOS ────────────────────────────────────────────────
export const usuariosService = {
  obtenerTodos: (usertype_id?: string) => {
    const params = new URLSearchParams();
    if (usertype_id) params.append("usertype_id", usertype_id);
    return fetchAPI(`/usuarios/?${params.toString()}`);
  },

  obtenerUno: (code: string) => fetchAPI(`/usuarios/${code}`),

  obtenerTipos: () => fetchAPI("/usuarios/tipos/all"),
};


// ─── AFORO ────────────────────────────────────────────
export const aforoService = {
  obtenerActual: (space_id: string, building_id: string) =>
    fetchAPI(`/aforo/${space_id}/${building_id}`),
    obtenerTodosActual: () => fetchAPI("/aforo/actual/todos"),
    obtenerTodos: () => fetchAPI("/aforo/"),
};