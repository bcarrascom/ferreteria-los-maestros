// src/test/catalogo.js
// Datos de prueba del catálogo. La app ya no importa productos.json: los productos vienen de ms-catalogo.
// Las pruebas sí lo usan, porque son los mismos 85 productos que carga el backend al arrancar.
import productosJson from "../data/productos.json";

// Formato del front (el que entrega desdeApi): para probar componentes sueltos
export const productosDePrueba = productosJson.map((producto) => ({
  ...producto,
  stock_bajo: producto.stock <= producto.stock_minimo,
}));

// Formato de la API (ProductoRespuesta, sin precioCompra): para simular la respuesta de GET /api/v1/productos
export function catalogoApiDePrueba() {
  return productosJson.map((producto) => ({
    codigo: producto.codigo,
    nombre: producto.nombre_producto,
    categoria: producto.categoria,
    categoriaId: 1,
    subcategoria: producto.subcategoria,
    marca: producto.marca,
    unidad: producto.unidad,
    precioVenta: producto.precio_venta_clp,
    stock: producto.stock,
    stockMinimo: producto.stock_minimo,
    stockBajo: producto.stock <= producto.stock_minimo,
  }));
}
