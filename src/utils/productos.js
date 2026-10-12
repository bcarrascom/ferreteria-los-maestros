import productos from "../data/productos.json";

// Devuelve el producto con ese código, o undefined si no existe.
export function buscarProductoPorCodigo(codigo) {
  return productos.find((producto) => producto.codigo === codigo);
}

// Devuelve la lista completa de productos.
export function obtenerProductos() {
  return productos;
}

// Devuelve las categorías sin repetir.
export function obtenerCategorias() {
  const categorias = [];
  productos.forEach((producto) => {
    if (!categorias.includes(producto.categoria)) {
      categorias.push(producto.categoria);
    }
  });
  return categorias;
}
// Obtenemos la lista de categorías en vez de hardcodearlas para luego
// poder agregar nuevas categorías sin tocar el código.


// Devuelve solo los productos de una categoría.
export function obtenerProductosPorCategoria(categoria) {
  return productos.filter((producto) => producto.categoria === categoria);
}
