// src/api/auth.spec.jsx
import { respuestaDePrueba } from "../test/tokens";
import { leerTokens } from "../utils/sesion";
import { iniciarSesion, registrarCliente } from "./auth";

afterEach(() => {
  vi.restoreAllMocks();
});

const respuestaLogin = { accessToken: "access-1", refreshToken: "refresh-1", tipo: "Bearer", expiraEn: 900 };

describe("auth", () => {
  it("iniciarSesion manda correo y contraseña y guarda los tokens", async () => {
    const fetchFalso = vi.spyOn(globalThis, "fetch").mockResolvedValue(respuestaDePrueba(200, respuestaLogin));

    await iniciarSesion("admin@ferreteria.cl", "Maestros2026");

    const [ruta, opciones] = fetchFalso.mock.calls[0];
    expect(ruta).toBe("/api/v1/auth/login");
    expect(JSON.parse(opciones.body)).toEqual({ correo: "admin@ferreteria.cl", password: "Maestros2026" });
    expect(leerTokens()).toEqual({ accessToken: "access-1", refreshToken: "refresh-1" });
  });

  it("si el login falla no guarda nada", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(respuestaDePrueba(401, { mensaje: "Correo o contraseña incorrectos" }));

    await expect(iniciarSesion("admin@ferreteria.cl", "mala")).rejects.toMatchObject({ status: 401 });
    expect(leerTokens()).toBeNull();
  });

  it("registrarCliente llama a /auth/registro y guarda los tokens", async () => {
    const fetchFalso = vi.spyOn(globalThis, "fetch").mockResolvedValue(respuestaDePrueba(201, respuestaLogin));

    await registrarCliente({ rut: "12345678-5", nombre: "Ana", apellidos: "Pérez", correo: "ana@correo.cl", password: "Clave2026x" });

    expect(fetchFalso.mock.calls[0][0]).toBe("/api/v1/auth/registro");
    expect(leerTokens()).toEqual({ accessToken: "access-1", refreshToken: "refresh-1" });
  });
});
