// Llamadas a /api/v1/usuarios de ms-usuarios. Todas van con el token de la sesión.
import { pedir } from "./cliente";

// Cualquier sesión: los datos de la cuenta propia
export function obtenerMiCuenta() {
  return pedir("/api/v1/usuarios/me");
}

// Solo ADMINISTRADOR (el backend responde 403 a los demás)
export function listarUsuarios() {
  return pedir("/api/v1/usuarios");
}

export function crearUsuario(datos) {
  return pedir("/api/v1/usuarios", { metodo: "POST", cuerpo: datos });
}

// datos con la forma de UsuarioAdmin; password vacía = no cambiarla
export function actualizarUsuario(id, datos) {
  return pedir(`/api/v1/usuarios/${id}`, { metodo: "PUT", cuerpo: datos });
}

export function eliminarUsuario(id) {
  return pedir(`/api/v1/usuarios/${id}`, { metodo: "DELETE" });
}
