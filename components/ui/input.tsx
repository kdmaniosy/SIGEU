import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"


// Este archivo define un componente de entrada (Input) que se basa en el componente InputPrimitive de la biblioteca @base-ui/react/input. El componente Input aplica estilos específicos utilizando Tailwind CSS para crear un campo de entrada estilizado y funcional. La función cn se utiliza para combinar las clases de Tailwind CSS con cualquier clase adicional que se pase a través de props, lo que permite una fácil personalización del estilo del componente. El componente también maneja diferentes estados como deshabilitado, inválido y enfocado, aplicando estilos correspondientes para cada uno de estos estados.
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

export { Input }
