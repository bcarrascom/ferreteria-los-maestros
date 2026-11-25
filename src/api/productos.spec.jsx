// src/api/productos.spec.jsx
import { accessDePrueba, refreshDePrueba, respuestaDePrueba } from "../test/tokens";
import { guardarTokens } from "../utils/sesion";
import {
  actualizarProducto,
  crearProducto,
  desdeApi,
  eliminarProducto,
  haciaApi,
  listarProductos,
  obtenerProducto,
} from "./productos";

afterEach(() => {
  vi.restoreAllMocks();
});

// Así responde ms-catalogo a un ADMINISTRADOR (a los demás no les manda precioCompra)
const cementoApi = {
  codigo: "MC001", nombre: "Cemento Polpaico gris 25 kg", categoria: "Mat. Construcción",
  categoriaId: 1, subcategoria: "Cementos", marca: "Polpaico", unidad: "Saco",
  precioVenta: 5990, precioCompra: 3200, stock: 80, stockMinimo: 20, stockBajo: false,
};

// Lo que escribe el administrador en el formulario: los inputs siempre entregan texto
const formulario = {
  codigo: "MC001", nombre_producto: "Cemento Polpaico gris 25 kg", categoriaId: "1",
  subcategoria: "Cementos", marca: "Polpaico", unidad: "Saco",
  precio_venta_clp: "5990", precio_compra_clp: "3200", stock: "80", stock_minimo: "20",
};

describe("desdeApi", () => {
  it("traduce la respuesta de la API a los nombres que usan los componentes", () => {
    expect(desdeApi(cementoApi)).toEqual({
      codigo: "MC001", categoria: "Mat. Construcción", categoriaId: 1, subcategoria: "Cementos",
      nombre_producto: "Cemento Polpaico gris 25 kg", marca: "Polpaico", unidad: "Saco",
      precio_venta_clp: 5990, precio_compra_clp: 3200, stock: 80, stock_minimo: 20, stock_bajo: false,
    });
  });

  it("sin precioCompra (quien consulta no es admin) deja precio_compra_clp en null", () => {
    const sinPrecioCompra = { ...cementoApi };
    delete sinPrecioCompra.precioCompra;

    expect(desdeApi(sinPrecioCompra).precio_compra_clp).toBeNull();
  });
});

describe("haciaApi", () => {
  it("convierte el formulario al cuerpo del backend, con los números como números", () => {
    expect(haciaApi(formulario)).toEqual({
      codigo: "MC001", nombre: "Cemento Polpaico gris 25 kg", categoriaId: 1, subcategoria: "Cementos",
      marca: "Polpaico", unidad: "Saco", precioVenta: 5990, precioCompra: 3200, stock: 80, stockMinimo: 20,
    });
  });

  it("un número vacío va como null, para que el backend diga que es obligatorio", () => {
    const cuerpo = haciaApi({ ...formulario, precio_venta_clp: "", categoriaId: "" });

    expect(cuerpo.precioVenta).toBeNull();
    expect(cuerpo.categoriaId).toBeNull();
  });
});

describe("llamadas a /api/v1/productos", () => {
  it("listarProductos pide la lista y la devuelve adaptada", async () => {
    const fetchFalso = vi.spyOn(globalThis, "fetch").mockResolvedValue(respuestaDePrueba(200, [cementoApi]));

    const productos = await listarProductos();

    expect(fetchFalso.mock.calls[0][0]).toBe("/api/v1/productos");
    expect(productos).toHaveLength(1);
    expect(productos[0].nombre_producto).toBe("Cemento Polpaico gris 25 kg");
  });

  it("listarProductos arma la consulta con los filtros", async () => {
    const fetchFalso = vi.spyOn(globalThis, "fetch").mockResolvedValue(respuestaDePrueba(200, []));

    await listarProductos({ categoria: 1, q: "cemento gris" });

    expect(fetchFalso.mock.calls[0][0]).toBe("/api/v1/productos?categoria=1&q=cemento+gris");
  });

  it("con sesión manda el token también al leer (así el admin recibe precioCompra)", async () => {
    guardarTokens({ accessToken: accessDePrueba({ rol: "ADMINISTRADOR" }), refreshToken: refreshDePrueba() });
    const fetchFalso = vi.spyOn(globalThis, "fetch").mockResolvedValue(respuestaDePrueba(200, [cementoApi]));

    await listarProductos();

    expect(fetchFalso.mock.calls[0][1].headers.Authorization).toMatch(/^Bearer /);
  });

  it("obtenerProducto pide el detalle por código", async () => {
    const fetchFalso = vi.spyOn(globalThis, "fetch").mockResolvedValue(respuestaDePrueba(200, cementoApi));

    const producto = await obtenerProducto("MC001");

    expect(fetchFalso.mock.calls[0][0]).toBe("/api/v1/productos/MC001");
    expect(producto.precio_venta_clp).toBe(5990);
  });

  it("crearProducto hace POST con el cuerpo traducido", async () => {
    const fetchFalso = vi.spyOn(globalThis, "fetch").mockResolvedValue(respuestaDePrueba(201, cementoApi));

    await crearProducto(formulario);

    const [ruta, opciones] = fetchFalso.mock.calls[0];
    expect(ruta).toBe("/api/v1/productos");
    expect(opciones.method).toBe("POST");
    expect(JSON.parse(opciones.body).precioVenta).toBe(5990);
  });

  it("actualizarProducto hace PUT al código del producto", async () => {
    const fetchFalso = vi.spyOn(globalThis, "fetch").mockResolvedValue(respuestaDePrueba(200, cementoApi));

    await actualizarProducto("MC001", formulario);

    expect(fetchFalso.mock.calls[0][0]).toBe("/api/v1/productos/MC001");
    expect(fetchFalso.mock.calls[0][1].method).toBe("PUT");
  });

  it("eliminarProducto hace DELETE y un 204 devuelve null", async () => {
    const fetchFalso = vi.spyOn(globalThis, "fetch").mockResolvedValue(respuestaDePrueba(204));

    expect(await eliminarProducto("MC001")).toBeNull();
    expect(fetchFalso.mock.calls[0][1].method).toBe("DELETE");
  });

  it("un 409 llega como ErrorApi con el mensaje del backend", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      respuestaDePrueba(409, { mensaje: "Ya existe un producto con código MC001" })
    );

    await expect(crearProducto(formulario)).rejects.toMatchObject({
      status: 409,
      mensaje: "Ya existe un producto con código MC001",
    });
  });
});
