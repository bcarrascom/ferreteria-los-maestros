import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Encabezado from "./Encabezado";

describe("Encabezado", () => {
  it("muestra la cantidad del carrito que recibe", () => {
    render(
      <MemoryRouter>
        <Encabezado cantidadCarrito={3} />
      </MemoryRouter>
    );
    expect(screen.getByRole("link", { name: /carrito/i })).toHaveTextContent("3");
  });

  it("marca como activa la página actual", () => {
    render(
      <MemoryRouter initialEntries={["/catalogo"]}>
        <Encabezado cantidadCarrito={0} />
      </MemoryRouter>
    );
    expect(screen.getByRole("link", { name: "Catálogo" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Inicio" })).not.toHaveAttribute("aria-current");
  });
});
