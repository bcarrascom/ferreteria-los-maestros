import { render, screen } from "@testing-library/react";
import SeccionCategoria from "./SeccionCategoria";

const productosDePrueba = [
  { codigo: "AA001", nombre_producto: "Producto uno", marca: "Marca A", precio_venta_clp: 1000 },
  { codigo: "AA002", nombre_producto: "Producto dos", marca: "Marca B", precio_venta_clp: 2000 },
  { codigo: "AA003", nombre_producto: "Producto tres", marca: "Marca C", precio_venta_clp: 3000 },
];

describe("SeccionCategoria", () => {
  it("muestra el nombre de la categoría como título", () => {
    render(<SeccionCategoria categoria="Pinturas" productos={productosDePrueba} />);
    expect(screen.getByRole("heading", { name: "Pinturas" })).toBeInTheDocument();
  });

  it("muestra una tarjeta por cada producto recibido", () => {
    render(<SeccionCategoria categoria="Pinturas" productos={productosDePrueba} />);
    expect(screen.getAllByRole("article")).toHaveLength(3);
  });
});
