// Llamadas a /api/v1/productos de ms-catalogo.
// Leer es público; con sesión, pedir() manda el token igual y así el ADMINISTRADOR recibe precioCompra.
// Crear, editar y eliminar son solo para ADMINISTRADOR (el backend responde 403 a los demás).
import { pedir } from "./cliente";

// La API responde en camelCase (precioVenta) y los componentes usan los nombres del JSON original
// (precio_venta_clp). El adaptador traduce en un solo lugar y así no se reescriben los componentes.
export function desdeApi(p) {
  return {
    codigo: p.codigo,
    categoria: p.categoria,
    categoriaId: p.categoriaId,
    subcategoria: p.subcategoria,
    nombre_producto: p.nombre,
    marca: p.marca,
    unidad: p.unidad,
    precio_venta_clp: p.precioVenta,
    precio_compra_clp: p.precioCompra ?? null,   // solo viene si quien consulta es ADMINISTRADOR
    stock: p.stock,
    stock_minimo: p.stockMinimo,
    stock_bajo: p.stockBajo,
  };
}

// Un campo vacío del formulario va como null y no como 0: así el backend responde
// "El precio de venta es obligatorio" en vez de "debe ser mayor a 0".
function numeroONulo(valor) {
  return valor === "" || valor === null || valor === undefined ? null : Number(valor);
}

// Del formulario de gestión de productos al cuerpo que espera el backend (ProductoEntrada)
export function haciaApi(f) {
  return {
    codigo: f.codigo,
    nombre: f.nombre_producto,
    categoriaId: numeroONulo(f.categoriaId),
    subcategoria: f.subcategoria,
    marca: f.marca,
    unidad: f.unidad,
    precioVenta: numeroONulo(f.precio_venta_clp),
    precioCompra: numeroONulo(f.precio_compra_clp),
    stock: numeroONulo(f.stock),
    stockMinimo: numeroONulo(f.stock_minimo),
  };
}

// filtros opcionales: { categoria: <id>, q: "texto" }
export async function listarProductos({ categoria, q } = {}) {
  const parametros = new URLSearchParams();
  if (categoria) {
    parametros.set("categoria", categoria);
  }
  if (q) {
    parametros.set("q", q);
  }
  const consulta = parametros.toString();
  const productos = await pedir(`/api/v1/productos${consulta ? `?${consulta}` : ""}`);
  return productos.map(desdeApi);
}

export async function obtenerProducto(codigo) {
  return desdeApi(await pedir(`/api/v1/productos/${encodeURIComponent(codigo)}`));
}

export async function crearProducto(formulario) {
  return desdeApi(await pedir("/api/v1/productos", { metodo: "POST", cuerpo: haciaApi(formulario) }));
}

// El código no se puede cambiar: va en la URL y el backend ignora el del cuerpo
export async function actualizarProducto(codigo, formulario) {
  return desdeApi(
    await pedir(`/api/v1/productos/${encodeURIComponent(codigo)}`, { metodo: "PUT", cuerpo: haciaApi(formulario) })
  );
}

export function eliminarProducto(codigo) {
  return pedir(`/api/v1/productos/${encodeURIComponent(codigo)}`, { metodo: "DELETE" });
}
