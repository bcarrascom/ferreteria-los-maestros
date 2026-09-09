// Manejo de la sesión del usuario.
//
// IMPORTANTE: no hay backend en esta etapa. La sesión es un dato guardado en
// localStorage del propio navegador, así que el usuario podría editarlo desde la
// consola y cambiarse el rol. No es seguridad real, es una simulación para maquetar
// las vistas por rol. En el Parcial 2 esto lo reemplaza un token emitido por el servidor.

const CLAVE_SESION = "sesion";

function guardarSesion(correo, rol) {
	const sesion = { correo: correo, rol: rol };

	// localStorage solo guarda texto, por eso el objeto se convierte a JSON.
	localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
}

// Devuelve el objeto de la sesión, o null si no hay nadie con sesión iniciada.
function obtenerSesion() {
	const guardado = localStorage.getItem(CLAVE_SESION);

	if (guardado === null) {
		return null;
	}

	return JSON.parse(guardado);
}

function cerrarSesion() {
	localStorage.removeItem(CLAVE_SESION);
}
