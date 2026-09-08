// Rellena cada <article class="producto"> con los datos del producto
// cuyo código coincide con su atributo data-codigo.

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

			const imagen = `assets/img/productos/${producto.codigo}.jpg`;
			const precio = producto.precio_venta_clp.toLocaleString("es-CL");

			panel.innerHTML = `
				<img class="producto-imagen" src="${imagen}" alt="${producto.nombre_producto}">
				<h3 class="producto-nombre">${producto.nombre_producto}</h3>
				<p class="producto-marca">${producto.marca}</p>
				<p class="producto-precio">$${precio}</p>
			`;
		});
	})
	.catch((error) => console.error("No se pudo cargar productos.json:", error));
