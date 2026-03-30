const steps = [
  {
    number: "01",
    title: "Crea tu cuenta",
    description: "Regístrate con tu correo institucional en menos de 2 minutos.",
  },
  {
    number: "02",
    title: "Elige el espacio",
    description: "Busca el aula o laboratorio que necesitas y revisa su disponibilidad.",
  },
  {
    number: "03",
    title: "Confirma tu reserva",
    description: "Selecciona el horario y confirma. Recibirás una notificación de confirmación.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="py-20 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ¿Cómo funciona?
          </h2>
          <p className="text-gray-500">
            Reserva un espacio en tres simples pasos.
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          {steps.map((step) => (
            <div key={step.number} className="flex-1 text-center">
              <div className="w-14 h-14 bg-red-700 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4">
                {step.number}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}