import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"


// La función cn es una utilidad que combina las clases CSS utilizando clsx para manejar la lógica de combinación de clases y twMerge para resolver conflictos de clases de Tailwind CSS. Esta función permite a los desarrolladores pasar múltiples clases como argumentos, y se encargará de combinarlas correctamente, eliminando cualquier clase duplicada o conflictiva según las reglas de Tailwind. Esto facilita la gestión de clases dinámicas en los componentes de React, asegurando que el resultado final sea limpio y eficiente.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
