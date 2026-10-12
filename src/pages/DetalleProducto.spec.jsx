import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import DetalleProducto from "./DetalleProducto";

// Dibuja la página como si el usuario hubiera entrado a esa URL.
function renderizarEnRuta(ruta) {
  render(
    <MemoryRouter initialEntries={[ruta]}>
      <Routes>
        <Route path="/catalogo/:codigo" element={<DetalleProducto />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("DetalleProducto", () => {
  it("muestra el producto del código que viene en la URL", () => {
    renderizarEnRuta("/catalogo/MC001");

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Cemento Polpaico gris 25 kg");
    expect(screen.getByText("$5.990")).toBeInTheDocument();
  });

  it("avisa cuando el código no existe", () => {
    renderizarEnRuta("/catalogo/XX999");

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Producto no encontrado");
    expect(screen.getByRole("link", { name: "Volver al catálogo" })).toHaveAttribute("href", "/catalogo");
  });
});
