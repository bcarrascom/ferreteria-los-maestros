import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { respuestaDePrueba } from "../test/tokens";
import AdminUsuarios from "./AdminUsuarios";

afterEach(() => {
  vi.restoreAllMocks();
});

const usuariosIniciales = [
  { id: 1, rut: "11111111-1", nombre: "Alex", apellidos: "Muñoz Herrera", correo: "admin@ferreteria.cl", rol: "ADMINISTRADOR", activo: true },
  { id: 2, rut: "22222222-2", nombre: "Valentina", apellidos: "Soto Pizarro", correo: "vendedor@ferreteria.cl", rol: "VENDEDOR", activo: true },
  { id: 3, rut: "33333333-3", nombre: "Camila", apellidos: "Rojas Díaz", correo: "cliente@ferreteria.cl", rol: "CLIENTE", activo: true },
];

// Imita /api/v1/usuarios de ms-usuarios con una lista en memoria. Devuelve las peticiones recibidas.
function backendFalso() {
  let usuarios = usuariosIniciales.map((u) => ({ ...u }));
  let siguienteId = 10;
  const peticiones = [];

  vi.spyOn(globalThis, "fetch").mockImplementation(async (ruta, { method, body }) => {
    const cuerpo = body ? JSON.parse(body) : null;
    const id = Number(ruta.split("/").pop());
    peticiones.push({ metodo: method, ruta, cuerpo });

    if (method === "GET") {
      return respuestaDePrueba(200, usuarios);
    }
    if (method === "POST") {
      if (usuarios.some((u) => u.correo === cuerpo.correo)) {
        return respuestaDePrueba(409, { mensaje: "Ya existe una cuenta con ese correo" });
      }
      const nuevo = { ...cuerpo, id: siguienteId++ };
      delete nuevo.password;
      usuarios.push(nuevo);
      return respuestaDePrueba(201, nuevo);
    }
    if (method === "PUT") {
      usuarios = usuarios.map((u) => (u.id === id ? { ...u, rol: cuerpo.rol } : u));
      return respuestaDePrueba(200, usuarios.find((u) => u.id === id));
    }
    usuarios = usuarios.filter((u) => u.id !== id);    // DELETE
    return respuestaDePrueba(204);
  });

  return peticiones;
}

function renderizarAdmin() {
  // La sesión es la del administrador (id 1)
  render(<AdminUsuarios usuarioActual={{ id: 1, nombre: "Alex Muñoz Herrera", rol: "ADMINISTRADOR" }} />);
}

describe("AdminUsuarios", () => {
  it("muestra los usuarios que entrega el backend", async () => {
    backendFalso();
    renderizarAdmin();

    expect(screen.getByText("Cargando usuarios…")).toBeInTheDocument();
    expect(await screen.findByRole("row", { name: /Valentina Soto Pizarro/ })).toBeInTheDocument();
    expect(screen.getAllByRole("row")).toHaveLength(4);     // encabezado + 3 usuarios
  });

  it("si el backend rechaza la petición, muestra su mensaje", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(respuestaDePrueba(403, { mensaje: "No tienes permiso para esta acción" }));
    renderizarAdmin();

    expect(await screen.findByRole("alert")).toHaveTextContent("No tienes permiso para esta acción");
  });

  it("crea un usuario con el rol elegido, limpia el formulario y recarga la lista", async () => {
    const peticiones = backendFalso();
    renderizarAdmin();
    await screen.findByRole("row", { name: /Camila/ });

    await userEvent.type(screen.getByLabelText("RUT"), "12345678-5");
    await userEvent.type(screen.getByLabelText("Nombre"), "Pedro");
    await userEvent.type(screen.getByLabelText("Apellidos"), "Pérez");
    await userEvent.type(screen.getByLabelText("Correo"), "pedro@ferreteria.cl");
    await userEvent.type(screen.getByLabelText("Contraseña"), "Clave2026x");
    await userEvent.selectOptions(screen.getByLabelText("Rol"), "VENDEDOR");
    await userEvent.click(screen.getByRole("button", { name: "Crear" }));

    expect(await screen.findByRole("row", { name: /Pedro Pérez/ })).toBeInTheDocument();
    const post = peticiones.find((p) => p.metodo === "POST");
    expect(post.cuerpo).toEqual(expect.objectContaining({ rut: "12345678-5", correo: "pedro@ferreteria.cl", rol: "VENDEDOR", activo: true }));
    expect(screen.getByLabelText("Nombre")).toHaveValue("");
    expect(screen.getByText("Se creó la cuenta de Pedro.")).toBeInTheDocument();
  });

  it("un correo repetido muestra el error del backend y conserva lo escrito", async () => {
    backendFalso();
    renderizarAdmin();
    await screen.findByRole("row", { name: /Camila/ });

    await userEvent.type(screen.getByLabelText("Nombre"), "Otra");
    await userEvent.type(screen.getByLabelText("Correo"), "vendedor@ferreteria.cl");
    await userEvent.click(screen.getByRole("button", { name: "Crear" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Ya existe una cuenta con ese correo");
    expect(screen.getByLabelText("Nombre")).toHaveValue("Otra");
  });

  it("los errores de validación aparecen bajo cada campo", async () => {
    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(respuestaDePrueba(200, usuariosIniciales))
      .mockResolvedValueOnce(respuestaDePrueba(400, { mensaje: "Hay datos inválidos en la solicitud", detalles: { rut: "RUT inválido" } }));
    renderizarAdmin();
    await screen.findByRole("row", { name: /Camila/ });

    await userEvent.click(screen.getByRole("button", { name: "Crear" }));

    expect(await screen.findByText("RUT inválido")).toBeInTheDocument();
    expect(screen.getByLabelText("RUT")).toHaveClass("is-invalid");
  });

  it("cambiar el rol manda el usuario completo con la contraseña vacía", async () => {
    const peticiones = backendFalso();
    renderizarAdmin();

    await userEvent.selectOptions(await screen.findByLabelText("Rol de Camila"), "VENDEDOR");

    expect(await screen.findByText("Camila ahora es VENDEDOR.")).toBeInTheDocument();
    const put = peticiones.find((p) => p.metodo === "PUT");
    expect(put.ruta).toBe("/api/v1/usuarios/3");
    expect(put.cuerpo).toEqual(expect.objectContaining({ rut: "33333333-3", nombre: "Camila", rol: "VENDEDOR", password: "" }));
    expect(screen.getByLabelText("Rol de Camila")).toHaveValue("VENDEDOR");
  });

  it("eliminar pide confirmación y quita la fila", async () => {
    const peticiones = backendFalso();
    vi.spyOn(window, "confirm").mockReturnValue(true);
    renderizarAdmin();

    const fila = await screen.findByRole("row", { name: /Valentina/ });
    await userEvent.click(within(fila).getByRole("button", { name: "Eliminar" }));

    expect(await screen.findByText("Se eliminó la cuenta de Valentina.")).toBeInTheDocument();
    expect(screen.queryByRole("row", { name: /Valentina/ })).not.toBeInTheDocument();
    expect(peticiones.find((p) => p.metodo === "DELETE").ruta).toBe("/api/v1/usuarios/2");
  });

  it("si no se confirma, no elimina", async () => {
    const peticiones = backendFalso();
    vi.spyOn(window, "confirm").mockReturnValue(false);
    renderizarAdmin();

    const fila = await screen.findByRole("row", { name: /Valentina/ });
    await userEvent.click(within(fila).getByRole("button", { name: "Eliminar" }));

    expect(peticiones.some((p) => p.metodo === "DELETE")).toBe(false);
  });

  it("no deja cambiar ni eliminar la propia cuenta", async () => {
    backendFalso();
    renderizarAdmin();

    const fila = await screen.findByRole("row", { name: /Alex Muñoz Herrera/ });
    expect(within(fila).getByRole("combobox")).toBeDisabled();
    expect(within(fila).getByRole("button", { name: "Eliminar" })).toBeDisabled();
  });
});
