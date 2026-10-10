// src/utils/productos.spec.jsx
import { buscarProductoPorCodigo } from "./productos";

describe("buscarProductoPorCodigo", () => {
  it("encuentra un producto que existe", () => {
    const producto = buscarProductoPorCodigo("MC001");
    expect(producto.nombre_producto).toBe("Cemento Polpaico gris 25 kg");
  });

  it("devuelve undefined si el código no existe", () => {
    expect(buscarProductoPorCodigo("XX999")).toBeUndefined();
  });
});
