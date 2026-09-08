// Validación del formulario de contacto.
// Usa las funciones compartidas de validaciones.js, que se carga antes que este archivo.

const formulario = document.querySelector("#formulario-contacto");
const nombre = document.querySelector("#nombre");
const apellido = document.querySelector("#apellido");
const correo = document.querySelector("#correo");
const mensaje = document.querySelector("#mensaje");
const contadorMensaje = document.querySelector("#contador-mensaje");
const confirmacion = document.querySelector("#confirmacion");

const MAXIMO_NOMBRE = 50;
const MAXIMO_APELLIDO = 100;
const MAXIMO_CORREO = 100;
const MAXIMO_MENSAJE = 500;

function validarNombre() {
	if (estaVacio(nombre.value)) {
		mostrarError(nombre, "Escribe tu nombre para saber cómo dirigirnos a ti.");
		return false;
	}

	if (superaLargo(nombre.value, MAXIMO_NOMBRE)) {
		mostrarError(nombre, `El nombre no puede superar los ${MAXIMO_NOMBRE} caracteres.`);
		return false;
	}

	marcarValido(nombre);
	return true;
}

function validarApellido() {
	if (estaVacio(apellido.value)) {
		mostrarError(apellido, "Escribe tu apellido.");
		return false;
	}

	if (superaLargo(apellido.value, MAXIMO_APELLIDO)) {
		mostrarError(apellido, `El apellido no puede superar los ${MAXIMO_APELLIDO} caracteres.`);
		return false;
	}

	marcarValido(apellido);
	return true;
}

function validarCorreo() {
	if (estaVacio(correo.value)) {
		mostrarError(correo, "Necesitamos tu correo para poder responderte.");
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

function validarMensaje() {
	if (estaVacio(mensaje.value)) {
		mostrarError(mensaje, "Cuéntanos en qué te podemos ayudar.");
		return false;
	}

	if (superaLargo(mensaje.value, MAXIMO_MENSAJE)) {
		const sobran = mensaje.value.trim().length - MAXIMO_MENSAJE;
		mostrarError(mensaje, `El mensaje supera los ${MAXIMO_MENSAJE} caracteres por ${sobran}. Resúmelo un poco.`);
		return false;
	}

	marcarValido(mensaje);
	return true;
}

function enviarFormulario(evento) {
	// Corta el envío del navegador: nosotros decidimos si los datos sirven.
	evento.preventDefault();

	// Se llaman las cuatro por separado para que todos los errores se marquen a la vez.
	const nombreValido = validarNombre();
	const apellidoValido = validarApellido();
	const correoValido = validarCorreo();
	const mensajeValido = validarMensaje();

	if (!nombreValido || !apellidoValido || !correoValido || !mensajeValido) {
		confirmacion.textContent = "";
		enfocarPrimerError(formulario);
		return;
	}

	// No hay backend en esta etapa: el mensaje no se envía a ningún servidor.
	// En el Parcial 2 esto será una petición al API.
	confirmacion.textContent = `Gracias ${nombre.value.trim()}. Recibimos tu mensaje y te responderemos a ${correo.value.trim()} dentro de un día hábil.`;

	limpiarFormulario(formulario);
	contadorMensaje.textContent = `0 / ${MAXIMO_MENSAJE} caracteres`;
}

// Validar al salir del campo avisa temprano, sin molestar mientras se escribe.
nombre.addEventListener("blur", validarNombre);
apellido.addEventListener("blur", validarApellido);
correo.addEventListener("blur", validarCorreo);
mensaje.addEventListener("blur", validarMensaje);

// Al volver a escribir, el campo vuelve a estado neutro.
nombre.addEventListener("input", () => limpiarEstado(nombre));
apellido.addEventListener("input", () => limpiarEstado(apellido));
correo.addEventListener("input", () => limpiarEstado(correo));
mensaje.addEventListener("input", () => limpiarEstado(mensaje));

conectarContador(mensaje, contadorMensaje, MAXIMO_MENSAJE);

formulario.addEventListener("submit", enviarFormulario);
