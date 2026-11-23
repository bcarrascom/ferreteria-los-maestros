// src/api/cliente.spec.jsx
import { respuestaDePrueba } from "../test/tokens";
import { guardarTokens, leerTokens } from "../utils/sesion";
import { ErrorApi, pedir } from "./cliente";

// fetch se simula en cada prueba: no hay backend corriendo
afterEach(() => {
  vi.restoreAllMocks();
});

function simularFetch(responder) {
  return vi.spyOn(globalThis, "fetch").mockImplementation(async (ruta, opciones) => responder(ruta, opciones));
}

describe("pedir", () => {
  it("con sesión agrega el token y manda el cuerpo como JSON", async () => {
    guardarTokens({ accessToken: "access-1", refreshToken: "refresh-1" });
    const fetchFalso = simularFetch(() => respuestaDePrueba(200, { ok: true }));

    const datos = await pedir("/api/v1/usuarios", { metodo: "POST", cuerpo: { nombre: "Ana" } });

    const [ruta, opciones] = fetchFalso.mock.calls[0];
    expect(datos).toEqual({ ok: true });
    expect(ruta).toBe("/api/v1/usuarios");
    expect(opciones.method).toBe("POST");
    expect(opciones.headers.Authorization).toBe("Bearer access-1");
    expect(opciones.headers["Content-Type"]).toBe("application/json");
    expect(opciones.body).toBe('{"nombre":"Ana"}');
  });

  it("con autenticado: false no manda el token", async () => {
    guardarTokens({ accessToken: "access-1", refreshToken: "refresh-1" });
    const fetchFalso = simularFetch(() => respuestaDePrueba(200, {}));

    await pedir("/api/v1/auth/login", { metodo: "POST", cuerpo: {}, autenticado: false });

    expect(fetchFalso.mock.calls[0][1].headers.Authorization).toBeUndefined();
  });

  it("un 204 devuelve null", async () => {
    simularFetch(() => respuestaDePrueba(204));
    expect(await pedir("/api/v1/usuarios/5", { metodo: "DELETE" })).toBeNull();
  });

  it("un error del backend se lanza como ErrorApi con su mensaje y detalles", async () => {
    simularFetch(() =>
      respuestaDePrueba(400, { mensaje: "Hay datos inválidos en la solicitud", detalles: { rut: "RUT inválido" } })
    );

    const error = await pedir("/api/v1/auth/registro", { metodo: "POST", cuerpo: {}, autenticado: false }).catch((e) => e);

    expect(error).toBeInstanceOf(ErrorApi);
    expect(error.status).toBe(400);
    expect(error.mensaje).toBe("Hay datos inválidos en la solicitud");
    expect(error.detalles).toEqual({ rut: "RUT inválido" });
  });

  it("un 401 sin sesión (contraseña mala) no intenta renovar", async () => {
    const fetchFalso = simularFetch(() => respuestaDePrueba(401, { mensaje: "Correo o contraseña incorrectos" }));

    const error = await pedir("/api/v1/auth/login", { metodo: "POST", cuerpo: {}, autenticado: false }).catch((e) => e);

    expect(error.mensaje).toBe("Correo o contraseña incorrectos");
    expect(fetchFalso).toHaveBeenCalledTimes(1);
  });
});

describe("renovación del token", () => {
  it("con un 401 renueva una vez, guarda el par nuevo y reintenta", async () => {
    guardarTokens({ accessToken: "access-viejo", refreshToken: "refresh-viejo" });
    const fetchFalso = simularFetch((ruta, opciones) => {
      if (ruta === "/api/v1/auth/refresh") {
        return respuestaDePrueba(200, { accessToken: "access-nuevo", refreshToken: "refresh-nuevo" });
      }
      return opciones.headers.Authorization === "Bearer access-nuevo"
        ? respuestaDePrueba(200, { correo: "cliente@ferreteria.cl" })
        : respuestaDePrueba(401, { mensaje: "Token inválido o expirado" });
    });

    const datos = await pedir("/api/v1/usuarios/me");

    expect(datos).toEqual({ correo: "cliente@ferreteria.cl" });
    expect(leerTokens()).toEqual({ accessToken: "access-nuevo", refreshToken: "refresh-nuevo" });

    // La renovación se pide sin header Authorization y con el refresh token en el cuerpo
    const llamadaRefresh = fetchFalso.mock.calls.find(([ruta]) => ruta === "/api/v1/auth/refresh");
    expect(llamadaRefresh[1].headers.Authorization).toBeUndefined();
    expect(JSON.parse(llamadaRefresh[1].body)).toEqual({ refreshToken: "refresh-viejo" });
  });

  it("varias peticiones con 401 al mismo tiempo esperan una sola renovación", async () => {
    guardarTokens({ accessToken: "access-viejo", refreshToken: "refresh-viejo" });
    const fetchFalso = simularFetch((ruta, opciones) => {
      if (ruta === "/api/v1/auth/refresh") {
        return respuestaDePrueba(200, { accessToken: "access-nuevo", refreshToken: "refresh-nuevo" });
      }
      return opciones.headers.Authorization === "Bearer access-nuevo"
        ? respuestaDePrueba(200, {})
        : respuestaDePrueba(401, {});
    });

    await Promise.all([pedir("/api/v1/usuarios/me"), pedir("/api/v1/usuarios"), pedir("/api/v1/usuarios/2")]);

    const renovaciones = fetchFalso.mock.calls.filter(([ruta]) => ruta === "/api/v1/auth/refresh");
    expect(renovaciones).toHaveLength(1);
  });

  it("si la renovación falla, cierra la sesión y avisa a la app", async () => {
    guardarTokens({ accessToken: "access-viejo", refreshToken: "refresh-vencido" });
    simularFetch(() => respuestaDePrueba(401, {}));
    const alExpirar = vi.fn();
    window.addEventListener("sesion-expirada", alExpirar);

    const error = await pedir("/api/v1/usuarios/me").catch((e) => e);

    expect(error.status).toBe(401);
    expect(error.mensaje).toBe("Tu sesión expiró. Inicia sesión nuevamente.");
    expect(leerTokens()).toBeNull();
    expect(alExpirar).toHaveBeenCalledTimes(1);
    window.removeEventListener("sesion-expirada", alExpirar);
  });
});
