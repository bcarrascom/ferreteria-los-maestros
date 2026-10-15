import { useEffect, useState } from "react";

// Lee un valor guardado. Si no existe o está dañado, devuelve el valor inicial.
function leerValor(clave, valorInicial, limpiar) {
  try {
    const guardado = localStorage.getItem(clave);

    if (guardado === null) {
      return valorInicial;
    }

    return limpiar(JSON.parse(guardado));
  } catch {
    return valorInicial;
  }
}

// Igual que useState, pero el valor sobrevive al recargar la página.
// "limpiar" revisa lo leído: localStorage lo puede editar cualquiera.
export function useLocalStorage(clave, valorInicial, limpiar = (valor) => valor) {
  // La función flecha hace que se lea localStorage solo en el primer render.
  const [valor, setValor] = useState(() => leerValor(clave, valorInicial, limpiar));

  // Cada vez que cambia el valor, se guarda en el navegador.
  useEffect(() => {
    try {
      localStorage.setItem(clave, JSON.stringify(valor));
    } catch {
      // Incógnito o almacenamiento lleno: la app sigue funcionando, solo no recuerda.
    }
  }, [clave, valor]);

  return [valor, setValor];
}
