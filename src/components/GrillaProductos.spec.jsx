import { render, screen } from "@testing-library/react";
import GrillaProductos from "./GrillaProductos";

// Datos de prueba: no dependen del JSON real.
const productosDePrueba = [
  { codigo: "AA001", nombre_producto: "Producto uno", marca: "Marca A", precio_venta_clp: 1000 },
  { codigo: "AA002", nombre_producto: "Producto dos", marca: "Marca B", precio_venta_clp: 2000 },
];

describe("GrillaProductos", () => {
  it("muestra una tarjeta por cada producto", () => {
    render(<GrillaProductos productos={productosDePrueba} />);
    expect(screen.getAllByRole("article")).toHaveLength(2);
  });
});
