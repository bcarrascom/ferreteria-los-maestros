// src/utils/usuarios.spec.jsx
import {
  buscarUsuarioPorCorreo,
  crearCuentaComprador,
  guardarSesion,
  guardarUsuarios,
  leerSesionGuardada,
  leerUsuariosGuardados,
  usuariosDePrueba,
} from "./usuarios";

describe("leerUsuariosGuardados", () => {
  it("sin nada guardado entrega las cuentas de prueba", () => {
    expect(leerUsuariosGuardados()).toEqual(usuariosDePrueba);
  });

  it("devuelve los usuarios guardados", () => {
    guardarUsuarios([{ id: "u1", nombre: "Ana", correo: "ana@mail.cl", rol: "comprador" }]);
    expect(leerUsuariosGuardados()).toHaveLength(1);
  });

  it("si lo guardado está dañado o no es una lista, vuelve a las de prueba", () => {
    localStorage.setItem("usuarios-ferreteria", "esto no es JSON");
    expect(leerUsuariosGuardados()).toEqual(usuariosDePrueba);

    localStorage.setItem("usuarios-ferreteria", '{"no":"es lista"}');
    expect(leerUsuariosGuardados()).toEqual(usuariosDePrueba);
  });
});

describe("sesión", () => {
  it("sin sesión guardada devuelve null", () => {
    expect(leerSesionGuardada()).toBeNull();
  });

  it("guarda y lee la sesión", () => {
    guardarSesion(usuariosDePrueba[0]);
    expect(leerSesionGuardada()).toEqual(usuariosDePrueba[0]);
  });

  it("cerrar sesión borra lo guardado", () => {
    guardarSesion(usuariosDePrueba[0]);
    guardarSesion(null);
    expect(localStorage.getItem("sesion-ferreteria")).toBeNull();
  });

  it("descarta una sesión dañada o con un rol que no existe", () => {
    localStorage.setItem("sesion-ferreteria", "esto no es JSON");
    expect(leerSesionGuardada()).toBeNull();

    localStorage.setItem("sesion-ferreteria", '{"nombre":"Pirata","rol":"superadmin"}');
    expect(leerSesionGuardada()).toBeNull();
  });
});

describe("buscarUsuarioPorCorreo", () => {
  it("encuentra el correo sin importar mayúsculas ni espacios", () => {
    const usuario = buscarUsuarioPorCorreo(usuariosDePrueba, "  ADMIN@ferreteria.cl ");
    expect(usuario.rol).toBe("administrador");
  });
});

describe("crearCuentaComprador", () => {
  it("pide nombre", () => {
    const resultado = crearCuentaComprador(usuariosDePrueba, { nombre: " ", correo: "a@mail.cl" });
    expect(resultado.error).toBe("Escribe tu nombre.");
  });

  it("pide un correo con @", () => {
    const resultado = crearCuentaComprador(usuariosDePrueba, { nombre: "Ana", correo: "anamail.cl" });
    expect(resultado.error).toBe("Escribe un correo válido.");
  });

  it("no permite un correo repetido", () => {
    const resultado = crearCuentaComprador(usuariosDePrueba, { nombre: "Ana", correo: "comprador@ferreteria.cl" });
    expect(resultado.error).toBe("Ya existe una cuenta con ese correo.");
  });

  it("crea la cuenta siempre con rol comprador", () => {
    const resultado = crearCuentaComprador(usuariosDePrueba, { nombre: " Ana ", correo: "ANA@mail.cl" });
    expect(resultado.usuario).toEqual(
      expect.objectContaining({ nombre: "Ana", correo: "ana@mail.cl", rol: "comprador" })
    );
  });
});
