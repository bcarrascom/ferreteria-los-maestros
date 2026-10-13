import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import TarjetaProducto from "./TarjetaProducto";

const taladro = { codigo: "AA001", nombre_producto: "Taladro", marca: "Marca", precio_venta_clp: 1000, stock: 5 };
const sinStock = { codigo: "AA002", nombre_producto: "Lijadora", marca: "Marca", precio_venta_clp: 2000, stock: 0 };

function renderizarTarjeta(producto, alAgregar) {
  render(
    <MemoryRouter>
      <TarjetaProducto producto={producto} alAgregar={alAgregar} />
    </MemoryRouter>
  );
}

describe("TarjetaProducto", () => {
  it("al hacer clic en Agregar entrega su producto", async () => {
    const funcionFalsa = vi.fn();
    renderizarTarjeta(taladro, funcionFalsa);

    await userEvent.click(screen.getByRole("button", { name: "Agregar Taladro al carrito" }));

    expect(funcionFalsa).toHaveBeenCalledWith(taladro);
  });

  it("deshabilita el botón si no hay stock", () => {
    renderizarTarjeta(sinStock, vi.fn());
    expect(screen.getByRole("button", { name: "Agregar Lijadora al carrito" })).toBeDisabled();
  });
});
