import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { accessDePrueba, refreshDePrueba, respuestaDePrueba } from "../test/tokens";
import { leerTokens } from "../utils/sesion";
import Acceso from "./Acceso";

// fetch se simula: no hay backend corriendo en las pruebas
afterEach(() => {
  vi.restoreAllMocks();
});

function renderizarAcceso(alAcceder) {
  render(
    <MemoryRouter>
      <Acceso alAcceder={alAcceder} />
    </MemoryRouter>
  );
}

async function ingresar(correo, password) {
  await userEvent.type(screen.getByLabelText("Correo"), correo);
  await userEvent.type(screen.getByLabelText("Contraseña"), password);
  await userEvent.click(screen.getByRole("button", { name: "Ingresar" }));
}

describe("Acceso", () => {
  it("con credenciales correctas guarda los tokens y avisa a App", async () => {
    const tokens = { accessToken: accessDePrueba({ rol: "ADMINISTRADOR" }), refreshToken: refreshDePrueba() };
    vi.spyOn(globalThis, "fetch").mockResolvedValue(respuestaDePrueba(200, tokens));
    const alAcceder = vi.fn();
    renderizarAcceso(alAcceder);

    await ingresar("admin@ferreteria.cl", "Maestros2026");

    expect(alAcceder).toHaveBeenCalledTimes(1);
    expect(leerTokens()).toEqual(tokens);
  });

  it("muestra el mensaje del backend si la contraseña es incorrecta", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(respuestaDePrueba(401, { mensaje: "Correo o contraseña incorrectos" }));
    const alAcceder = vi.fn();
    renderizarAcceso(alAcceder);

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    await ingresar("admin@ferreteria.cl", "mala");

    expect(screen.getByRole("alert")).toHaveTextContent("Correo o contraseña incorrectos");
    expect(alAcceder).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Ingresar" })).toBeEnabled();
  });

  it("si el servidor no responde muestra un aviso", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new TypeError("Failed to fetch"));
    renderizarAcceso(vi.fn());

    await ingresar("admin@ferreteria.cl", "Maestros2026");

    expect(screen.getByRole("alert")).toHaveTextContent("No se pudo conectar con el servidor");
  });
});
