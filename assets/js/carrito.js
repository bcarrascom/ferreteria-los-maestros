// Carrito de compras. Se carga en todas las páginas porque el contador del
// header tiene que reflejar el carrito en cualquier vista.
//
// REGLAS DEL CARRITO (definidas para este proyecto):
//   1. Un producto no se duplica: si ya está, se suma a su cantidad.
//   2. No se puede pedir más unidades que el stock disponible.
//   3. Un producto sin stock no se puede agregar.
//   4. La cantidad mínima es 1; bajar de ahí equivale a quitarlo.
//
// El carrito se guarda en localStorage como un arreglo de { codigo, cantidad }.
// A propósito NO guardamos precio ni nombre: esos viven en productos.json, así
// que si mañana cambia un precio, el carrito refleja el nuevo automáticamente.

const CLAVE_CARRITO = "carrito";

function obtenerCarrito() {
	const guardado = localStorage.getItem(CLAVE_CARRITO);

	if (guardado === null) {
		return [];
	}

	return JSON.parse(guardado);
}

function guardarCarrito(carrito) {
	localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
	actualizarContador();
}

function buscarLinea(carrito, codigo) {
	return carrito.find((linea) => linea.codigo === codigo);
}

// Devuelve true si alcanzó a agregar, false si chocó con el stock.
function agregarAlCarrito(codigo, stockDisponible) {
	if (stockDisponible === 0) {
		return false;
	}

	const carrito = obtenerCarrito();
	const linea = buscarLinea(carrito, codigo);

	if (linea) {
		if (linea.cantidad >= stockDisponible) {
			return false;
		}
		linea.cantidad = linea.cantidad + 1;
	} else {
		carrito.push({ codigo: codigo, cantidad: 1 });
	}

	guardarCarrito(carrito);
	return true;
}

function cambiarCantidad(codigo, cantidad) {
	if (cantidad < 1) {
		quitarDelCarrito(codigo);
		return;
	}

	const carrito = obtenerCarrito();
	const linea = buscarLinea(carrito, codigo);

	if (linea) {
		linea.cantidad = cantidad;
		guardarCarrito(carrito);
	}
}

function quitarDelCarrito(codigo) {
	const carrito = obtenerCarrito();
	const restantes = carrito.filter((linea) => linea.codigo !== codigo);
	guardarCarrito(restantes);
}

function vaciarCarrito() {
	guardarCarrito([]);
}

// Total de unidades, no de líneas: 3 sacos de cemento cuentan como 3.
function contarUnidades() {
	const carrito = obtenerCarrito();
	let total = 0;

	for (const linea of carrito) {
		total = total + linea.cantidad;
	}

	return total;
}

function actualizarContador() {
	const contador = document.querySelector("#carrito-cantidad");

	if (contador) {
		contador.textContent = contarUnidades();
	}
}

actualizarContador();
