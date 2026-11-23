// Validación de RUT con módulo 11, la misma regla que aplica ms-usuarios en el servidor.
// En el front solo sirve para avisar antes de enviar: el backend vuelve a validar.

// "12.345.678-k" → "12345678-K"
export function normalizarRut(rut) {
  return rut.replace(/\./g, "").replace(/\s/g, "").toUpperCase();
}

export function esRutValido(rut) {
  const limpio = normalizarRut(rut);

  if (!/^\d{7,8}-[\dK]$/.test(limpio)) {
    return false;
  }

  const [cuerpo, digito] = limpio.split("-");

  // De derecha a izquierda, multiplicando por 2, 3, 4, 5, 6, 7 y volviendo a 2
  let suma = 0;
  let factor = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * factor;
    factor = factor === 7 ? 2 : factor + 1;
  }

  const resto = 11 - (suma % 11);
  let esperado = String(resto);
  if (resto === 11) {
    esperado = "0";
  } else if (resto === 10) {
    esperado = "K";
  }

  return digito === esperado;
}
