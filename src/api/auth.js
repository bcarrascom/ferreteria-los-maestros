// Llamadas a /api/v1/auth de ms-usuarios. Las dos guardan los tokens que devuelve el backend.
import { guardarTokens } from "../utils/sesion";
import { pedir } from "./cliente";

export async function iniciarSesion(correo, password) {
  const datos = await pedir("/api/v1/auth/login", {
    metodo: "POST",
    cuerpo: { correo, password },
    autenticado: false,
  });
  guardarTokens(datos);
  return datos;
}

// datos: rut, nombre, apellidos, correo, password y los opcionales telefono, region, comuna, direccion.
export async function registrarCliente(datos) {
  const respuesta = await pedir("/api/v1/auth/registro", {
    metodo: "POST",
    cuerpo: datos,
    autenticado: false,
  });
  guardarTokens(respuesta);
  return respuesta;
}
