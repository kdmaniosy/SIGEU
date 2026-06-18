"use client";
import { useState } from "react";

// El componente RegistrarAdmin es un formulario que permite a los administradores registrar nuevos administradores en el sistema. El componente recibe una prop adminCode, que es un código de administrador necesario para autorizar la creación de nuevas cuentas de administrador. El formulario incluye campos para el código del nuevo administrador, su nombre, apellidos, correo electrónico, número de celular y contraseña. Al enviar el formulario, se realizan validaciones para asegurarse de que se hayan completado los campos obligatorios y que las contraseñas coincidan. Si las validaciones pasan, se realiza una solicitud POST a la API para registrar al nuevo administrador. Durante el proceso de registro, se muestra un indicador de carga y se manejan los estados de error y éxito para proporcionar retroalimentación al usuario.
interface Props {
  adminCode: string;
}


// El componente utiliza varios estados para manejar la visibilidad del formulario, los datos del formulario, los mensajes de error, el estado de éxito y el estado de carga. La función handleChange se encarga de actualizar el estado del formulario a medida que el usuario ingresa datos, mientras que la función handleRegistrar se encarga de validar los datos y realizar la solicitud a la API para registrar al nuevo administrador.
export default function RegistrarAdmin({ adminCode }: Props) {
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState({
    code: "",
    name1: "",
    name2: "",
    last_name1: "",
    last_name2: "",
    email: "",
    cellphone: "",
    contrasena: "",
    confirmar: "",
  });

  // El estado error se utiliza para almacenar cualquier mensaje de error que pueda ocurrir durante el proceso de registro, mientras que el estado exito se utiliza para indicar si el registro fue exitoso. El estado cargando se utiliza para mostrar un indicador de carga mientras se realiza la solicitud a la API.
  const [error, setError] = useState("");
  const [exito, setExito] = useState(false);
  const [cargando, setCargando] = useState(false);


  // La función handleChange se encarga de actualizar el estado del formulario cada vez que el usuario ingresa datos en los campos del formulario. Utiliza el evento onChange para capturar los cambios en los campos de entrada y actualiza el estado form con los nuevos valores ingresados por el usuario.
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }


  // La función handleRegistrar es una función asíncrona que se ejecuta cuando el usuario hace clic en el botón para registrar un nuevo administrador. La función realiza varias validaciones para asegurarse de que se hayan completado los campos obligatorios y que las contraseñas coincidan. Si las validaciones pasan, se realiza una solicitud POST a la API para registrar al nuevo administrador, utilizando el código de administrador proporcionado en la prop adminCode para autorizar la creación de la cuenta. Durante el proceso de registro, se muestra un indicador de carga y se manejan los estados de error y éxito para proporcionar retroalimentación al usuario.
  async function handleRegistrar() {
    if (!form.code || !form.name1 || !form.last_name1 || !form.email || !form.contrasena) {
      setError("Por favor completa todos los campos obligatorios.");
      return;
    }
    if (form.contrasena !== form.confirmar) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    // Si las validaciones pasan, se inicia el proceso de registro estableciendo el estado cargando en true y limpiando cualquier mensaje de error previo. Luego, se realiza una solicitud POST a la API para registrar al nuevo administrador, enviando los datos del formulario en el cuerpo de la solicitud. Si la respuesta de la API no es exitosa, se captura el mensaje de error y se muestra al usuario. Si el registro es exitoso, se muestra un mensaje de éxito y se restablece el formulario. Finalmente, independientemente del resultado, se establece el estado cargando en false para ocultar el indicador de carga.
    setCargando(true);
    setError("");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/usuarios/registrar-admin?admin_code=${adminCode}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code: form.code,
            name1: form.name1,
            name2: form.name2 || undefined,
            last_name1: form.last_name1,
            last_name2: form.last_name2 || undefined,
            email: form.email,
            cellphone: form.cellphone || undefined,
            usertype_id: "AD",
            contrasena: form.contrasena,
          }),
        }
      );

      // Si la respuesta de la API no es exitosa, se captura el mensaje de error y se muestra al usuario. Si el registro es exitoso, se muestra un mensaje de éxito y se restablece el formulario. Finalmente, independientemente del resultado, se establece el estado cargando en false para ocultar el indicador de carga.
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Error al registrar administrador");
      }
      setExito(true);
      setForm({ code: "", name1: "", name2: "", last_name1: "", last_name2: "", email: "", cellphone: "", contrasena: "", confirmar: "" });
      setTimeout(() => { setExito(false); setVisible(false); }, 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al registrar");
    } finally {
      setCargando(false);
    }
  }

  // El componente renderiza una tarjeta con un título y una descripción, junto con un botón para mostrar u ocultar el formulario de registro. Si el estado visible es true, se muestra el formulario con los campos necesarios para registrar un nuevo administrador, así como mensajes de error o éxito según corresponda. El botón para registrar al nuevo administrador se deshabilita mientras se está realizando la solicitud a la API para evitar múltiples envíos.
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-gray-900">Registrar Administrador</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Solo los administradores pueden crear otras cuentas admin.
          </p>
        </div>
        <button
          onClick={() => setVisible(!visible)}
          className="bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-800 transition-colors"
        >
          {visible ? "Cancelar" : "+ Nuevo admin"}
        </button>
      </div>

      {visible && (
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Primer nombre *</label>
              <input name="name1" type="text" placeholder="Nombre" value={form.name1} onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Segundo nombre</label>
              <input name="name2" type="text" placeholder="Opcional" value={form.name2} onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Primer apellido *</label>
              <input name="last_name1" type="text" placeholder="Apellido" value={form.last_name1} onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Segundo apellido</label>
              <input name="last_name2" type="text" placeholder="Opcional" value={form.last_name2} onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Código *</label>
              <input name="code" type="text" placeholder="Ej: 192294" value={form.code} onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Celular</label>
              <input name="cellphone" type="text" placeholder="Opcional" value={form.cellphone} onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo institucional *</label>
            <input name="email" type="email" placeholder="correo@universidad.edu" value={form.email} onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña *</label>
              <input name="contrasena" type="password" placeholder="••••••••" value={form.contrasena} onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar contraseña *</label>
              <input name="confirmar" type="password" placeholder="••••••••" value={form.confirmar} onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
          </div>

          {error && (
            <p className="text-red-600 text-sm bg-red-50 px-4 py-2 rounded-lg">{error}</p>
          )}
          {exito && (
            <p className="text-green-600 text-sm bg-green-50 px-4 py-2 rounded-lg font-medium">
              ✅ Administrador registrado exitosamente.
            </p>
          )}

          <button
            onClick={handleRegistrar}
            disabled={cargando}
            className="w-full bg-red-700 text-white py-2.5 rounded-lg text-sm font-bold hover:bg-red-800 transition-colors disabled:opacity-60"
          >
            {cargando ? "Registrando..." : "Registrar administrador"}
          </button>
        </div>
      )}
    </div>
  );
}