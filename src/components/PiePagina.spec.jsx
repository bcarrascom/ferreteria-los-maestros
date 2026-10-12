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
});
