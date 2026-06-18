"use client";
import { createContext, useContext, useEffect, useState } from "react";


// El contexto ThemeContext se utiliza para gestionar el tema de la aplicación (claro u oscuro) y proporcionar una función para alternar entre ellos. El componente ThemeProvider envuelve a los componentes hijos y proporciona el estado del tema y la función toggleTheme a través del contexto. El hook useTheme permite a los componentes acceder fácilmente al estado del tema y a la función de alternancia. El tema se guarda en localStorage para persistir la preferencia del usuario, y también se respeta la preferencia del sistema operativo si no hay una configuración guardada.
interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}


// El contexto se inicializa con un valor predeterminado donde isDark es false y toggleTheme es una función vacía. Esto asegura que los componentes que consumen el contexto
const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggleTheme: () => {},
});


// El componente ThemeProvider es responsable de gestionar el estado del tema y proporcionar la función para alternar entre los temas claro y oscuro. Utiliza el hook useState para mantener el estado de isDark, que indica si el tema actual es oscuro o no. También utiliza el hook useEffect para cargar la preferencia de tema guardada en localStorage al montar el componente, y para aplicar la clase "dark" al elemento raíz del documento si el tema es oscuro. La función toggleTheme se encarga de cambiar el estado del tema, actualizar la clase en el documento y guardar la preferencia en localStorage.
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const [montado, setMontado] = useState(false);


  // El hook useEffect se ejecuta una vez al montar el componente ThemeProvider. Primero, establece el estado montado en true para indicar que el componente ha sido montado. Luego, intenta cargar la preferencia de tema guardada en localStorage utilizando la clave "tema". Si no hay una preferencia guardada, se verifica la preferencia del sistema operativo utilizando window.matchMedia para determinar si el usuario prefiere un tema oscuro. Finalmente, se actualiza el estado isDark y se agrega o elimina la clase "dark" en el elemento raíz del documento según corresponda.
  useEffect(() => {
    setMontado(true);
    const guardado = localStorage.getItem("tema");
    const prefiereDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const usarDark = guardado === "dark" || (!guardado && prefiereDark);
    if (usarDark) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);


  // La función toggleTheme se encarga de alternar el tema entre claro y oscuro. Cambia el estado isDark al valor opuesto, actualiza la clase "dark" en el elemento raíz del documento según el nuevo estado, y guarda la preferencia de tema en localStorage para que se mantenga en futuras visitas.
  function toggleTheme() {
    const nuevo = !isDark;
    setIsDark(nuevo);
    if (nuevo) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("tema", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("tema", "light");
    }
  }

  // Si el componente aún no ha sido montado, se devuelve null para evitar renderizar los componentes hijos antes de que se haya determinado el tema. Esto es importante para evitar un parpadeo de contenido con el tema incorrecto al cargar la página.
  if (!montado) return <>{children}</>;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

//  El hook useTheme es una función personalizada que permite a los componentes acceder al contexto ThemeContext de manera sencilla. Al llamar a useTheme, los componentes pueden obtener el estado isDark para saber si el tema actual es oscuro o no, y la función toggleTheme para alternar entre los temas claro y oscuro. Esto facilita la gestión del tema en toda la aplicación sin necesidad de propagar manualmente las props a través de múltiples niveles de componentes.
export function useTheme() {
  return useContext(ThemeContext);
}