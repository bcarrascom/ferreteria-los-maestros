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
// Recibe la lista de productos actual: el administrador puede cambiar precios.
export function calcularTotal(carrito, listaProductos) {
  let total = 0;

  carrito.forEach((item) => {
    const producto = buscarProductoPorCodigo(item.codigo, listaProductos);

    if (producto) {
      total = total + producto.precio_venta_clp * item.cantidad;
    }
  });

  return total;
}


// Nombre con que se guarda el carrito en localStorage.
export const CLAVE_CARRITO = "carrito";

// Revisa el carrito leído del navegador y deja solo items válidos:
// código existente, con stock, cantidad entera de 1 o más y sin superar el stock.
// Se valida contra la lista de productos actual (puede haber sido editada).
export function limpiarCarrito(guardado, listaProductos) {
  if (!Array.isArray(guardado)) {
    return [];
  }

  const limpio = [];

  guardado.forEach((item) => {
    if (!item) {
      return;
    }

    const producto = buscarProductoPorCodigo(item.codigo, listaProductos);

    if (!producto || producto.stock === 0) {
      return;
    }

    if (!Number.isInteger(item.cantidad) || item.cantidad < 1) {
      return;
    }

    let cantidadFinal = item.cantidad;

    if (item.cantidad > producto.stock) {
      cantidadFinal = producto.stock;
    }

    limpio.push({ codigo: item.codigo, cantidad: cantidadFinal });
  });

  return limpio;
}
