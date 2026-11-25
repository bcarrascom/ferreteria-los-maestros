import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductosVendedor from "./ProductosVendedor";

const productosDePrueba = [
  { codigo: "MC001", nombre_producto: "Cemento Polpaico gris 25 kg", categoria: "Mat. Construcción", precio_venta_clp: 5990, stock: 80, stock_minimo: 20, stock_bajo: false },
  { codigo: "HE004", nombre_producto: "Taladro percutor", categoria: "Herramientas", precio_venta_clp: 45990, stock: 4, stock_minimo: 5, stock_bajo: true },
  { codigo: "EL004", nombre_producto: "Cable eléctrico 2,5 mm", categoria: "Electricidad", precio_venta_clp: 1290, stock: 50, stock_minimo: 10, stock_bajo: false },
];

function renderizar(productos = productosDePrueba) {
  render(<ProductosVendedor productos={productos} />);
}

describe("ProductosVendedor", () => {
  it("lista todos los productos sin botones para editar ni eliminar", () => {
    renderizar();

    // 1 fila de encabezado + 3 productos
    expect(screen.getAllByRole("row")).toHaveLength(4);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("avisa cuántos productos tienen stock bajo y los marca en la tabla", () => {
    renderizar();

    expect(screen.getByText(/1 producto tiene stock bajo/)).toBeInTheDocument();
    expect(screen.getByText("Stock bajo")).toBeInTheDocument();
    expect(screen.getAllByText("Disponible")).toHaveLength(2);
  });

  it("con varios productos con stock bajo la alerta va en plural", () => {
    renderizar([...productosDePrueba, { ...productosDePrueba[0], codigo: "MC002", stock: 1, stock_bajo: true }]);

    expect(screen.getByText(/2 productos tienen stock bajo/)).toBeInTheDocument();
  });

  it("sin productos con stock bajo no muestra la alerta", () => {
    renderizar([productosDePrueba[0]]);

    expect(screen.queryByText(/stock bajo \(igual/)).not.toBeInTheDocument();
  });

  it("busca por nombre o por código sin importar mayúsculas", async () => {
    renderizar();
    const buscador = screen.getByLabelText("Buscar por nombre o código");

    await userEvent.type(buscador, "CEMENTO");
    expect(screen.getAllByRole("row")).toHaveLength(2);

    await userEvent.clear(buscador);
    await userEvent.type(buscador, "el004");
    expect(screen.getByText("Cable eléctrico 2,5 mm")).toBeInTheDocument();
    expect(screen.getAllByRole("row")).toHaveLength(2);
  });

  it("el interruptor deja solo los productos con stock bajo", async () => {
    renderizar();

    await userEvent.click(screen.getByLabelText("Mostrar solo stock bajo"));

    expect(screen.getAllByRole("row")).toHaveLength(2);
    expect(screen.getByText("Taladro percutor")).toBeInTheDocument();
  });

  it("si nada coincide lo dice", async () => {
    renderizar();

    await userEvent.type(screen.getByLabelText("Buscar por nombre o código"), "zzz");

    expect(screen.getByText("No hay productos que coincidan con la búsqueda.")).toBeInTheDocument();
  });
});
