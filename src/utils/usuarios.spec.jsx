// src/utils/usuarios.spec.jsx
import { rolesUsuario } from "./usuarios";

describe("roles", () => {
  it("son los mismos del backend", () => {
    expect(rolesUsuario).toEqual(["CLIENTE", "VENDEDOR", "ADMINISTRADOR"]);
  });
});
