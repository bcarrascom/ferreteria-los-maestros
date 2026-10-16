import productosBase from "../data/productos.json";

const CLAVE_PRODUCTOS = "productos";

export function leerProductosGuardados() {
  const guardados = localStorage.getItem(CLAVE_PRODUCTOS);

  if (guardados === null) {
    return productosBase;
  }

  try {
    const productos = JSON.parse(guardados);
    return Array.isArray(productos) ? productos : productosBase;
  } catch {
    return productosBase;
  }
}

export function guardarProductos(productos) {
  localStorage.setItem(CLAVE_PRODUCTOS, JSON.stringify(productos));
}

// Devuelve el producto con ese código, o undefined si no existe.
export function buscarProductoPorCodigo(codigo, listaProductos = productosBase) {
  return listaProductos.find((producto) => producto.codigo === codigo);
}

// Devuelve la lista completa de productos.
export function obtenerProductos(listaProductos = productosBase) {
  return listaProductos;
}

// Devuelve las categorías sin repetir.
export function obtenerCategorias(listaProductos = productosBase) {
  const categorias = [];
  listaProductos.forEach((producto) => {
    if (!categorias.includes(producto.categoria)) {
      categorias.push(producto.categoria);
    }
  });
  return categorias;
}

// Obtenemos la lista de categorías en vez de hardcodearlas para luego
// poder agregar nuevas categorías sin tocar el código.

// Devuelve solo los productos de una categoría.
export function obtenerProductosPorCategoria(categoria, listaProductos = productosBase) {
  return listaProductos.filter((producto) => producto.categoria === categoria);
}