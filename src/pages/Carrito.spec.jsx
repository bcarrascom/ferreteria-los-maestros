import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Carrito from "./Carrito";

function renderizarCarrito(carrito, alVaciar) {
  render(
    <MemoryRouter>
      <Carrito carrito={carrito} alCambiarCantidad={vi.fn()} alQuitar={vi.fn()} alVaciar={alVaciar} />
    </MemoryRouter>
  );
}

describe("Carrito", () => {
  it("avisa cuando el carrito está vacío", () => {
    renderizarCarrito([], vi.fn());
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Tu carrito está vacío");
  });

  it("muestra una fila por producto y el total", () => {
    // 5990 x 2 + 9990 x 1 = 21970
    renderizarCarrito(
      [
        { codigo: "MC001", cantidad: 2 },
        { codigo: "PT001", cantidad: 1 },
      ],
      vi.fn()
    );

    expect(screen.getAllByRole("button", { name: /^Quitar/ })).toHaveLength(2);
    expect(screen.getByText("$21.970")).toBeInTheDocument();
  });

  it("no muestra productos que ya no existen", () => {
    renderizarCarrito(
      [
        { codigo: "MC001", cantidad: 1 },
        { codigo: "XX999", cantidad: 1 },
      ],
      vi.fn()
    );
    expect(screen.getAllByRole("button", { name: /^Quitar/ })).toHaveLength(1);
  });

  it("el botón Vaciar llama a la función que recibe", async () => {
    const funcionFalsa = vi.fn();
    renderizarCarrito([{ codigo: "MC001", cantidad: 1 }], funcionFalsa);

    await userEvent.click(screen.getByRole("button", { name: "Vaciar carrito" }));

    expect(funcionFalsa).toHaveBeenCalledTimes(1);
  });
});
