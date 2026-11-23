// src/test/tokens.js
// Arma JWT de prueba sin firma real: el front solo lee el payload, la firma la verifica el backend.

function base64url(objeto) {
  const bytes = new TextEncoder().encode(JSON.stringify(objeto));
  let binario = "";
  bytes.forEach((byte) => {
    binario += String.fromCharCode(byte);
  });
  return btoa(binario).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function tokenDePrueba(payload) {
  return `${base64url({ alg: "HS256" })}.${base64url(payload)}.firma-de-prueba`;
}

// Access token como los de ms-usuarios. minutos negativos = vencido.
export function accessDePrueba({ id = 3, rol = "CLIENTE", nombre = "Camila Rojas Díaz", minutos = 15 } = {}) {
  return tokenDePrueba({
    iss: "ferreteria-ms-usuarios",
    sub: String(id),
    correo: "cliente@ferreteria.cl",
    nombre,
    rol,
    tipo: "access",
    exp: Math.floor(Date.now() / 1000) + minutos * 60,
  });
}

export function refreshDePrueba({ id = 3, dias = 7 } = {}) {
  return tokenDePrueba({ sub: String(id), tipo: "refresh", exp: Math.floor(Date.now() / 1000) + dias * 86400 });
}

// Imita lo que devuelve fetch, con lo que usa cliente.js: status, ok y json().
export function respuestaDePrueba(status, cuerpo = null) {
  return { status, ok: status >= 200 && status < 300, json: async () => cuerpo };
}
