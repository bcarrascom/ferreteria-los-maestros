// Llamadas a /api/v1/categorias de ms-catalogo.
// Leer es público; crear, editar y eliminar son solo para ADMINISTRADOR.
// Cada categoría viene como { id, nombre, descripcion, cantidadProductos }.
import { pedir } from "./cliente";

export function listarCategorias() {
  return pedir("/api/v1/categorias");
}

export function obtenerCategoria(id) {
  return pedir(`/api/v1/categorias/${id}`);
}

// datos: { nombre, descripcion }
export function crearCategoria(datos) {
  return pedir("/api/v1/categorias", { metodo: "POST", cuerpo: datos });
}

export function actualizarCategoria(id, datos) {
  return pedir(`/api/v1/categorias/${id}`, { metodo: "PUT", cuerpo: datos });
}

// 409 si la categoría todavía tiene productos
export function eliminarCategoria(id) {
  return pedir(`/api/v1/categorias/${id}`, { metodo: "DELETE" });
}
