// Panel de administración. Depende de validaciones.js, regiones.js y sesion.js.

// --- Control de acceso -------------------------------------------------
// El anexo pide que las vistas de administración estén protegidas.
// Recordatorio: esto NO es seguridad real. La sesión vive en localStorage y el
// usuario podría editarla desde la consola. En el Parcial 2 el permiso lo
// verifica el servidor antes de entregar los datos.

const avisoAcceso = document.querySelector("#aviso-acceso");
const menuAdmin = document.querySelector("#menu-admin");
const seccionUsuarios = document.querySelector("#seccion-usuarios");
const seccionProductos = document.querySelector("#seccion-productos");

function tieneAcceso() {
	const sesion = obtenerSesion();
	return sesion !== null && sesion.rol === "Administrador";
}

if (!tieneAcceso()) {
	avisoAcceso.textContent = "Esta sección es solo para administradores. Te llevamos al inicio de sesión.";
	menuAdmin.hidden = true;
	seccionUsuarios.hidden = true;
	seccionProductos.hidden = true;

	setTimeout(function () {
		window.location.href = "login.html";
	}, 2500);
}

// --- Navegación del panel ----------------------------------------------

const botonesSeccion = document.querySelectorAll(".menu-admin-boton");

function mostrarSeccion(nombre) {
	seccionUsuarios.hidden = nombre !== "usuarios";
	seccionProductos.hidden = nombre !== "productos";

	botonesSeccion.forEach(function (boton) {
		boton.setAttribute("aria-pressed", String(boton.dataset.seccion === nombre));
	});
}

botonesSeccion.forEach(function (boton) {
	boton.addEventListener("click", function () {
		mostrarSeccion(boton.dataset.seccion);
	});
});

// --- Usuarios ----------------------------------------------------------

const CLAVE_USUARIOS = "usuarios";

// Usuarios de ejemplo. Los RUN están verificados con el módulo 11.
const USUARIOS_INICIALES = [
	{
		run: "124567831",
		nombre: "Rodrigo",
		apellidos: "Fuentes Araya",
		correo: "admin@duoc.cl",
		rol: "Administrador",
		region: "Región de Coquimbo",
		comuna: "La Serena",
		direccion: "Rengifo 320",
		activo: true
	},
	{
		run: "164520986",
		nombre: "Camila",
		apellidos: "Rojas Pizarro",
		correo: "vendedor@duoc.cl",
		rol: "Vendedor",
		region: "Región de Coquimbo",
		comuna: "Coquimbo",
		direccion: "Av. Costanera 1450",
		activo: true
	},
	{
		run: "201145678",
		nombre: "Héctor",
		apellidos: "Muñoz Tapia",
		correo: "maestro@gmail.com",
		rol: "Cliente",
		region: "Región de Coquimbo",
		comuna: "Ovalle",
		direccion: "Vicuña Mackenna 78",
		activo: true
	}
];

function obtenerUsuarios() {
	const guardado = localStorage.getItem(CLAVE_USUARIOS);

	// La primera vez que se abre el panel se siembran los usuarios de ejemplo.
	if (guardado === null) {
		guardarUsuarios(USUARIOS_INICIALES);
		return USUARIOS_INICIALES;
	}

	return JSON.parse(guardado);
}

function guardarUsuarios(usuarios) {
	localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
}

const cuerpoTablaUsuarios = document.querySelector("#tabla-usuarios");
const conteoUsuarios = document.querySelector("#conteo-usuarios");
const confirmacionUsuario = document.querySelector("#confirmacion-usuario");

function dibujarUsuarios() {
	const usuarios = obtenerUsuarios();
	let html = "";

	for (const usuario of usuarios) {
		let estado = "Activo";
		let claseEstado = "estado-activo";
		let textoBoton = "Desactivar";

		if (!usuario.activo) {
			estado = "Inactivo";
			claseEstado = "estado-inactivo";
			textoBoton = "Reactivar";
		}

		html += `
			<tr>
				<th scope="row">${usuario.run}</th>
				<td>${usuario.nombre} ${usuario.apellidos}</td>
				<td>${usuario.correo}</td>
				<td>${usuario.rol}</td>
				<td>${usuario.comuna}</td>
				<td><span class="etiqueta-estado ${claseEstado}">${estado}</span></td>
				<td><button class="boton-texto" type="button" data-run="${usuario.run}">${textoBoton}</button></td>
			</tr>
		`;
	}

	cuerpoTablaUsuarios.innerHTML = html;
	conteoUsuarios.textContent = `${usuarios.length} usuarios registrados.`;
}

// El caso pide desactivar, nunca eliminar: hay que conservar el historial.
cuerpoTablaUsuarios.addEventListener("click", function (evento) {
	const boton = evento.target.closest("[data-run]");

	if (!boton) {
		return;
	}

	const usuarios = obtenerUsuarios();
	const usuario = usuarios.find((u) => u.run === boton.dataset.run);

	usuario.activo = !usuario.activo;
	guardarUsuarios(usuarios);
	dibujarUsuarios();

	confirmacionUsuario.textContent = `${usuario.nombre} ${usuario.apellidos} quedó como ${usuario.activo ? "activo" : "inactivo"}.`;
});

// --- Formulario de usuario ---------------------------------------------

const formularioUsuario = document.querySelector("#formulario-usuario");
const uRun = document.querySelector("#u-run");
const uNombre = document.querySelector("#u-nombre");
const uApellidos = document.querySelector("#u-apellidos");
const uCorreo = document.querySelector("#u-correo");
const uRol = document.querySelector("#u-rol");
const uRegion = document.querySelector("#u-region");
const uComuna = document.querySelector("#u-comuna");
const uDireccion = document.querySelector("#u-direccion");

function llenarRegionesAdmin() {
	for (const region of REGIONES) {
		const opcion = document.createElement("option");
		opcion.value = region.nombre;
		opcion.textContent = region.nombre;
		uRegion.appendChild(opcion);
	}
}

function llenarComunasAdmin() {
	uComuna.innerHTML = '<option value="">Selecciona una comuna</option>';

	const regionElegida = REGIONES.find((r) => r.nombre === uRegion.value);

	if (!regionElegida) {
		uComuna.disabled = true;
		return;
	}

	for (const nombreComuna of regionElegida.comunas) {
		const opcion = document.createElement("option");
		opcion.value = nombreComuna;
		opcion.textContent = nombreComuna;
		uComuna.appendChild(opcion);
	}

	uComuna.disabled = false;
}

function validarURun() {
	if (estaVacio(uRun.value)) {
		mostrarError(uRun, "Escribe el RUN sin puntos ni guion, por ejemplo 19011001K.");
		return false;
	}

	if (!rutTieneFormato(uRun.value)) {
		mostrarError(uRun, "El RUN va sin puntos ni guion, entre 7 y 9 caracteres.");
		return false;
	}

	if (!rutEsValido(uRun.value)) {
		const cuerpo = uRun.value.trim().toUpperCase().slice(0, -1);
		mostrarError(uRun, `El dígito verificador no corresponde. Para ${cuerpo} debería ser ${calcularDigitoVerificador(cuerpo)}.`);
		return false;
	}

	const yaExiste = obtenerUsuarios().find((u) => u.run === uRun.value.trim().toUpperCase());

	if (yaExiste) {
		mostrarError(uRun, "Ya hay un usuario registrado con ese RUN.");
		return false;
	}

	marcarValido(uRun);
	return true;
}

function validarUNombre() {
	if (estaVacio(uNombre.value)) {
		mostrarError(uNombre, "Escribe el nombre del usuario.");
		return false;
	}

	if (superaLargo(uNombre.value, 50)) {
		mostrarError(uNombre, "El nombre no puede superar los 50 caracteres.");
		return false;
	}

	marcarValido(uNombre);
	return true;
}

function validarUApellidos() {
	if (estaVacio(uApellidos.value)) {
		mostrarError(uApellidos, "Escribe los apellidos del usuario.");
		return false;
	}

	if (superaLargo(uApellidos.value, 100)) {
		mostrarError(uApellidos, "Los apellidos no pueden superar los 100 caracteres.");
		return false;
	}

	marcarValido(uApellidos);
	return true;
}

function validarUCorreo() {
	if (estaVacio(uCorreo.value)) {
		mostrarError(uCorreo, "Escribe el correo del usuario.");
		return false;
	}

	if (superaLargo(uCorreo.value, 100)) {
		mostrarError(uCorreo, "El correo no puede superar los 100 caracteres.");
		return false;
	}

	if (!correoTieneFormato(uCorreo.value)) {
		mostrarError(uCorreo, "Falta la arroba o el dominio. Debe verse así: nombre@gmail.com");
		return false;
	}

	if (!correoTieneDominioPermitido(uCorreo.value)) {
		mostrarError(uCorreo, "Solo aceptamos correos terminados en @duoc.cl, @profesor.duoc.cl o @gmail.com");
		return false;
	}

	marcarValido(uCorreo);
	return true;
}

function validarURol() {
	if (uRol.value === "") {
		mostrarError(uRol, "Elige el perfil del usuario.");
		return false;
	}

	marcarValido(uRol);
	return true;
}

function validarURegion() {
	if (uRegion.value === "") {
		mostrarError(uRegion, "Elige la región.");
		return false;
	}

	marcarValido(uRegion);
	return true;
}

function validarUComuna() {
	if (uComuna.value === "") {
		mostrarError(uComuna, "Elige la comuna. Primero tienes que seleccionar una región.");
		return false;
	}

	marcarValido(uComuna);
	return true;
}

function validarUDireccion() {
	if (estaVacio(uDireccion.value)) {
		mostrarError(uDireccion, "Escribe la dirección del usuario.");
		return false;
	}

	if (superaLargo(uDireccion.value, 300)) {
		mostrarError(uDireccion, "La dirección no puede superar los 300 caracteres.");
		return false;
	}

	marcarValido(uDireccion);
	return true;
}

formularioUsuario.addEventListener("submit", function (evento) {
	evento.preventDefault();

	const resultados = [
		validarURun(),
		validarUNombre(),
		validarUApellidos(),
		validarUCorreo(),
		validarURol(),
		validarURegion(),
		validarUComuna(),
		validarUDireccion()
	];

	if (resultados.includes(false)) {
		confirmacionUsuario.textContent = "";
		enfocarPrimerError(formularioUsuario);
		return;
	}

	const usuarios = obtenerUsuarios();

	usuarios.push({
		run: uRun.value.trim().toUpperCase(),
		nombre: uNombre.value.trim(),
		apellidos: uApellidos.value.trim(),
		correo: uCorreo.value.trim().toLowerCase(),
		rol: uRol.value,
		region: uRegion.value,
		comuna: uComuna.value,
		direccion: uDireccion.value.trim(),
		activo: true
	});

	guardarUsuarios(usuarios);
	dibujarUsuarios();

	confirmacionUsuario.textContent = `Usuario ${uNombre.value.trim()} creado con perfil ${uRol.value}.`;
	limpiarFormulario(formularioUsuario);
	llenarComunasAdmin();
});

uRegion.addEventListener("change", function () {
	llenarComunasAdmin();
	limpiarEstado(uComuna);
});

uRun.addEventListener("blur", validarURun);
uNombre.addEventListener("blur", validarUNombre);
uApellidos.addEventListener("blur", validarUApellidos);
uCorreo.addEventListener("blur", validarUCorreo);
uDireccion.addEventListener("blur", validarUDireccion);

uRun.addEventListener("input", () => limpiarEstado(uRun));
uNombre.addEventListener("input", () => limpiarEstado(uNombre));
uApellidos.addEventListener("input", () => limpiarEstado(uApellidos));
uCorreo.addEventListener("input", () => limpiarEstado(uCorreo));
uDireccion.addEventListener("input", () => limpiarEstado(uDireccion));

// --- Productos ---------------------------------------------------------

const cuerpoTablaProductos = document.querySelector("#tabla-productos");
const conteoProductos = document.querySelector("#conteo-productos");
const confirmacionProducto = document.querySelector("#confirmacion-producto");
const pCategoria = document.querySelector("#p-categoria");

function dibujarProductos(productos) {
	let html = "";
	let bajoUmbral = 0;

	for (const producto of productos) {
		let clase = "";
		let alerta = "";

		// Alerta visual cuando el stock llega al umbral de reposición.
		if (producto.stock <= producto.stock_minimo) {
			clase = "fila-alerta";
			alerta = " <strong>Reponer</strong>";
			bajoUmbral = bajoUmbral + 1;
		}

		html += `
			<tr class="${clase}">
				<th scope="row">${producto.codigo}</th>
				<td>${producto.nombre_producto}</td>
				<td>${producto.categoria}</td>
				<td class="celda-numero">$${producto.precio_venta_clp.toLocaleString("es-CL")}</td>
				<td class="celda-numero">${producto.stock}</td>
				<td class="celda-numero">${producto.stock_minimo}${alerta}</td>
			</tr>
		`;
	}

	cuerpoTablaProductos.innerHTML = html;
	conteoProductos.textContent = `${productos.length} productos en catálogo, ${bajoUmbral} bajo el umbral de reposición.`;
}

function llenarCategorias(productos) {
	const categorias = [];

	for (const producto of productos) {
		if (!categorias.includes(producto.categoria)) {
			categorias.push(producto.categoria);
		}
	}

	for (const categoria of categorias) {
		const opcion = document.createElement("option");
		opcion.value = categoria;
		opcion.textContent = categoria;
		pCategoria.appendChild(opcion);
	}
}

fetch("data/productos.json")
	.then((respuesta) => respuesta.json())
	.then((productos) => {
		dibujarProductos(productos);
		llenarCategorias(productos);
	})
	.catch((error) => {
		conteoProductos.textContent = "No pudimos cargar el catálogo. Recarga la página.";
		console.error("No se pudo cargar productos.json:", error);
	});

// --- Formulario de producto --------------------------------------------

const formularioProducto = document.querySelector("#formulario-producto");
const pCodigo = document.querySelector("#p-codigo");
const pNombre = document.querySelector("#p-nombre");
const pDescripcion = document.querySelector("#p-descripcion");
const pPrecio = document.querySelector("#p-precio");
const pStock = document.querySelector("#p-stock");
const pStockCritico = document.querySelector("#p-stock-critico");

function validarPCodigo() {
	if (estaVacio(pCodigo.value)) {
		mostrarError(pCodigo, "Escribe el código del producto, por ejemplo MC011.");
		return false;
	}

	if (pCodigo.value.trim().length < 3) {
		mostrarError(pCodigo, `El código necesita al menos 3 caracteres. Llevas ${pCodigo.value.trim().length}.`);
		return false;
	}

	marcarValido(pCodigo);
	return true;
}

function validarPNombre() {
	if (estaVacio(pNombre.value)) {
		mostrarError(pNombre, "Escribe el nombre del producto.");
		return false;
	}

	if (superaLargo(pNombre.value, 100)) {
		mostrarError(pNombre, "El nombre no puede superar los 100 caracteres.");
		return false;
	}

	marcarValido(pNombre);
	return true;
}

// Opcional: vacío es válido.
function validarPDescripcion() {
	if (estaVacio(pDescripcion.value)) {
		limpiarEstado(pDescripcion);
		return true;
	}

	if (superaLargo(pDescripcion.value, 500)) {
		mostrarError(pDescripcion, "La descripción no puede superar los 500 caracteres.");
		return false;
	}

	marcarValido(pDescripcion);
	return true;
}

function validarPPrecio() {
	if (estaVacio(pPrecio.value)) {
		mostrarError(pPrecio, "Escribe el precio de venta.");
		return false;
	}

	if (!esNumero(pPrecio.value)) {
		mostrarError(pPrecio, "El precio tiene que ser un número. Usa punto para los decimales, por ejemplo 5990.5");
		return false;
	}

	if (esNegativo(pPrecio.value)) {
		mostrarError(pPrecio, "El precio no puede ser negativo. Un producto gratis se registra con precio 0.");
		return false;
	}

	marcarValido(pPrecio);
	return true;
}

function validarPStock() {
	if (estaVacio(pStock.value)) {
		mostrarError(pStock, "Escribe cuántas unidades hay en bodega.");
		return false;
	}

	if (!esNumero(pStock.value)) {
		mostrarError(pStock, "El stock tiene que ser un número.");
		return false;
	}

	if (!esEntero(pStock.value)) {
		mostrarError(pStock, "El stock se cuenta en unidades enteras, sin decimales.");
		return false;
	}

	if (esNegativo(pStock.value)) {
		mostrarError(pStock, "El stock no puede ser negativo. Si no queda nada, escribe 0.");
		return false;
	}

	marcarValido(pStock);
	return true;
}

// Opcional: vacío es válido.
function validarPStockCritico() {
	if (estaVacio(pStockCritico.value)) {
		limpiarEstado(pStockCritico);
		return true;
	}

	if (!esNumero(pStockCritico.value) || !esEntero(pStockCritico.value)) {
		mostrarError(pStockCritico, "El stock crítico se escribe con números enteros.");
		return false;
	}

	if (esNegativo(pStockCritico.value)) {
		mostrarError(pStockCritico, "El stock crítico no puede ser negativo.");
		return false;
	}

	marcarValido(pStockCritico);
	return true;
}

function validarPCategoria() {
	if (pCategoria.value === "") {
		mostrarError(pCategoria, "Elige la categoría del producto.");
		return false;
	}

	marcarValido(pCategoria);
	return true;
}

formularioProducto.addEventListener("submit", function (evento) {
	evento.preventDefault();

	const resultados = [
		validarPCodigo(),
		validarPNombre(),
		validarPDescripcion(),
		validarPPrecio(),
		validarPStock(),
		validarPStockCritico(),
		validarPCategoria()
	];

	if (resultados.includes(false)) {
		confirmacionProducto.textContent = "";
		enfocarPrimerError(formularioProducto);
		return;
	}

	// No hay backend: el producto no se agrega a productos.json, que es un
	// archivo estático. En el Parcial 2 esto será un POST al API.
	confirmacionProducto.textContent = `Producto ${pCodigo.value.trim().toUpperCase()} validado correctamente. Sin backend no se guarda en el catálogo.`;
	limpiarFormulario(formularioProducto);
});

pCodigo.addEventListener("blur", validarPCodigo);
pNombre.addEventListener("blur", validarPNombre);
pDescripcion.addEventListener("blur", validarPDescripcion);
pPrecio.addEventListener("blur", validarPPrecio);
pStock.addEventListener("blur", validarPStock);
pStockCritico.addEventListener("blur", validarPStockCritico);

pCodigo.addEventListener("input", () => limpiarEstado(pCodigo));
pNombre.addEventListener("input", () => limpiarEstado(pNombre));
pDescripcion.addEventListener("input", () => limpiarEstado(pDescripcion));
pPrecio.addEventListener("input", () => limpiarEstado(pPrecio));
pStock.addEventListener("input", () => limpiarEstado(pStock));
pStockCritico.addEventListener("input", () => limpiarEstado(pStockCritico));

// --- Arranque ----------------------------------------------------------

if (tieneAcceso()) {
	llenarRegionesAdmin();
	llenarComunasAdmin();
	dibujarUsuarios();
	mostrarSeccion("usuarios");
}
