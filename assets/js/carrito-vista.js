// Dibuja la página del carrito. La lógica de datos está en carrito.js,
// que se carga antes que este archivo.

const listaCarrito = document.querySelector("#lista-carrito");
const estadoCarrito = document.querySelector("#estado-carrito");
const totalCarrito = document.querySelector("#carrito-total");
const accionesCarrito = document.querySelector("#acciones-carrito");
const confirmacion = document.querySelector("#confirmacion");
const botonPagar = document.querySelector("#boton-pagar");
const botonVaciar = document.querySelector("#boton-vaciar");

// Se guarda el catálogo completo para no volver a pedirlo en cada redibujo.
let catalogo = [];

fetch("data/productos.json")
	.then((respuesta) => respuesta.json())
	.then((productos) => {
		catalogo = productos;
		dibujarCarrito();
	})
	.catch((error) => {
		estadoCarrito.textContent = "No pudimos cargar el catálogo. Recarga la página.";
		console.error("No se pudo cargar productos.json:", error);
	});

function buscarProducto(codigo) {
	return catalogo.find((producto) => producto.codigo === codigo);
}

function formatearPesos(monto) {
	return "$" + monto.toLocaleString("es-CL");
}

function dibujarCarrito() {
	const carrito = obtenerCarrito();

	if (carrito.length === 0) {
		listaCarrito.innerHTML = "";
		totalCarrito.textContent = "";
		accionesCarrito.hidden = true;
		estadoCarrito.textContent = "Tu carrito está vacío. Agrega productos desde el catálogo.";
		return;
	}

	estadoCarrito.textContent = "";
	accionesCarrito.hidden = false;

	let html = "";
	let total = 0;

	for (const linea of carrito) {
		const producto = buscarProducto(linea.codigo);

		// Si un código quedó en el carrito y ya no está en el catálogo, se ignora.
		if (!producto) {
			continue;
		}

		const subtotal = producto.precio_venta_clp * linea.cantidad;
		total = total + subtotal;

		html += `
			<li>
				<article class="linea-carrito">
					<img src="assets/img/productos/${producto.codigo}.jpg" alt="${producto.nombre_producto}" loading="lazy">
					<h3>${producto.nombre_producto}</h3>
					<p class="linea-detalle">${producto.marca} · ${producto.codigo} · ${formatearPesos(producto.precio_venta_clp)} por ${producto.unidad.toLowerCase()}</p>
					<p class="linea-cantidad">
						<label for="cantidad-${producto.codigo}">Cantidad</label>
						<input type="number" id="cantidad-${producto.codigo}" class="campo-cantidad"
							value="${linea.cantidad}" min="1" max="${producto.stock}"
							data-codigo="${producto.codigo}">
						<span class="linea-tope">máx. ${producto.stock}</span>
					</p>
					<p class="linea-subtotal">${formatearPesos(subtotal)}</p>
					<p class="linea-quitar">
						<button class="boton-texto" type="button" data-quitar="${producto.codigo}">Quitar</button>
					</p>
				</article>
			</li>
		`;
	}

	listaCarrito.innerHTML = html;
	totalCarrito.textContent = `Total: ${formatearPesos(total)}`;
}

// Un solo listener para todos los campos de cantidad de la lista.
listaCarrito.addEventListener("change", function (evento) {
	const campo = evento.target.closest(".campo-cantidad");

	if (!campo) {
		return;
	}

	const codigo = campo.dataset.codigo;
	const producto = buscarProducto(codigo);
	let cantidad = Number(campo.value);

	// Regla 2: no se puede pedir más de lo que hay en bodega.
	if (cantidad > producto.stock) {
		cantidad = producto.stock;
	}

	cambiarCantidad(codigo, cantidad);
	dibujarCarrito();
});

listaCarrito.addEventListener("click", function (evento) {
	const boton = evento.target.closest("[data-quitar]");

	if (!boton) {
		return;
	}

	quitarDelCarrito(boton.dataset.quitar);
	dibujarCarrito();
	confirmacion.textContent = "Producto quitado del carrito.";
});

botonVaciar.addEventListener("click", function () {
	vaciarCarrito();
	dibujarCarrito();
	confirmacion.textContent = "Vaciaste el carrito.";
});

botonPagar.addEventListener("click", function () {
	const unidades = contarUnidades();

	// No hay backend ni pasarela de pago: el pedido no se envía a ningún lado.
	// En el Parcial 2 esto será una petición al API que crea el pedido.
	confirmacion.textContent = `Pedido confirmado por ${unidades} productos. Te avisaremos cuando esté listo para retirar en Rengifo 320.`;

	vaciarCarrito();
	dibujarCarrito();
});
