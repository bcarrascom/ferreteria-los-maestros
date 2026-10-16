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

// Reglas 2 y 4: no supera el stock, y bajar de 1 quita el producto.
export function cambiarCantidad(carrito, producto, cantidadNueva) {
  if (cantidadNueva < 1) {
    return quitarDelCarrito(carrito, producto.codigo);
  }

  let cantidadFinal = cantidadNueva;

  if (cantidadNueva > producto.stock) {
    cantidadFinal = producto.stock;
  }

  return carrito.map((item) => {
    if (item.codigo === producto.codigo) {
      return { ...item, cantidad: cantidadFinal };
    }
    return item;
  });
}

export function quitarDelCarrito(carrito, codigo) {
  return carrito.filter((item) => item.codigo !== codigo);
}

// Suma las cantidades: 2 cementos + 1 pintura = 3.
export function contarProductos(carrito) {
  let total = 0;

  carrito.forEach((item) => {
    total = total + item.cantidad;
  });

  return total;
}

// Suma precio por cantidad. Salta los códigos que ya no existen.
export function calcularTotal(carrito) {
  let total = 0;

  carrito.forEach((item) => {
    const producto = buscarProductoPorCodigo(item.codigo);

    if (producto) {
      total = total + producto.precio_venta_clp * item.cantidad;
    }
  });

  return total;
}


const CLAVE_CARRITO = "carrito";

// Lee el carrito guardado en el navegador. Si no hay o está dañado, parte vacío.
export function leerCarritoGuardado() {
  const guardado = localStorage.getItem(CLAVE_CARRITO);

  if (guardado === null) {
    return [];
  }

  try {
    return JSON.parse(guardado);
  } catch {
    return [];
  }
}

export function guardarCarrito(carrito) {
  localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
}