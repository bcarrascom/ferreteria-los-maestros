const titulo = document.querySelector("#Titulo-cartelera");

console.log(titulo.textContent);

// Carga el catálogo de productos y rellena cada panel .producto
// según el código indicado en su atributo data-codigo.
fetch("data/productos.json")
	.then((respuesta) => respuesta.json())
	.then((productos) => {
		const paneles = document.querySelectorAll(".producto[data-codigo]");

		paneles.forEach((panel) => {
			const codigo = panel.dataset.codigo;
			const producto = productos.find((p) => p.codigo === codigo);

			if (!producto) {
				console.warn(`Producto con código "${codigo}" no encontrado en productos.json`);
				return;
			}

			// DEFINIMOS PRODUCTOS =================================================================
			const imagen = producto.imagen || `assets/img/productos/${producto.codigo}.jpg`;
			panel.innerHTML = `
				<img class="producto-imagen" src="${imagen}" alt="${producto.nombre_producto}">
				<div class="producto-info">
					<h4 class="producto-nombre">${producto.nombre_producto}</h4>
					<span class="producto-marca">${producto.marca}</span>
					<span class="producto-precio">$${producto.precio_venta_clp.toLocaleString("es-CL")}</span>
				</div>
			`;
		});
	})
	.catch((error) => console.error("No se pudo cargar productos.json:", error));