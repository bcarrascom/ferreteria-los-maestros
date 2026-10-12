import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Al cambiar de página, sube al inicio de la ventana.
function VolverArriba() {
  const ubicacion = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [ubicacion.pathname]);

  return null;
}

export default VolverArriba;
