// Arma el catálogo: primero una sección por cada categoría del JSON
// y al final el listado con todos los productos.

const seccionCategorias = document.querySelector("#seccion-categorias");
const estadoCatalogo = document.querySelector("#estado-catalogo");
const listaTodos = document.querySelector("#lista-todos");
const conteoTotal = document.querySelector("#conteo-total");

const IMAGEN_POR_DEFECTO = "assets/img/sin-imagen.svg";

fetch("data/productos.json")
	.then((respuesta) => respuesta.json())
	.then((productos) => {
		mostrarPorCategoria(productos);
		mostrarTodos(productos);
		estadoCatalogo.remove();
		usarImagenPorDefecto();
	})
	.catch((error) => {
		estadoCatalogo.textContent = "No pudimos cargar el catálogo. Revisa tu conexión y recarga la página.";
		console.error("No se pudo cargar productos.json:", error);
	});

// Devuelve las categorías sin repetir, en el orden en que aparecen en el JSON.
function obtenerCategorias(productos) {
	const categorias = [];

	for (const producto of productos) {
		if (!categorias.includes(producto.categoria)) {
			categorias.push(producto.categoria);
		}
	}

	return categorias;
}

function mostrarPorCategoria(productos) {
	const categorias = obtenerCategorias(productos);

	categorias.forEach((categoria, indice) => {
		const productosDeLaCategoria = productos.filter((p) => p.categoria === categoria);

		// El id numerado evita tener que convertir "Mat. Construcción" en un id válido.
		const idTitulo = `cat-${indice}`;

		const seccion = document.createElement("section");
		seccion.className = "categoria";
		seccion.setAttribute("aria-labelledby", idTitulo);
		seccion.innerHTML = `
			<h3 id="${idTitulo}">${categoria}
				<span class="categoria-conteo">${productosDeLaCategoria.length} productos</span>
			</h3>
			<ul class="grilla-catalogo">${crearTarjetas(productosDeLaCategoria, "h4")}</ul>
		`;

		seccionCategorias.appendChild(seccion);
	});
}

function mostrarTodos(productos) {
	conteoTotal.textContent = `${productos.length} productos en total.`;
	listaTodos.innerHTML = crearTarjetas(productos, "h3");
}

function crearTarjetas(productos, etiquetaTitulo) {
	let html = "";

	for (const producto of productos) {
		html += crearTarjeta(producto, etiquetaTitulo);
	}

	return html;
}

// etiquetaTitulo es "h3" o "h4" según dónde se inserte la tarjeta,
// para no saltarse niveles en la jerarquía de encabezados.
function crearTarjeta(producto, etiquetaTitulo) {
	const imagen = `assets/img/productos/${producto.codigo}.jpg`;
	const precio = producto.precio_venta_clp.toLocaleString("es-CL");
	const stock = describirStock(producto);

	// Un producto agotado muestra el botón, pero deshabilitado.
	let deshabilitado = "";
	if (producto.stock === 0) {
		deshabilitado = "disabled";
	}

	return `
		<li>
			<article class="producto">
				<img class="producto-imagen" src="${imagen}" alt="${producto.nombre_producto}" loading="lazy">
				<${etiquetaTitulo} class="producto-nombre">${producto.nombre_producto}</${etiquetaTitulo}>
				<p class="producto-marca">${producto.marca}</p>
				<p class="producto-codigo">${producto.codigo} · ${producto.unidad}</p>
				<p class="producto-precio">$${precio}</p>
				<p class="producto-stock ${stock.clase}">${stock.texto}</p>
				<p class="producto-accion">
					<button class="boton boton-agregar" type="button"
						data-codigo="${producto.codigo}"
						data-stock="${producto.stock}"
						${deshabilitado}>Agregar al carrito</button>
				</p>
			</article>
		</li>
	`;
}

// El umbral de reposición viene del propio JSON (stock_minimo).
function describirStock(producto) {
	if (producto.stock === 0) {
		return { clase: "stock-agotado", texto: "Sin stock" };
	}

	if (producto.stock <= producto.stock_minimo) {
		return { clase: "stock-bajo", texto: `Stock bajo: quedan ${producto.stock}` };
	}

	return { clase: "stock-disponible", texto: `Disponible: ${producto.stock}` };
}

// Los productos cuya foto todavía no existe muestran una imagen genérica.
function usarImagenPorDefecto() {
	const imagenes = document.querySelectorAll(".producto-imagen");

	imagenes.forEach((imagen) => {
		function reemplazar() {
			imagen.src = IMAGEN_POR_DEFECTO;
		}

		// once: true quita el listener tras dispararse, así el reemplazo no se repite.
		imagen.addEventListener("error", reemplazar, { once: true });

		// Si la imagen ya terminó de fallar antes de llegar aquí, el evento no
		// volverá a dispararse: naturalWidth en 0 delata que no cargó.
		if (imagen.complete && imagen.naturalWidth === 0) {
			reemplazar();
		}
	});
}

// Delegación de eventos: un solo listener para los 170 botones de la página,
// incluidos los que todavía no existían cuando se registró.
document.addEventListener("click", function (evento) {
	const boton = evento.target.closest(".boton-agregar");

	if (!boton) {
		return;
	}

	const codigo = boton.dataset.codigo;
	const stock = Number(boton.dataset.stock);

	if (agregarAlCarrito(codigo, stock)) {
		avisarEnBoton(boton, "Agregado");
	} else {
		avisarEnBoton(boton, "Sin más stock");
	}
});

// Cambia el texto del botón un momento y lo devuelve a su estado original.
function avisarEnBoton(boton, mensaje) {
	if (boton.dataset.ocupado === "si") {
		return;
	}

	const textoOriginal = boton.textContent;
	boton.textContent = mensaje;
	boton.dataset.ocupado = "si";

	setTimeout(function () {
		boton.textContent = textoOriginal;
		boton.dataset.ocupado = "no";
	}, 1200);
}
