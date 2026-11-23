// src/utils/sesion.spec.jsx
import { accessDePrueba, refreshDePrueba } from "../test/tokens";
import {
  borrarTokens,
  estaVigente,
  guardarTokens,
  leerPayload,
  leerTokens,
  usuarioDeSesion,
} from "./sesion";

describe("tokens guardados", () => {
  it("sin nada guardado no hay sesión", () => {
    expect(leerTokens()).toBeNull();
  });

  it("guarda solo los dos tokens de la respuesta del backend", () => {
    guardarTokens({ accessToken: "a", refreshToken: "r", tipo: "Bearer", expiraEn: 900, usuario: { id: 3 } });

    expect(leerTokens()).toEqual({ accessToken: "a", refreshToken: "r" });
    expect(JSON.parse(localStorage.getItem("sesion-ferreteria"))).toEqual({ accessToken: "a", refreshToken: "r" });
  });

  it("la sesión simulada de la versión anterior cuenta como sin sesión", () => {
    localStorage.setItem("sesion-ferreteria", JSON.stringify({ id: "cuenta-admin", rol: "administrador" }));
    expect(leerTokens()).toBeNull();
  });

  it("si lo guardado está dañado, no hay sesión", () => {
    localStorage.setItem("sesion-ferreteria", "{no es json");
    expect(leerTokens()).toBeNull();
  });

  it("borrarTokens cierra la sesión", () => {
    guardarTokens({ accessToken: "a", refreshToken: "r" });
    borrarTokens();
    expect(leerTokens()).toBeNull();
  });
});

describe("leer el token", () => {
  it("decodifica el payload con tildes y eñes", () => {
    const token = accessDePrueba({ nombre: "Alex Muñoz Herrera" });
    expect(leerPayload(token).nombre).toBe("Alex Muñoz Herrera");
  });

  it("un token vigente y uno vencido", () => {
    expect(estaVigente(accessDePrueba({ minutos: 15 }))).toBe(true);
    expect(estaVigente(accessDePrueba({ minutos: -1 }))).toBe(false);
  });

  it("un texto que no es JWT no está vigente", () => {
    expect(estaVigente("no-es-un-token")).toBe(false);
  });

  it("el usuario visible sale del access token", () => {
    const tokens = { accessToken: accessDePrueba({ id: 1, rol: "ADMINISTRADOR", nombre: "Alex Muñoz Herrera" }), refreshToken: refreshDePrueba() };

    expect(usuarioDeSesion(tokens)).toEqual({
      id: 1,
      nombre: "Alex Muñoz Herrera",
      correo: "cliente@ferreteria.cl",
      rol: "ADMINISTRADOR",
    });
  });

  it("sin tokens no hay usuario", () => {
    expect(usuarioDeSesion(null)).toBeNull();
  });
});
