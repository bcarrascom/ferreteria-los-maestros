// Funciones de consulta sobre la lista de productos que vino de ms-catalogo.
// Ya no hay datos locales: cada función recibe la lista. Sin un valor por defecto, nadie puede leer
// por error precios o stock viejos de un JSON guardado en el front.

// Devuelve el producto con ese código, o undefined si no existe.
export function buscarProductoPorCodigo(codigo, listaProductos) {
  return listaProductos.find((producto) => producto.codigo === codigo);
}

// Devuelve las categorías sin repetir.
export function obtenerCategorias(listaProductos) {
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
export function obtenerProductosPorCategoria(categoria, listaProductos) {
  return listaProductos.filter((producto) => producto.categoria === categoria);
}
