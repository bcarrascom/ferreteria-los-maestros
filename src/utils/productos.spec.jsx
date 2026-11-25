// src/utils/productos.spec.jsx
import { productosDePrueba } from "../test/catalogo";
import {
  buscarProductoPorCodigo,
  obtenerCategorias,
  obtenerProductosPorCategoria,
} from "./productos";

describe("buscarProductoPorCodigo", () => {
  it("encuentra un producto que existe", () => {
    const producto = buscarProductoPorCodigo("MC001", productosDePrueba);
    expect(producto.nombre_producto).toBe("Cemento Polpaico gris 25 kg");
  });

  it("devuelve undefined si el código no existe", () => {
    expect(buscarProductoPorCodigo("XX999", productosDePrueba)).toBeUndefined();
  });

  it("busca en la lista que recibe, no en datos locales", () => {
    const lista = [{ codigo: "MC001", nombre_producto: "Cemento con precio nuevo" }];
    expect(buscarProductoPorCodigo("MC001", lista).nombre_producto).toBe("Cemento con precio nuevo");
  });
});

describe("obtenerCategorias", () => {
  it("devuelve las 9 categorías sin repetir", () => {
    expect(obtenerCategorias(productosDePrueba)).toHaveLength(9);
  });

  it("con el catálogo vacío (todavía cargando) no hay categorías", () => {
    expect(obtenerCategorias([])).toEqual([]);
  });
});

describe("obtenerProductosPorCategoria", () => {
  it("devuelve solo productos de esa categoría", () => {
    const productos = obtenerProductosPorCategoria("Seguridad", productosDePrueba);
    expect(productos).toHaveLength(5);

    productos.forEach((producto) => {
      expect(producto.categoria).toBe("Seguridad");
    });
  });
});
