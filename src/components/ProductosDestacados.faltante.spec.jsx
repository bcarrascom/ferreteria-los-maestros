import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ProductosDestacados from "./ProductosDestacados";

// Mock del módulo: reemplaza la búsqueda real por una falsa, donde MC001 no existe.
vi.mock("../utils/productos", () => ({
  buscarProductoPorCodigo: (codigo) => {
    if (codigo === "MC001") {
      return undefined;
    }
    return { codigo, nombre_producto: `Producto ${codigo}`, marca: "Marca", precio_venta_clp: 1000 };
  },
}));

describe("ProductosDestacados con un código que no existe", () => {
  it("avisa en consola y muestra solo los que encontró", () => {
    const espiaAviso = vi.spyOn(console, "warn").mockImplementation(() => {});

    render(
      <MemoryRouter>
        <ProductosDestacados />
      </MemoryRouter>
    );

    expect(screen.getAllByRole("article")).toHaveLength(3);
    expect(espiaAviso).toHaveBeenCalledTimes(1);

    espiaAviso.mockRestore();
  });
});
