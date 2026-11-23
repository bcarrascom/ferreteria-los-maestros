import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PiePagina from "./PiePagina";

describe("PiePagina", () => {
  it("muestra la dirección y enlaza al catálogo", () => {
    render(
      <MemoryRouter>
        <PiePagina />
      </MemoryRouter>
    );
    // Rengifo 320 es parte del texto de la dirección
    expect(screen.getByText(/Rengifo 320/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Catálogo" })).toHaveAttribute("href", "/catalogo");
  });

  it("al vendedor no le muestra accesos a la tienda", () => {
    render(
      <MemoryRouter>
        <PiePagina rol="VENDEDOR" />
      </MemoryRouter>
    );
    expect(screen.queryByRole("navigation", { name: "Navegación del pie de página" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Carrito" })).not.toBeInTheDocument();
  });

  it("al administrador no le muestra el carrito", () => {
    render(
      <MemoryRouter>
        <PiePagina rol="ADMINISTRADOR" />
      </MemoryRouter>
    );
    expect(screen.getByRole("link", { name: "Catálogo" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Carrito" })).not.toBeInTheDocument();
  });
});
