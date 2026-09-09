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

// Para contraseñas: no se recorta, porque un espacio puede ser parte de la clave.
function largoFueraDeRango(valor, minimo, maximo) {
	return valor.length < minimo || valor.length > maximo;
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

const DIGITOS = "0123456789";

// Deja solo los números de un texto: "+56 9 1234 5678" -> "56912345678"
function soloNumeros(valor) {
	let resultado = "";

	for (const caracter of valor) {
		if (DIGITOS.includes(caracter)) {
			resultado = resultado + caracter;
		}
	}

	return resultado;
}

// RUT sin puntos ni guion, entre 7 y 9 caracteres. Ejemplo: 19011022K
function rutTieneFormato(valor) {
	const rut = valor.trim().toUpperCase();

	if (rut.length < 7 || rut.length > 9) {
		return false;
	}

	const cuerpo = rut.slice(0, -1);
	const digito = rut.slice(-1);

	for (const caracter of cuerpo) {
		if (!DIGITOS.includes(caracter)) {
			return false;
		}
	}

	return DIGITOS.includes(digito) || digito === "K";
}

// Módulo 11: se multiplica cada dígito, de derecha a izquierda, por la serie
// 2, 3, 4, 5, 6, 7 que se repite; el resto de la suma da el verificador.
function calcularDigitoVerificador(cuerpo) {
	let suma = 0;
	let multiplicador = 2;

	for (let posicion = cuerpo.length - 1; posicion >= 0; posicion--) {
		suma = suma + Number(cuerpo[posicion]) * multiplicador;

		if (multiplicador === 7) {
			multiplicador = 2;
		} else {
			multiplicador = multiplicador + 1;
		}
	}

	const resto = 11 - (suma % 11);

	if (resto === 11) return "0";
	if (resto === 10) return "K";
	return String(resto);
}

function rutEsValido(valor) {
	const rut = valor.trim().toUpperCase();
	const cuerpo = rut.slice(0, -1);
	const digitoIngresado = rut.slice(-1);

	return digitoIngresado === calcularDigitoVerificador(cuerpo);
}

// Celular chileno: 9 dígitos partiendo en 9, con o sin el prefijo 56.
function telefonoTieneFormato(valor) {
	const numeros = soloNumeros(valor);

	if (numeros.length === 9) {
		return numeros.startsWith("9");
	}

	if (numeros.length === 11) {
		return numeros.startsWith("569");
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
