// src/utils/productos.spec.jsx
import {
  buscarProductoPorCodigo,
  obtenerCategorias,
  obtenerProductosPorCategoria,
} from "./productos";


describe("buscarProductoPorCodigo", () => {
  it("encuentra un producto que existe", () => {
    const producto = buscarProductoPorCodigo("MC001");
    expect(producto.nombre_producto).toBe("Cemento Polpaico gris 25 kg");
  });

  it("devuelve undefined si el código no existe", () => {
    expect(buscarProductoPorCodigo("XX999")).toBeUndefined();
  });
});

describe("obtenerCategorias", () => {
  it("devuelve las 9 categorías sin repetir", () => {
    expect(obtenerCategorias()).toHaveLength(9);
  });
});

describe("obtenerProductosPorCategoria", () => {
  it("devuelve solo productos de esa categoría", () => {
    const productos = obtenerProductosPorCategoria("Seguridad");
    expect(productos).toHaveLength(5);

    productos.forEach((producto) => {
      expect(producto.categoria).toBe("Seguridad");
    });
  });
});
