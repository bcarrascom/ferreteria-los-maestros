import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import FilaCarrito from "./FilaCarrito";

const taladro = { codigo: "AA001", nombre_producto: "Taladro", precio_venta_clp: 1000, stock: 3 };

// Una fila <tr> solo es válida dentro de una tabla.
function renderizarFila(cantidad, alCambiarCantidad, alQuitar) {
  render(
    <MemoryRouter>
      <table>
        <tbody>
          <FilaCarrito
            producto={taladro}
            cantidad={cantidad}
            alCambiarCantidad={alCambiarCantidad}
            alQuitar={alQuitar}
          />
        </tbody>
      </table>
    </MemoryRouter>
  );
}

describe("FilaCarrito", () => {
  it("muestra el subtotal de precio por cantidad", () => {
    renderizarFila(2, vi.fn(), vi.fn());
    expect(screen.getByText("$2.000")).toBeInTheDocument();
  });

  it("los botones + y − piden una unidad más o una menos", async () => {
    const funcionFalsa = vi.fn();
    renderizarFila(2, funcionFalsa, vi.fn());

    await userEvent.click(screen.getByRole("button", { name: "Sumar una unidad de Taladro" }));
    await userEvent.click(screen.getByRole("button", { name: "Restar una unidad de Taladro" }));

    expect(funcionFalsa).toHaveBeenNthCalledWith(1, taladro, 3);
    expect(funcionFalsa).toHaveBeenNthCalledWith(2, taladro, 1);
  });

  it("deshabilita el + al llegar al stock", () => {
    renderizarFila(3, vi.fn(), vi.fn());
    expect(screen.getByRole("button", { name: "Sumar una unidad de Taladro" })).toBeDisabled();
  });

  it("el botón Quitar entrega el código del producto", async () => {
    const funcionFalsa = vi.fn();
    renderizarFila(1, vi.fn(), funcionFalsa);

    await userEvent.click(screen.getByRole("button", { name: "Quitar Taladro del carrito" }));

    expect(funcionFalsa).toHaveBeenCalledWith("AA001");
  });

  it("si la foto no carga, muestra el logo", () => {
    const { container } = render(
      <MemoryRouter>
        <table>
          <tbody>
            <FilaCarrito producto={taladro} cantidad={1} alCambiarCantidad={vi.fn()} alQuitar={vi.fn()} />
          </tbody>
        </table>
      </MemoryRouter>
    );
    // La imagen tiene alt="" (decorativa), por eso no se busca por rol.
    const imagen = container.querySelector("img");

    fireEvent.error(imagen);

    expect(imagen.src).toContain("/img/logo.jpg");
  });

});
