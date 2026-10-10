// src/utils/productos.js
import productos from "../data/productos.json";

// Devuelve el producto con ese código, o undefined si no existe.
export function buscarProductoPorCodigo(codigo) {
  return productos.find((producto) => producto.codigo === codigo);
}
