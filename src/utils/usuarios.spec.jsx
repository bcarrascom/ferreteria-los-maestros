// src/utils/usuarios.spec.jsx
// La sesión y el login ahora se prueban en sesion.spec, Acceso.spec y Registro.spec (con la API).
import { guardarUsuarios, leerUsuariosGuardados, rolesUsuario, usuariosDePrueba } from "./usuarios";

describe("leerUsuariosGuardados", () => {
  it("sin nada guardado entrega las cuentas de prueba", () => {
    expect(leerUsuariosGuardados()).toEqual(usuariosDePrueba);
  });

  it("devuelve los usuarios guardados", () => {
    guardarUsuarios([{ id: "u1", nombre: "Ana", correo: "ana@mail.cl", rol: "CLIENTE" }]);
    expect(leerUsuariosGuardados()).toHaveLength(1);
  });

  it("si lo guardado está dañado o no es una lista, vuelve a las de prueba", () => {
    localStorage.setItem("usuarios-ferreteria", "esto no es JSON");
    expect(leerUsuariosGuardados()).toEqual(usuariosDePrueba);

    localStorage.setItem("usuarios-ferreteria", '{"no":"es lista"}');
    expect(leerUsuariosGuardados()).toEqual(usuariosDePrueba);
  });
});

describe("roles", () => {
  it("son los mismos del backend", () => {
    expect(rolesUsuario).toEqual(["CLIENTE", "VENDEDOR", "ADMINISTRADOR"]);
  });
});
