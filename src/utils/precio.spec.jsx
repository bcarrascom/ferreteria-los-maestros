// src/utils/precio.spec.jsx
import { formatearPrecio } from "./precio";

describe("formatearPrecio", () => {
  it("muestra cero como Gratis", () => {
    expect(formatearPrecio(0)).toBe("Gratis");
  });

  it("formatea un valor positivo", () => {
    expect(formatearPrecio(15000)).toContain("15.000");
  });
});
