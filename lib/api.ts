const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ─── Helper base ────────────────────────────────────────────
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  // La función fetchAPI es un helper que centraliza las llamadas a la API. Toma un endpoint y opciones de configuración para la solicitud. Construye la URL completa utilizando la constante API_URL y el endpoint proporcionado, y agrega los headers necesarios, incluyendo el token de autenticación si está disponible. Luego realiza la solicitud utilizando fetch y maneja los errores de manera uniforme, lanzando una excepción con un mensaje descriptivo en caso de que la respuesta no sea exitosa. Finalmente, devuelve la respuesta en formato JSON.
  const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });


  // Si la respuesta no es exitosa (res.ok es false), se intenta extraer un mensaje de error del cuerpo de la respuesta. Si el cuerpo no se puede parsear como JSON, se utiliza un mensaje genérico de "Error desconocido". Dependiendo de la estructura del error, se formatea el mensaje de error de manera adecuada para proporcionar información clara sobre lo que salió mal en la solicitud.
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

// El servicio authService proporciona métodos para interactuar con los endpoints de autenticación de la API. Incluye un método login para iniciar sesión con email y contraseña, y un método registro para registrar un nuevo usuario con los datos necesarios. Ambos métodos utilizan la función fetchAPI para realizar las solicitudes a la API y manejar las respuestas de manera uniforme.
export const authService = {
  login: (email: string, contrasena: string) =>
  fetchAPI("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, contrasena }),
  }),
  // El método registro toma un objeto con los datos necesarios para registrar un nuevo usuario, incluyendo código, nombres, apellidos, email, tipo de usuario y contraseña. Realiza una solicitud POST al endpoint /auth/registro con el cuerpo de la solicitud formateado como JSON.
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
  // El método registro toma un objeto con los datos necesarios para registrar un nuevo usuario, incluyendo código, nombres, apellidos, email, tipo de usuario y contraseña. Realiza una solicitud POST al endpoint /auth/registro con el cuerpo de la solicitud formateado como JSON.
  fetchAPI("/auth/registro", {
    method: "POST",
    body: JSON.stringify(datos),
  }),
};

// ─── ESPACIOS ────────────────────────────────────────────────

// El servicio espaciosService proporciona métodos para interactuar con los endpoints relacionados con los espacios en la API. Incluye métodos para obtener todos los espacios con filtros opcionales, obtener un espacio específico por su ID y edificio, y crear un nuevo espacio con los datos necesarios. Todos los métodos utilizan la función fetchAPI para realizar las solicitudes a la API y manejar las respuestas de manera uniforme.
export const espaciosService = {
  obtenerTodos: (filtros?: { tipo?: string; capacidad_min?: number; building_id?: string }) => {
    const params = new URLSearchParams();
    if (filtros?.tipo) params.append("tipo", filtros.tipo);
    if (filtros?.capacidad_min) params.append("capacidad_min", String(filtros.capacidad_min));
    if (filtros?.building_id) params.append("building_id", filtros.building_id);
    return fetchAPI(`/espacios/?${params.toString()}`);
  },

  // El método obtenerUno toma el ID del espacio y el ID del edificio como parámetros y realiza una solicitud GET al endpoint /espacios/{space_id}/{building_id} para obtener los detalles de un espacio específico.
  obtenerUno: (space_id: string, building_id: string) =>
    fetchAPI(`/espacios/${space_id}/${building_id}`),


  // El método crear toma un objeto con los datos necesarios para crear un nuevo espacio, incluyendo el ID del espacio, el ID del edificio, el nombre, la capacidad y el tipo de espacio. Realiza una solicitud POST al endpoint /espacios/ con el cuerpo de la solicitud formateado como JSON.
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

// El servicio reservasService proporciona métodos para interactuar con los endpoints relacionados con las reservas en la API. Incluye métodos para obtener todas las reservas con filtros opcionales, obtener una reserva específica por su número de reserva, crear una nueva reserva, actualizar una reserva existente, cancelar una reserva y agregar o actualizar detalles de una reserva. Todos los métodos utilizan la función fetchAPI para realizar las solicitudes a la API y manejar las respuestas de manera uniforme.
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