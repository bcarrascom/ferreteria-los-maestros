import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ErrorApi } from "../api/cliente";
import { listarCategorias } from "../api/categorias";
import { actualizarProducto, crearProducto, eliminarProducto } from "../api/productos";
import GestionProductos from "./GestionProductos";

// Mock de módulo: la vista no habla con el backend en las pruebas; se revisa qué le pide a la API
vi.mock("../api/categorias", () => ({ listarCategorias: vi.fn() }));
vi.mock("../api/productos", () => ({
  crearProducto: vi.fn(),
  actualizarProducto: vi.fn(),
  eliminarProducto: vi.fn(),
}));

const productosDePrueba = [
  {
    codigo: "AA001", nombre_producto: "Taladro", categoria: "Herramientas", categoriaId: 2,
    subcategoria: "Eléctricas", marca: "Bosch", unidad: "Unidad",
    precio_venta_clp: 50000, precio_compra_clp: 30000, stock: 5, stock_minimo: 1, stock_bajo: false,
  },
  {
    codigo: "AA002", nombre_producto: "Martillo", categoria: "Herramientas", categoriaId: 2,
    subcategoria: "Manuales", marca: "Stanley", unidad: "Unidad",
    precio_venta_clp: 8000, precio_compra_clp: 4000, stock: 2, stock_minimo: 3, stock_bajo: true,
  },
];

const categoriasDePrueba = [
  { id: 1, nombre: "Mat. Construcción", cantidadProductos: 10 },
  { id: 2, nombre: "Herramientas", cantidadProductos: 16 },
];

beforeEach(() => {
  vi.clearAllMocks();
  listarCategorias.mockResolvedValue(categoriasDePrueba);
});

function renderizarGestion(alCambiarCatalogo = vi.fn().mockResolvedValue()) {
  render(<GestionProductos productos={productosDePrueba} alCambiarCatalogo={alCambiarCatalogo} />);
  return alCambiarCatalogo;
}

function fila(nombre) {
  return within(screen.getByRole("cell", { name: nombre }).closest("tr"));
}

async function llenarFormulario() {
  await userEvent.type(screen.getByLabelText("Código"), "jd001");
  await userEvent.type(screen.getByLabelText("Nombre"), "Manguera");
  await userEvent.selectOptions(await screen.findByLabelText("Categoría"), "Mat. Construcción");
  await userEvent.type(screen.getByLabelText("Precio de venta"), "12990");
  await userEvent.type(screen.getByLabelText("Precio de compra"), "7000");
  await userEvent.type(screen.getByLabelText("Stock"), "8");
}

describe("GestionProductos", () => {
  it("muestra una fila por producto, con precio de compra y alerta de stock bajo", () => {
    renderizarGestion();

    // 1 fila de encabezado + 2 productos
    expect(screen.getAllByRole("row")).toHaveLength(3);
    expect(fila("Taladro").getByText("$30.000")).toBeInTheDocument();
    expect(fila("Martillo").getByText("Stock bajo")).toBeInTheDocument();
    expect(fila("Taladro").queryByText("Stock bajo")).not.toBeInTheDocument();
  });

  it("carga las categorías de la API en el selector", async () => {
    renderizarGestion();

    expect(await screen.findByRole("option", { name: "Herramientas" })).toHaveValue("2");
  });

  it("crea el producto en la API, recarga el catálogo y limpia el formulario", async () => {
    crearProducto.mockResolvedValue({});
    const alCambiarCatalogo = renderizarGestion();

    await llenarFormulario();
    await userEvent.click(screen.getByRole("button", { name: "Agregar producto" }));

    expect(crearProducto).toHaveBeenCalledWith(
      expect.objectContaining({ codigo: "jd001", nombre_producto: "Manguera", categoriaId: "1", precio_venta_clp: "12990" })
    );
    expect(alCambiarCatalogo).toHaveBeenCalled();
    expect(screen.getByRole("status")).toHaveTextContent("Producto agregado al catálogo.");
    expect(screen.getByLabelText("Código")).toHaveValue("");
  });

  it("un 400 muestra el mensaje y el error de cada campo debajo del campo", async () => {
    crearProducto.mockRejectedValue(
      new ErrorApi(400, "Hay datos inválidos", { precioVenta: "El precio de venta es obligatorio" })
    );
    const alCambiarCatalogo = renderizarGestion();

    await userEvent.click(screen.getByRole("button", { name: "Agregar producto" }));

    expect(screen.getByRole("alert")).toHaveTextContent("Hay datos inválidos");
    expect(screen.getByText("El precio de venta es obligatorio")).toBeInTheDocument();
    expect(screen.getByLabelText("Precio de venta")).toHaveClass("is-invalid");
    expect(alCambiarCatalogo).not.toHaveBeenCalled();
  });

  it("un 409 muestra el mensaje del backend y conserva lo escrito", async () => {
    crearProducto.mockRejectedValue(new ErrorApi(409, "Ya existe un producto con código JD001"));
    renderizarGestion();

    await llenarFormulario();
    await userEvent.click(screen.getByRole("button", { name: "Agregar producto" }));

    expect(screen.getByRole("alert")).toHaveTextContent("Ya existe un producto con código JD001");
    expect(screen.getByLabelText("Nombre")).toHaveValue("Manguera");
  });

  it("editar carga el producto con el código bloqueado y guarda con PUT a ese código", async () => {
    actualizarProducto.mockResolvedValue({});
    renderizarGestion();

    await userEvent.click(fila("Taladro").getByRole("button", { name: "Editar" }));
    expect(screen.getByLabelText("Código")).toHaveValue("AA001");
    expect(screen.getByLabelText("Código")).toBeDisabled();
    expect(screen.getByLabelText("Precio de compra")).toHaveValue(30000);

    await userEvent.clear(screen.getByLabelText("Stock"));
    await userEvent.type(screen.getByLabelText("Stock"), "9");
    await userEvent.click(screen.getByRole("button", { name: "Guardar cambios" }));

    expect(actualizarProducto).toHaveBeenCalledWith("AA001", expect.objectContaining({ stock: "9" }));
    expect(screen.getByRole("status")).toHaveTextContent("Producto actualizado.");
  });

  it("eliminar pide confirmación y, si se acepta, llama a la API y recarga", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    eliminarProducto.mockResolvedValue(null);
    const alCambiarCatalogo = renderizarGestion();

    await userEvent.click(fila("Martillo").getByRole("button", { name: "Eliminar" }));

    expect(window.confirm).toHaveBeenCalledWith("¿Eliminar Martillo?");
    expect(eliminarProducto).toHaveBeenCalledWith("AA002");
    expect(alCambiarCatalogo).toHaveBeenCalled();
  });

  it("eliminar el producto que se está editando también limpia el formulario", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    eliminarProducto.mockResolvedValue(null);
    renderizarGestion();

    await userEvent.click(fila("Taladro").getByRole("button", { name: "Editar" }));
    await userEvent.click(fila("Taladro").getByRole("button", { name: "Eliminar" }));

    expect(screen.getByLabelText("Código")).toHaveValue("");
    expect(screen.getByRole("button", { name: "Agregar producto" })).toBeInTheDocument();
  });

  it("si no se confirma, no elimina nada", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(false);
    renderizarGestion();

    await userEvent.click(fila("Martillo").getByRole("button", { name: "Eliminar" }));

    expect(eliminarProducto).not.toHaveBeenCalled();
  });

  it("avisa si no se pudieron cargar las categorías", async () => {
    listarCategorias.mockRejectedValue(new ErrorApi(500, "Error"));
    renderizarGestion();

    expect(await screen.findByRole("alert")).toHaveTextContent("No se pudieron cargar las categorías.");
  });
});
