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
    throw new Error(error.detail || "Error en la solicitud");
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
    Reservation_number: string;
    Date: string;
    Code: string;
  }) =>
    fetchAPI("/reservas/", {
      method: "POST",
      body: JSON.stringify(datos),
    }),

  cancelar: (reservation_number: string) =>
    fetchAPI(`/reservas/${reservation_number}`, { method: "DELETE" }),

  agregarDetalle: (
    reservation_number: string,
    detalle: {
      Line_number: number;
      Reservation_number: string;
      SPACE_ID: string;
      BUILDING_ID: string;
      Start_Time: string;
      End_Time: string;
      Status: string;
    }
  ) =>
    fetchAPI(`/reservas/${reservation_number}/detalles`, {
      method: "POST",
      body: JSON.stringify(detalle),
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