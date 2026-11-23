import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { accessDePrueba, refreshDePrueba, respuestaDePrueba } from "../test/tokens";
import Registro from "./Registro";

afterEach(() => {
  vi.restoreAllMocks();
});

function renderizarRegistro(alRegistrar) {
  render(
    <MemoryRouter>
      <Registro alRegistrar={alRegistrar} />
    </MemoryRouter>
  );
}

async function llenar({ rut = "12.345.678-5", correo = "maria@correo.cl", password = "Clave2026x", confirmacion = password } = {}) {
  await userEvent.type(screen.getByLabelText("RUT"), rut);
  await userEvent.type(screen.getByLabelText("Correo"), correo);
  await userEvent.type(screen.getByLabelText("Nombre"), "María");
  await userEvent.type(screen.getByLabelText("Apellidos"), "Soto Díaz");
  await userEvent.type(screen.getByLabelText("Contraseña"), password);
  await userEvent.type(screen.getByLabelText("Confirmar contraseña"), confirmacion);
  await userEvent.click(screen.getByRole("button", { name: "Crear cuenta" }));
}

const respuestaRegistro = { accessToken: accessDePrueba({ nombre: "María Soto Díaz" }), refreshToken: refreshDePrueba() };

describe("Registro", () => {
  it("con datos válidos envía la cuenta sin la confirmación y avisa a App", async () => {
    const fetchFalso = vi.spyOn(globalThis, "fetch").mockResolvedValue(respuestaDePrueba(201, respuestaRegistro));
    const alRegistrar = vi.fn();
    renderizarRegistro(alRegistrar);

    await llenar();

    const [ruta, opciones] = fetchFalso.mock.calls[0];
    const cuerpo = JSON.parse(opciones.body);
    expect(ruta).toBe("/api/v1/auth/registro");
    expect(cuerpo).toEqual(expect.objectContaining({ rut: "12.345.678-5", nombre: "María", correo: "maria@correo.cl" }));
    expect(cuerpo).not.toHaveProperty("confirmacion");
    expect(alRegistrar).toHaveBeenCalledTimes(1);
  });

  it("un RUT inválido se marca antes de enviar", async () => {
    const fetchFalso = vi.spyOn(globalThis, "fetch");
    renderizarRegistro(vi.fn());

    await llenar({ rut: "12345678-9" });

    expect(screen.getByText("RUT inválido")).toBeInTheDocument();
    expect(screen.getByLabelText("RUT")).toHaveClass("is-invalid");
    expect(fetchFalso).not.toHaveBeenCalled();
  });

  it("las contraseñas deben coincidir", async () => {
    const fetchFalso = vi.spyOn(globalThis, "fetch");
    renderizarRegistro(vi.fn());

    await llenar({ confirmacion: "Otra2026x" });

    expect(screen.getByText("Las contraseñas no coinciden")).toBeInTheDocument();
    expect(fetchFalso).not.toHaveBeenCalled();
  });

  it("muestra bajo cada campo los errores que devuelve el backend", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      respuestaDePrueba(400, {
        mensaje: "Hay datos inválidos en la solicitud",
        detalles: { password: "La contraseña debe tener entre 8 y 64 caracteres, con letras y números" },
      })
    );
    const alRegistrar = vi.fn();
    renderizarRegistro(alRegistrar);

    await llenar({ password: "corta" });

    expect(screen.getByRole("alert")).toHaveTextContent("Hay datos inválidos en la solicitud");
    expect(screen.getByLabelText("Contraseña")).toHaveClass("is-invalid");
    expect(alRegistrar).not.toHaveBeenCalled();
  });

  it("un correo ya registrado muestra el mensaje del backend", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(respuestaDePrueba(409, { mensaje: "Ya existe una cuenta con ese correo" }));
    renderizarRegistro(vi.fn());

    await llenar({ correo: "cliente@ferreteria.cl" });

    expect(screen.getByRole("alert")).toHaveTextContent("Ya existe una cuenta con ese correo");
  });
});
