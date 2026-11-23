// Cliente HTTP común para los 3 microservicios. Lo usan auth.js, usuarios.js, productos.js, boletas.js...
import { borrarTokens, guardarTokens, leerTokens } from "../utils/sesion";

// Error con el formato del backend: { status, mensaje, detalles }.
// "detalles" trae un mensaje por campo en los errores 400 de validación.
export class ErrorApi extends Error {
  constructor(status, mensaje, detalles = null) {
    super(mensaje);
    this.status = status;
    this.mensaje = mensaje;
    this.detalles = detalles;
  }
}

// Si varias peticiones reciben 401 al mismo tiempo, todas esperan LA MISMA renovación.
// Sin esto, cada una renovaría por su cuenta y el refresh token rotaría varias veces.
let renovacionEnCurso = null;

async function renovar() {
  const refreshToken = leerTokens()?.refreshToken;

  if (!refreshToken) {
    throw new ErrorApi(401, "Sesión expirada");
  }

  // Sin header Authorization a propósito: un access vencido haría que el backend responda 401
  const respuesta = await fetch("/api/v1/auth/refresh", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!respuesta.ok) {
    throw new ErrorApi(401, "Sesión expirada");
  }

  guardarTokens(await respuesta.json());
}

// También la usa App al cargar, si el access token guardado ya venció.
export function renovarSesion() {
  renovacionEnCurso ??= renovar().finally(() => {
    renovacionEnCurso = null;
  });
  return renovacionEnCurso;
}

// pedir("/api/v1/usuarios", { metodo: "POST", cuerpo: {...} })
// autenticado: false para login y registro, así un 401 por contraseña mala no intenta renovar.
export async function pedir(ruta, { metodo = "GET", cuerpo, autenticado = true } = {}, esReintento = false) {
  const accessToken = autenticado ? leerTokens()?.accessToken : null;
  const headers = {};

  if (cuerpo !== undefined) {
    headers["Content-Type"] = "application/json";
  }
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const respuesta = await fetch(ruta, {
    method: metodo,
    headers,
    body: cuerpo === undefined ? undefined : JSON.stringify(cuerpo),
  });

  // 401 con token: se renueva una vez y se reintenta la petición original una sola vez
  if (respuesta.status === 401 && accessToken && !esReintento) {
    try {
      await renovarSesion();
    } catch {
      borrarTokens();
      window.dispatchEvent(new Event("sesion-expirada"));   // App escucha, limpia el estado y va a /acceso
      throw new ErrorApi(401, "Tu sesión expiró. Inicia sesión nuevamente.");
    }
    return pedir(ruta, { metodo, cuerpo, autenticado }, true);
  }

  if (respuesta.status === 204) {
    return null;
  }

  const datos = await respuesta.json().catch(() => null);

  if (!respuesta.ok) {
    throw new ErrorApi(respuesta.status, datos?.mensaje ?? "Ocurrió un error inesperado", datos?.detalles ?? null);
  }

  return datos;
}
