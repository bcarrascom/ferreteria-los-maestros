// Roles del backend (ms-usuarios). La sesión real está en utils/sesion.js.
export const rolesUsuario = ["CLIENTE", "VENDEDOR", "ADMINISTRADOR"];

// shortcut: lista local para AdminUsuarios; en el paso 11 se reemplaza por GET /api/v1/usuarios
export const usuariosDePrueba = [
  {
    id: "cuenta-comprador",
    nombre: "Camila Compradora",
    correo: "comprador@ferreteria.cl",
    rol: "CLIENTE",
  },
  {
    id: "cuenta-vendedor",
    nombre: "Valentina Vendedora",
    correo: "vendedor@ferreteria.cl",
    rol: "VENDEDOR",
  },
  {
    id: "cuenta-admin",
    nombre: "Alex Administrador",
    correo: "admin@ferreteria.cl",
    rol: "ADMINISTRADOR",
  },
];

const CLAVE_USUARIOS = "usuarios-ferreteria";

export function leerUsuariosGuardados() {
  const guardados = localStorage.getItem(CLAVE_USUARIOS);

  if (guardados === null) {
    return usuariosDePrueba;
  }

  try {
    const usuarios = JSON.parse(guardados);
    return Array.isArray(usuarios) ? usuarios : usuariosDePrueba;
  } catch {
    return usuariosDePrueba;
  }
}

export function guardarUsuarios(usuarios) {
  localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
}
