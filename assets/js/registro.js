// Registro de cliente. Usa validaciones.js y regiones.js, que se cargan antes.

const formulario = document.querySelector("#formulario-registro");
const run = document.querySelector("#run");
const nombre = document.querySelector("#nombre");
const apellidos = document.querySelector("#apellidos");
const fechaNacimiento = document.querySelector("#fecha-nacimiento");
const correo = document.querySelector("#correo");
const telefono = document.querySelector("#telefono");
const selectRegion = document.querySelector("#region");
const selectComuna = document.querySelector("#comuna");
const direccion = document.querySelector("#direccion");
const contrasena = document.querySelector("#contrasena");
const confirmacionContrasena = document.querySelector("#confirmar-contrasena");
const confirmacion = document.querySelector("#confirmacion");

const MAXIMO_NOMBRE = 50;
const MAXIMO_APELLIDOS = 100;
const MAXIMO_CORREO = 100;
const MAXIMO_DIRECCION = 300;
const LARGO_MINIMO_CONTRASENA = 4;
const LARGO_MAXIMO_CONTRASENA = 10;

// --- Selects encadenados ---

function llenarRegiones() {
	for (const region of REGIONES) {
		const opcion = document.createElement("option");
		opcion.value = region.nombre;
		opcion.textContent = region.nombre;
		selectRegion.appendChild(opcion);
	}
}

// Cada vez que cambia la región, la comuna se rearma desde cero.
function llenarComunas() {
	selectComuna.innerHTML = '<option value="">Selecciona una comuna</option>';

	const regionElegida = REGIONES.find((r) => r.nombre === selectRegion.value);

	if (!regionElegida) {
		selectComuna.disabled = true;
		return;
	}

	for (const nombreComuna of regionElegida.comunas) {
		const opcion = document.createElement("option");
		opcion.value = nombreComuna;
		opcion.textContent = nombreComuna;
		selectComuna.appendChild(opcion);
	}

	selectComuna.disabled = false;
}

// --- Validaciones ---

function validarRun() {
	if (estaVacio(run.value)) {
		mostrarError(run, "Escribe tu RUN sin puntos ni guion, por ejemplo 19011001K.");
		return false;
	}

	if (!rutTieneFormato(run.value)) {
		mostrarError(run, "El RUN va sin puntos ni guion, entre 7 y 9 caracteres. Ejemplo: 19011001K");
		return false;
	}

	if (!rutEsValido(run.value)) {
		const cuerpo = run.value.trim().toUpperCase().slice(0, -1);
		mostrarError(run, `El dígito verificador no corresponde. Para ${cuerpo} debería ser ${calcularDigitoVerificador(cuerpo)}.`);
		return false;
	}

	marcarValido(run);
	return true;
}

function validarNombre() {
	if (estaVacio(nombre.value)) {
		mostrarError(nombre, "Escribe tu nombre.");
		return false;
	}

	if (superaLargo(nombre.value, MAXIMO_NOMBRE)) {
		mostrarError(nombre, `El nombre no puede superar los ${MAXIMO_NOMBRE} caracteres.`);
		return false;
	}

	marcarValido(nombre);
	return true;
}

function validarApellidos() {
	if (estaVacio(apellidos.value)) {
		mostrarError(apellidos, "Escribe tus apellidos.");
		return false;
	}

	if (superaLargo(apellidos.value, MAXIMO_APELLIDOS)) {
		mostrarError(apellidos, `Los apellidos no pueden superar los ${MAXIMO_APELLIDOS} caracteres.`);
		return false;
	}

	marcarValido(apellidos);
	return true;
}

// La fecha es opcional según el anexo: vacía es válida, futura no.
function validarFechaNacimiento() {
	if (estaVacio(fechaNacimiento.value)) {
		limpiarEstado(fechaNacimiento);
		return true;
	}

	const fechaElegida = new Date(`${fechaNacimiento.value}T00:00:00`);

	if (fechaElegida > new Date()) {
		mostrarError(fechaNacimiento, "La fecha de nacimiento no puede ser posterior a hoy.");
		return false;
	}

	marcarValido(fechaNacimiento);
	return true;
}

function validarCorreo() {
	if (estaVacio(correo.value)) {
		mostrarError(correo, "Necesitamos tu correo para crear la cuenta.");
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

// El teléfono es opcional, pero si lo escriben tiene que ser un celular chileno.
function validarTelefono() {
	if (estaVacio(telefono.value)) {
		limpiarEstado(telefono);
		return true;
	}

	if (!telefonoTieneFormato(telefono.value)) {
		mostrarError(telefono, "Escribe un celular chileno de 9 dígitos que parta en 9, por ejemplo +56 9 1234 5678.");
		return false;
	}

	marcarValido(telefono);
	return true;
}

function validarRegion() {
	if (selectRegion.value === "") {
		mostrarError(selectRegion, "Elige tu región.");
		return false;
	}

	marcarValido(selectRegion);
	return true;
}

function validarComuna() {
	if (selectComuna.value === "") {
		mostrarError(selectComuna, "Elige tu comuna. Primero tienes que seleccionar una región.");
		return false;
	}

	marcarValido(selectComuna);
	return true;
}

function validarDireccion() {
	if (estaVacio(direccion.value)) {
		mostrarError(direccion, "Escribe tu dirección para poder despachar tus pedidos.");
		return false;
	}

	if (superaLargo(direccion.value, MAXIMO_DIRECCION)) {
		mostrarError(direccion, `La dirección no puede superar los ${MAXIMO_DIRECCION} caracteres.`);
		return false;
	}

	marcarValido(direccion);
	return true;
}

function validarContrasena() {
	if (contrasena.value === "") {
		mostrarError(contrasena, "Elige una contraseña.");
		return false;
	}

	if (largoFueraDeRango(contrasena.value, LARGO_MINIMO_CONTRASENA, LARGO_MAXIMO_CONTRASENA)) {
		mostrarError(contrasena, `La contraseña debe tener entre ${LARGO_MINIMO_CONTRASENA} y ${LARGO_MAXIMO_CONTRASENA} caracteres. Llevas ${contrasena.value.length}.`);
		return false;
	}

	marcarValido(contrasena);
	return true;
}

function validarConfirmacionContrasena() {
	if (confirmacionContrasena.value === "") {
		mostrarError(confirmacionContrasena, "Repite la contraseña para confirmarla.");
		return false;
	}

	if (confirmacionContrasena.value !== contrasena.value) {
		mostrarError(confirmacionContrasena, "Las dos contraseñas no coinciden.");
		return false;
	}

	marcarValido(confirmacionContrasena);
	return true;
}

// --- Envío ---

function registrar(evento) {
	evento.preventDefault();

	// Se guardan todos los resultados antes de decidir, para que ningún error
	// quede sin marcar por el cortocircuito del operador ||.
	const resultados = [
		validarRun(),
		validarNombre(),
		validarApellidos(),
		validarFechaNacimiento(),
		validarCorreo(),
		validarTelefono(),
		validarRegion(),
		validarComuna(),
		validarDireccion(),
		validarContrasena(),
		validarConfirmacionContrasena()
	];

	if (resultados.includes(false)) {
		confirmacion.textContent = "";
		enfocarPrimerError(formulario);
		return;
	}

	// No hay backend: la cuenta no se guarda en ninguna base de datos.
	// En el Parcial 2 esto será una petición al API.
	confirmacion.textContent = `Cuenta creada. Bienvenido, ${nombre.value.trim()}. Ya puedes iniciar sesión con ${correo.value.trim()}.`;

	limpiarFormulario(formulario);
	llenarComunas();
}

// --- Conexiones ---

llenarRegiones();
llenarComunas();

selectRegion.addEventListener("change", function () {
	llenarComunas();
	limpiarEstado(selectComuna);
});

run.addEventListener("blur", validarRun);
nombre.addEventListener("blur", validarNombre);
apellidos.addEventListener("blur", validarApellidos);
fechaNacimiento.addEventListener("blur", validarFechaNacimiento);
correo.addEventListener("blur", validarCorreo);
telefono.addEventListener("blur", validarTelefono);
selectRegion.addEventListener("blur", validarRegion);
selectComuna.addEventListener("blur", validarComuna);
direccion.addEventListener("blur", validarDireccion);
contrasena.addEventListener("blur", validarContrasena);
confirmacionContrasena.addEventListener("blur", validarConfirmacionContrasena);

run.addEventListener("input", () => limpiarEstado(run));
nombre.addEventListener("input", () => limpiarEstado(nombre));
apellidos.addEventListener("input", () => limpiarEstado(apellidos));
fechaNacimiento.addEventListener("input", () => limpiarEstado(fechaNacimiento));
correo.addEventListener("input", () => limpiarEstado(correo));
telefono.addEventListener("input", () => limpiarEstado(telefono));
direccion.addEventListener("input", () => limpiarEstado(direccion));
contrasena.addEventListener("input", () => limpiarEstado(contrasena));
confirmacionContrasena.addEventListener("input", () => limpiarEstado(confirmacionContrasena));

formulario.addEventListener("submit", registrar);
