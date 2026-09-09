// Inicio de sesión simulado.
// El anexo solo exige validar el formato del correo y de la contraseña, así que
// cualquier correo bien escrito entra. Estas dos cuentas entran con rol elevado
// para poder demostrar los paneles de administrador y vendedor.
// admin@duoc.cl
// Admin12
const CUENTAS_CON_ROL = {
	"admin@duoc.cl": "Administrador",
	"vendedor@duoc.cl": "Vendedor"
};

const LARGO_MINIMO_CONTRASENA = 4;
const LARGO_MAXIMO_CONTRASENA = 10;
const MAXIMO_CORREO = 100;

const formulario = document.querySelector("#formulario-login");
const correo = document.querySelector("#correo");
const contrasena = document.querySelector("#contrasena");
const botonVerContrasena = document.querySelector("#boton-ver-contrasena");
const botonCerrar = document.querySelector("#boton-cerrar");
const accionesSesion = document.querySelector("#acciones-sesion");
const sesionActiva = document.querySelector("#sesion-activa");
const confirmacion = document.querySelector("#confirmacion");

// Cualquier correo que no esté en la tabla entra como Cliente.
function obtenerRol(valorCorreo) {
	const clave = valorCorreo.trim().toLowerCase();

	if (CUENTAS_CON_ROL[clave]) {
		return CUENTAS_CON_ROL[clave];
	}

	return "Cliente";
}

function validarCorreo() {
	if (estaVacio(correo.value)) {
		mostrarError(correo, "Escribe tu correo para entrar.");
		return false;
	}

	if (superaLargo(correo.value, MAXIMO_CORREO)) {
		mostrarError(correo, `El correo no puede superar los ${MAXIMO_CORREO} caracteres.`);
		return false;
	}

	if (!correoTieneFormato(correo.value)) {
		mostrarError(correo, "Falta la arroba o el dominio. Debe verse así: nombre@gmail.com");
		return false;
	}

	if (!correoTieneDominioPermitido(correo.value)) {
		mostrarError(correo, "Solo aceptamos correos terminados en @duoc.cl, @profesor.duoc.cl o @gmail.com");
		return false;
	}

	marcarValido(correo);
	return true;
}

function validarContrasena() {
	if (contrasena.value === "") {
		mostrarError(contrasena, "Escribe tu contraseña.");
		return false;
	}

	if (largoFueraDeRango(contrasena.value, LARGO_MINIMO_CONTRASENA, LARGO_MAXIMO_CONTRASENA)) {
		mostrarError(contrasena, `La contraseña debe tener entre ${LARGO_MINIMO_CONTRASENA} y ${LARGO_MAXIMO_CONTRASENA} caracteres. Llevas ${contrasena.value.length}.`);
		return false;
	}

	marcarValido(contrasena);
	return true;
}

function iniciarSesion(evento) {
	evento.preventDefault();

	const correoValido = validarCorreo();
	const contrasenaValida = validarContrasena();

	if (!correoValido || !contrasenaValida) {
		confirmacion.textContent = "";
		enfocarPrimerError(formulario);
		return;
	}

	const rol = obtenerRol(correo.value);
	guardarSesion(correo.value.trim().toLowerCase(), rol);

	confirmacion.textContent = `Sesión iniciada como ${rol}. Te llevamos al inicio.`;

	// Cuando existan los paneles por rol, este destino dependerá del rol.
	setTimeout(function () {
		window.location.href = "index.html";
	}, 1500);
}

// Si ya hay sesión, se avisa y se ofrece cerrarla en vez de volver a entrar.
function mostrarSesionActiva() {
	const sesion = obtenerSesion();

	if (sesion === null) {
		sesionActiva.textContent = "";
		accionesSesion.hidden = true;
		return;
	}

	sesionActiva.textContent = `Ya tienes una sesión abierta como ${sesion.rol} (${sesion.correo}).`;
	accionesSesion.hidden = false;
}

botonVerContrasena.addEventListener("click", function () {
	const estaVisible = botonVerContrasena.getAttribute("aria-pressed") === "true";

	if (estaVisible) {
		contrasena.type = "password";
		botonVerContrasena.textContent = "Mostrar contraseña";
		botonVerContrasena.setAttribute("aria-pressed", "false");
	} else {
		contrasena.type = "text";
		botonVerContrasena.textContent = "Ocultar contraseña";
		botonVerContrasena.setAttribute("aria-pressed", "true");
	}
});

botonCerrar.addEventListener("click", function () {
	cerrarSesion();
	mostrarSesionActiva();
	confirmacion.textContent = "Cerraste la sesión.";
});

correo.addEventListener("blur", validarCorreo);
contrasena.addEventListener("blur", validarContrasena);

correo.addEventListener("input", () => limpiarEstado(correo));
contrasena.addEventListener("input", () => limpiarEstado(contrasena));

formulario.addEventListener("submit", iniciarSesion);

mostrarSesionActiva();
