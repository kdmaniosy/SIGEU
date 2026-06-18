import * as React from "react"

import { cn } from "@/lib/utils"


// Este archivo define varios componentes relacionados con una tarjeta (Card) que se pueden usar para mostrar información de manera estructurada. El componente principal es Card, que es un contenedor para otros subcomponentes como CardHeader, CardTitle, CardDescription, CardAction, CardContent y CardFooter. Cada uno de estos subcomponentes tiene su propia función y estilos específicos para organizar el contenido dentro de la tarjeta. El uso de la función cn permite combinar clases de Tailwind CSS con cualquier clase adicional que se pase a través de props, lo que facilita la personalización de los estilos de cada componente.
function Card({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"div"> & { size?: "default" | "sm" }) {
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(
        "group/card flex flex-col gap-4 overflow-hidden rounded-xl bg-card py-4 text-sm text-card-foreground ring-1 ring-foreground/10 has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:gap-3 data-[size=sm]:py-3 data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl",
        className
      )}
      {...props}
    />
  )
}

// El componente CardHeader es un contenedor para el encabezado de la tarjeta, que puede incluir el título y la descripción. Utiliza clases de Tailwind CSS para definir su apariencia y disposición, y también permite personalizar su estilo a través de props.
function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-xl px-4 group-data-[size=sm]/card:px-3 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-4 group-data-[size=sm]/card:[.border-b]:pb-3",
        className
      )}
      {...props}
    />
  )
}


// El componente CardTitle se utiliza para mostrar el título de la tarjeta. Aplica estilos específicos para el texto del título y también permite personalizar su apariencia a través de props.
function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "font-heading text-base leading-snug font-medium group-data-[size=sm]/card:text-sm",
        className
      )}
      {...props}
    />
  )
}


// El componente CardDescription se utiliza para mostrar una descripción o información adicional debajo del título de la tarjeta. Aplica estilos específicos para el texto de la descripción y también permite personalizar su apariencia a través de props.
function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}


// El componente CardAction se utiliza para mostrar acciones relacionadas con la tarjeta, como botones o enlaces. Aplica estilos específicos para la disposición de las acciones y también permite personalizar su apariencia a través de props.
function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}


// El componente CardContent se utiliza para mostrar el contenido principal de la tarjeta. Aplica estilos específicos para el espaciado y también permite personalizar su apariencia a través de props.
function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-4 group-data-[size=sm]/card:px-3", className)}
      {...props}
    />
  )
}


// El componente CardFooter se utiliza para mostrar el pie de página de la tarjeta, que puede incluir información adicional o acciones relacionadas. Aplica estilos específicos para la disposición del pie de página y también permite personalizar su apariencia a través de props.
function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center rounded-b-xl border-t bg-muted/50 p-4 group-data-[size=sm]/card:p-3",
        className
      )}
      {...props}
    />
  )
}


// Finalmente, se exportan todos los componentes relacionados con la tarjeta para que puedan ser utilizados en otras partes de la aplicación. Esto permite que los desarrolladores importen y utilicen estos componentes de manera modular y reutilizable en diferentes contextos donde se necesite mostrar información estructurada en forma de tarjeta.
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
