import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ProductosDestacados from "./ProductosDestacados";

describe("ProductosDestacados", () => {
  it("muestra los 4 destacados", () => {
    render(
      <MemoryRouter>
        <ProductosDestacados />
      </MemoryRouter>
    );
    expect(screen.getAllByRole("article")).toHaveLength(4);
  });

  it("el botón lleva al catálogo", () => {
    render(
      <MemoryRouter>
        <ProductosDestacados />
      </MemoryRouter>
    );
    const enlace = screen.getByRole("link", { name: "Ver catálogo completo" });
    expect(enlace).toHaveAttribute("href", "/catalogo");
  });
});
