// Utilidades compartidas por todos los formularios del sitio.
// Convención: el <span> del error de un campo tiene id "error-" + el id del campo.
// Ejemplo: <input id="correo"> se acompaña de <span id="error-correo">.

// Dominios que exige el enunciado de la evaluación.
const DOMINIOS_PERMITIDOS = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];

function obtenerSalidaDeError(campo) {
	return document.querySelector(`#error-${campo.id}`);
}

function mostrarError(campo, mensaje) {
	obtenerSalidaDeError(campo).textContent = mensaje;
	campo.classList.add("campo-invalido");
	campo.classList.remove("campo-valido");
	campo.setAttribute("aria-invalid", "true");
}

function marcarValido(campo) {
	obtenerSalidaDeError(campo).textContent = "";
	campo.classList.remove("campo-invalido");
	campo.classList.add("campo-valido");
	campo.setAttribute("aria-invalid", "false");
}

// Vuelve al estado neutro. Se usa mientras el usuario escribe: no corresponde
// gritarle que está mal a mitad de una palabra.
function limpiarEstado(campo) {
	obtenerSalidaDeError(campo).textContent = "";
	campo.classList.remove("campo-invalido", "campo-valido");
	campo.removeAttribute("aria-invalid");
}

// --- Comprobaciones. Devuelven true o false; el mensaje lo pone cada página ---

function estaVacio(valor) {
	return valor.trim() === "";
}

function superaLargo(valor, maximo) {
	return valor.trim().length > maximo;
}

function correoTieneFormato(valor) {
	const partes = valor.trim().split("@");

	if (partes.length !== 2) return false;   // ninguna arroba, o más de una
	if (partes[0] === "") return false;      // nada antes de la arroba
	if (!partes[1].includes(".")) return false;

	return true;
}

function correoTieneDominioPermitido(valor) {
	const correo = valor.trim().toLowerCase();

	for (const dominio of DOMINIOS_PERMITIDOS) {
		if (correo.endsWith(dominio)) {
			return true;
		}
	}

	return false;
}

// --- Ayudas de interfaz ---

// Lleva el foco al primer campo con error para que el usuario sepa dónde seguir.
function enfocarPrimerError(formulario) {
	const primerError = formulario.querySelector('[aria-invalid="true"]');

	if (primerError) {
		primerError.focus();
	}
}

function limpiarFormulario(formulario) {
	formulario.reset();

	const campos = formulario.querySelectorAll("input, textarea, select");
	campos.forEach(limpiarEstado);
}

// Muestra "0 / 500 caracteres" bajo un campo y lo actualiza al escribir.
function conectarContador(campo, salida, maximo) {
	function actualizar() {
		salida.textContent = `${campo.value.length} / ${maximo} caracteres`;
	}

	campo.addEventListener("input", actualizar);
	actualizar();
}
