
// Este archivo define un componente de modal de confirmación que se utiliza para mostrar un mensaje de advertencia al usuario antes de realizar una acción crítica, como cancelar una operación. El componente recibe varias props para controlar su visibilidad, el título y el mensaje que se muestra, así como las funciones que se ejecutan cuando el usuario confirma o cancela la acción. El modal se muestra como una superposición en la pantalla, con un diseño centrado y estilizado utilizando Tailwind CSS para crear una apariencia atractiva y fácil de usar.
interface Props {
  visible: boolean;
  titulo: string;
  mensaje: string;
  onConfirmar: () => void;
  onCancelar: () => void;
}


// El componente ModalConfirmacion es el componente principal que representa el modal de confirmación. Utiliza las props para controlar su comportamiento y apariencia, y se muestra solo cuando la prop "visible" es verdadera. El modal incluye un ícono de advertencia, un título, un mensaje y dos botones para confirmar o cancelar la acción.
export default function ModalConfirmacion({ visible, titulo, mensaje, onConfirmar, onCancelar }: Props) {
  if (!visible) return null;


  // El modal se muestra como una superposición en la pantalla, con un fondo semitransparente que oscurece el contenido detrás de él. El contenido del modal está centrado tanto vertical como horizontalmente, y se utiliza un diseño de tarjeta con bordes redondeados y sombra para darle un aspecto moderno y atractivo. Dentro del modal, se muestra un ícono de advertencia, seguido del título y el mensaje, ambos centrados. Finalmente, hay dos botones: uno para cancelar la acción (con un estilo más neutral) y otro para confirmar la acción (con un estilo más destacado en rojo).
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-red-700 text-xl">⚠️</span>
        </div>
        <h2 className="text-lg font-bold text-gray-900 text-center mb-2">{titulo}</h2>
        <p className="text-sm text-gray-500 text-center mb-6">{mensaje}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancelar}
            className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Volver
          </button>
          <button
            onClick={onConfirmar}
            className="flex-1 py-2.5 rounded-lg bg-red-700 text-white text-sm font-semibold hover:bg-red-800 transition-colors"
          >
            Sí, cancelar
          </button>
        </div>
      </div>
    </div>
  );
}