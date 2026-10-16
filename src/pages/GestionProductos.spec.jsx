import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GestionProductos from "./GestionProductos";

const productosDePrueba = [
  { codigo: "AA001", nombre_producto: "Taladro", categoria: "Herramientas", subcategoria: "Eléctricas", marca: "Bosch", unidad: "Unidad", precio_venta_clp: 50000, stock: 5, stock_minimo: 1 },
  { codigo: "AA002", nombre_producto: "Martillo", categoria: "Herramientas", precio_venta_clp: 8000, stock: 10 },
];

function renderizarGestion(alGuardarProductos) {
  render(<GestionProductos productos={productosDePrueba} alGuardarProductos={alGuardarProductos} />);
}

// Escribe en los campos obligatorios del formulario.
async function llenarObligatorios(codigo, nombre, precio, stock) {
  await userEvent.type(screen.getByLabelText("Código"), codigo);
  await userEvent.type(screen.getByLabelText("Nombre"), nombre);
  await userEvent.type(screen.getByLabelText("Categoría"), "Jardín");
  await userEvent.type(screen.getByLabelText("Precio CLP"), precio);
  await userEvent.type(screen.getByLabelText("Stock"), stock);
}

describe("GestionProductos", () => {
  it("muestra una fila por producto", () => {
    renderizarGestion(vi.fn());
    // 1 fila de encabezado + 2 productos
    expect(screen.getAllByRole("row")).toHaveLength(3);
  });

  it("no guarda si faltan datos obligatorios", async () => {
    const funcionFalsa = vi.fn();
    renderizarGestion(funcionFalsa);

    await userEvent.click(screen.getByRole("button", { name: "Agregar producto" }));

    expect(screen.getByRole("alert")).toHaveTextContent("Completa código, nombre, categoría");
    expect(funcionFalsa).not.toHaveBeenCalled();
  });

  it("no acepta un código que ya existe", async () => {
    const funcionFalsa = vi.fn();
    renderizarGestion(funcionFalsa);

    await llenarObligatorios("aa001", "Otro taladro", "1000", "1");
    await userEvent.click(screen.getByRole("button", { name: "Agregar producto" }));

    expect(screen.getByRole("alert")).toHaveTextContent("Ya existe un producto con ese código.");
    expect(funcionFalsa).not.toHaveBeenCalled();
  });

  it("agrega un producto nuevo al final de la lista", async () => {
    const funcionFalsa = vi.fn();
    renderizarGestion(funcionFalsa);

    await llenarObligatorios("jd001", "Manguera", "12990", "8");
    await userEvent.click(screen.getByRole("button", { name: "Agregar producto" }));

    const listaNueva = funcionFalsa.mock.calls[0][0];
    expect(listaNueva).toHaveLength(3);
    expect(listaNueva[2]).toEqual(
      expect.objectContaining({ codigo: "JD001", nombre_producto: "Manguera", precio_venta_clp: 12990, stock: 8 })
    );
    expect(screen.getByRole("status")).toHaveTextContent("Producto agregado al catálogo.");
  });

  it("Editar llena el formulario y Guardar cambios reemplaza ese producto", async () => {
    const funcionFalsa = vi.fn();
    renderizarGestion(funcionFalsa);

    const fila = screen.getByRole("row", { name: /AA001/ });
    await userEvent.click(within(fila).getByRole("button", { name: "Editar" }));

    expect(screen.getByLabelText("Código")).toBeDisabled();
    expect(screen.getByLabelText("Nombre")).toHaveValue("Taladro");

    await userEvent.clear(screen.getByLabelText("Precio CLP"));
    await userEvent.type(screen.getByLabelText("Precio CLP"), "45000");
    await userEvent.click(screen.getByRole("button", { name: "Guardar cambios" }));

    const listaNueva = funcionFalsa.mock.calls[0][0];
    expect(listaNueva).toHaveLength(2);
    expect(listaNueva[0].precio_venta_clp).toBe(45000);
    expect(screen.getByRole("status")).toHaveTextContent("Producto actualizado.");
  });

  it("Cancelar deja el formulario vacío otra vez", async () => {
    renderizarGestion(vi.fn());

    const fila = screen.getByRole("row", { name: /AA002/ });
    await userEvent.click(within(fila).getByRole("button", { name: "Editar" }));
    await userEvent.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(screen.getByLabelText("Nombre")).toHaveValue("");
    expect(screen.getByRole("button", { name: "Agregar producto" })).toBeInTheDocument();
  });

  it("Quitar saca el producto de la lista", async () => {
    const funcionFalsa = vi.fn();
    renderizarGestion(funcionFalsa);

    const fila = screen.getByRole("row", { name: /AA002/ });
    await userEvent.click(within(fila).getByRole("button", { name: "Editar" }));
    await userEvent.click(within(fila).getByRole("button", { name: "Quitar" }));

    expect(funcionFalsa).toHaveBeenCalledWith([productosDePrueba[0]]);
    expect(screen.getByRole("status")).toHaveTextContent("Producto quitado del catálogo.");
    // Si se quita el que se estaba editando, el formulario se limpia.
    expect(screen.getByLabelText("Nombre")).toHaveValue("");
  });

  it("si se borra la unidad al editar, vuelve a Unidad", async () => {
    const funcionFalsa = vi.fn();
    renderizarGestion(funcionFalsa);

    const fila = screen.getByRole("row", { name: /AA001/ });
    await userEvent.click(within(fila).getByRole("button", { name: "Editar" }));
    await userEvent.clear(screen.getByLabelText("Unidad"));
    await userEvent.click(screen.getByRole("button", { name: "Guardar cambios" }));

    expect(funcionFalsa.mock.calls[0][0][0].unidad).toBe("Unidad");
  });

  it("Quitar sin estar editando deja el formulario como estaba", async () => {
    renderizarGestion(vi.fn());

    await userEvent.type(screen.getByLabelText("Nombre"), "A medio escribir");
    const fila = screen.getByRole("row", { name: /AA002/ });
    await userEvent.click(within(fila).getByRole("button", { name: "Quitar" }));

    expect(screen.getByLabelText("Nombre")).toHaveValue("A medio escribir");
  });
});
