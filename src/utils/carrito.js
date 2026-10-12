import { buscarProductoPorCodigo } from "./productos";

// Cada elemento del carrito es { codigo, cantidad }.
// Ninguna función modifica el carrito que recibe: siempre devuelven uno nuevo.

function buscarEnCarrito(carrito, codigo) {
  return carrito.find((item) => item.codigo === codigo);
}

// Reglas 1, 2 y 3: no duplica, no supera el stock y no agrega sin stock.
export function agregarAlCarrito(carrito, producto) {
  if (producto.stock === 0) {
    return carrito;
  }

  const itemExistente = buscarEnCarrito(carrito, producto.codigo);

  if (!itemExistente) {
    return [...carrito, { codigo: producto.codigo, cantidad: 1 }];
  }

  if (itemExistente.cantidad >= producto.stock) {
    return carrito;
  }

  return carrito.map((item) => {
    if (item.codigo === producto.codigo) {
      return { ...item, cantidad: item.cantidad + 1 };
    }
    return item;
  });
}
