// src/api/categorias.spec.jsx
import { respuestaDePrueba } from "../test/tokens";
import {
  actualizarCategoria,
  crearCategoria,
  eliminarCategoria,
  listarCategorias,
  obtenerCategoria,
} from "./categorias";

afterEach(() => {
  vi.restoreAllMocks();
});

const herramientas = { id: 2, nombre: "Herramientas", descripcion: null, cantidadProductos: 16 };

describe("llamadas a /api/v1/categorias", () => {
  it("listarCategorias devuelve la lista tal como viene", async () => {
    const fetchFalso = vi.spyOn(globalThis, "fetch").mockResolvedValue(respuestaDePrueba(200, [herramientas]));

    expect(await listarCategorias()).toEqual([herramientas]);
    expect(fetchFalso.mock.calls[0][0]).toBe("/api/v1/categorias");
  });

  it("obtenerCategoria pide el detalle por id", async () => {
    const fetchFalso = vi.spyOn(globalThis, "fetch").mockResolvedValue(respuestaDePrueba(200, herramientas));

    await obtenerCategoria(2);

    expect(fetchFalso.mock.calls[0][0]).toBe("/api/v1/categorias/2");
  });

  it("crearCategoria y actualizarCategoria mandan nombre y descripción", async () => {
    const fetchFalso = vi.spyOn(globalThis, "fetch").mockResolvedValue(respuestaDePrueba(200, herramientas));
    const datos = { nombre: "Herramientas", descripcion: "Manuales y eléctricas" };

    await crearCategoria(datos);
    await actualizarCategoria(2, datos);

    expect(fetchFalso.mock.calls[0][1].method).toBe("POST");
    expect(fetchFalso.mock.calls[1][0]).toBe("/api/v1/categorias/2");
    expect(fetchFalso.mock.calls[1][1].method).toBe("PUT");
    expect(JSON.parse(fetchFalso.mock.calls[1][1].body)).toEqual(datos);
  });

  it("eliminar una categoría con productos llega como ErrorApi 409", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      respuestaDePrueba(409, { mensaje: "La categoría tiene 16 productos" })
    );

    await expect(eliminarCategoria(2)).rejects.toMatchObject({ status: 409 });
  });
});
