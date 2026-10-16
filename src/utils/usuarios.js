export const rolesUsuario = ["comprador", "vendedor", "administrador"];

export const usuariosDePrueba = [
  {
    id: "cuenta-comprador",
    nombre: "Camila Compradora",
    correo: "comprador@ferreteria.cl",
    rol: "comprador",
  },
  {
    id: "cuenta-vendedor",
    nombre: "Valentina Vendedora",
    correo: "vendedor@ferreteria.cl",
    rol: "vendedor",
  },
  {
    id: "cuenta-admin",
    nombre: "Alex Administrador",
    correo: "admin@ferreteria.cl",
    rol: "administrador",
  },
];

const CLAVE_USUARIOS = "usuarios-ferreteria";
const CLAVE_SESION = "sesion-ferreteria";

export function leerUsuariosGuardados() {
  try {
    const guardados = localStorage.getItem(CLAVE_USUARIOS);

    if (guardados === null) {
      return usuariosDePrueba;
    }

    const usuarios = JSON.parse(guardados);
    return Array.isArray(usuarios) ? usuarios : usuariosDePrueba;
  } catch {
    return usuariosDePrueba;
  }
}

export function guardarUsuarios(usuarios) {
  try {
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
  } catch {
    // Incógnito o almacenamiento lleno: la app sigue funcionando, solo no recuerda.
  }
}

export function leerSesionGuardada() {
  try {
    const guardada = localStorage.getItem(CLAVE_SESION);

    if (guardada === null) {
      return null;
    }

    const usuario = JSON.parse(guardada);
    return rolesUsuario.includes(usuario.rol) ? usuario : null;
  } catch {
    return null;
  }
}

export function guardarSesion(usuario) {
  try {
    if (usuario) {
      localStorage.setItem(CLAVE_SESION, JSON.stringify(usuario));
    } else {
      localStorage.removeItem(CLAVE_SESION);
    }
  } catch {
    // Incógnito o almacenamiento lleno: la sesión dura solo mientras la pestaña esté abierta.
  }
}

export function buscarUsuarioPorCorreo(usuarios, correo) {
  const correoNormalizado = correo.trim().toLowerCase();
  return usuarios.find(
    (usuario) => usuario.correo.toLowerCase() === correoNormalizado
  );
}

export function crearCuentaComprador(usuarios, datos) {
  const correo = datos.correo.trim().toLowerCase();

  if (!datos.nombre.trim()) {
    return { error: "Escribe tu nombre." };
  }

  if (!correo || !correo.includes("@")) {
    return { error: "Escribe un correo válido." };
  }

  if (buscarUsuarioPorCorreo(usuarios, correo)) {
    return { error: "Ya existe una cuenta con ese correo." };
  }

  const usuario = {
    id: `usuario-${Date.now()}`,
    nombre: datos.nombre.trim(),
    correo,
    rol: "comprador",
  };

  return { usuario };
}