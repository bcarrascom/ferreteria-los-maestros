import { Navigate } from "react-router-dom";
import AccesoRestringido from "../pages/AccesoRestringido";

// Muestra la vista solo si hay sesión y el rol está permitido.
// Es una restricción de experiencia de usuario: la seguridad real la pone el backend con 401 y 403.
function RutaProtegida({ usuario, roles, verificando = false, children }) {
  // Al cargar la página con el access token vencido, App lo renueva antes de decidir
  if (verificando) {
    return <p className="container py-5">Verificando sesión…</p>;
  }

  if (!usuario) {
    return <Navigate to="/acceso" replace />;
  }

  if (!roles.includes(usuario.rol)) {
    return <AccesoRestringido usuario={usuario} />;
  }

  return children;
}

export default RutaProtegida;
