// src/utils/precio.js
export function formatearPrecio(valor) {
  if (valor === 0) return "Gratis";
  return `$${valor.toLocaleString("es-CL")}`;
}