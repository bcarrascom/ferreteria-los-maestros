// src/utils/rut.spec.jsx
import { esRutValido, normalizarRut } from "./rut";

describe("RUT", () => {
  it("acepta un RUT válido con y sin puntos", () => {
    expect(esRutValido("12345678-5")).toBe(true);
    expect(esRutValido("12.345.678-5")).toBe(true);
  });

  it("rechaza un dígito verificador incorrecto", () => {
    expect(esRutValido("12345678-9")).toBe(false);
  });

  it("acepta la K en minúscula", () => {
    expect(normalizarRut("10.000.013-k")).toBe("10000013-K");
    expect(esRutValido("10000013-k")).toBe(true);
  });

  it("los RUT de los usuarios de demo son válidos", () => {
    expect(esRutValido("11111111-1")).toBe(true);
    expect(esRutValido("22222222-2")).toBe(true);
    expect(esRutValido("33333333-3")).toBe(true);
  });

  it("rechaza vacío y formatos incorrectos", () => {
    expect(esRutValido("")).toBe(false);
    expect(esRutValido("12345678")).toBe(false);
    expect(esRutValido("abc-5")).toBe(false);
  });
});
