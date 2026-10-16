import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import DetalleProducto from "./DetalleProducto";

// Dibuja la página como si el usuario hubiera entrado a esa URL.
function renderizarEnRuta(ruta, alAgregar) {
  render(
    <MemoryRouter initialEntries={[ruta]}>
      <Routes>
        <Route path="/catalogo/:codigo" element={<DetalleProducto alAgregar={alAgregar} />} />
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


    it("el botón Agregar entrega el producto de la página", async () => {
    const funcionFalsa = vi.fn();
    renderizarEnRuta("/catalogo/MC001", funcionFalsa);

    await userEvent.click(screen.getByRole("button", { name: "Agregar al carrito" }));

    expect(funcionFalsa).toHaveBeenCalledTimes(1);
    expect(funcionFalsa.mock.calls[0][0].codigo).toBe("MC001");
  });

    it("si la foto no carga, muestra el logo", () => {
    renderizarEnRuta("/catalogo/MC001", vi.fn());
    const imagen = screen.getByRole("img", { name: "Cemento Polpaico gris 25 kg" });

    fireEvent.error(imagen);

    expect(imagen.src).toContain("/img/logo.jpg");
  });

});
