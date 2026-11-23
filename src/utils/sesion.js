// Sesión con JWT: en el navegador solo se guardan los dos tokens.
// Los datos visibles del usuario (nombre, rol) se leen del access token, no se guardan aparte.

const CLAVE_SESION = "sesion-ferreteria";

// Devuelve { accessToken, refreshToken } o null.
// La versión anterior del sitio guardaba un objeto usuario con esta misma clave: eso cuenta como sin sesión.
export function leerTokens() {
  const guardada = localStorage.getItem(CLAVE_SESION);

  if (guardada === null) {
    return null;
  }

  try {
    const tokens = JSON.parse(guardada);
    if (typeof tokens?.accessToken === "string" && typeof tokens?.refreshToken === "string") {
      return { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken };
    }
    return null;
  } catch {
    return null;
  }
}

// Recibe la respuesta de login, registro o refresh y guarda solo los tokens.
export function guardarTokens({ accessToken, refreshToken }) {
  localStorage.setItem(CLAVE_SESION, JSON.stringify({ accessToken, refreshToken }));
}

export function borrarTokens() {
  localStorage.removeItem(CLAVE_SESION);
}

// El payload es la parte del medio del JWT, en base64url.
// atob solo no sirve con tildes ("Muñoz"): hay que decodificar los bytes como UTF-8.
export function leerPayload(token) {
  const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
  const bytes = Uint8Array.from(atob(base64), (caracter) => caracter.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}

// exp viene en segundos y Date.now() en milisegundos.
export function estaVigente(token) {
  try {
    return leerPayload(token).exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

// Usuario visible a partir del access token: { id, nombre, correo, rol }, o null si no hay sesión.
export function usuarioDeSesion(tokens) {
  if (!tokens) {
    return null;
  }

  try {
    const payload = leerPayload(tokens.accessToken);
    return { id: Number(payload.sub), nombre: payload.nombre, correo: payload.correo, rol: payload.rol };
  } catch {
    return null;
  }
}
