interface Props {
  visible: boolean;
  titulo: string;
  mensaje: string;
  onConfirmar: () => void;
  onCancelar: () => void;
}

export default function ModalConfirmacion({ visible, titulo, mensaje, onConfirmar, onCancelar }: Props) {
  if (!visible) return null;

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