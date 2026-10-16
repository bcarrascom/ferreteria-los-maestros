// src/utils/productos.spec.jsx
import {
  buscarProductoPorCodigo,
  obtenerCategorias,
  obtenerProductosPorCategoria,
  obtenerProductos,
  guardarProductos,
  leerProductosGuardados,

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


describe("obtenerProductos", () => {
  it("devuelve los 85 productos", () => {
      expect(obtenerProductos()).toHaveLength(85);
  });
});


describe("leerProductosGuardados", () => {
  it("sin nada guardado entrega los 85 del JSON", () => {
    expect(leerProductosGuardados()).toHaveLength(85);
  });

  it("devuelve los productos guardados", () => {
    guardarProductos([{ codigo: "AA001" }]);
    expect(leerProductosGuardados()).toEqual([{ codigo: "AA001" }]);
  });

  it("si lo guardado está dañado o no es una lista, vuelve al JSON", () => {
    localStorage.setItem("productos", "esto no es JSON");
    expect(leerProductosGuardados()).toHaveLength(85);

    localStorage.setItem("productos", '{"no":"es lista"}');
    expect(leerProductosGuardados()).toHaveLength(85);
  });
});

describe("guardarProductos sin almacenamiento disponible", () => {
  it("no rompe la app", () => {
    const espia = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("almacenamiento lleno");
    });

    expect(() => guardarProductos([])).not.toThrow();
    espia.mockRestore();
  });
});
