// Menú hamburguesa. El estado vive en el atributo aria-expanded del botón:
// lo lee el lector de pantalla y también el CSS, así que no hace falta
// ninguna clase extra ni tocar estilos desde JavaScript.

const botonMenu = document.querySelector(".menu-boton");

botonMenu.addEventListener("click", function () {
	const estaAbierto = botonMenu.getAttribute("aria-expanded") === "true";
	botonMenu.setAttribute("aria-expanded", String(!estaAbierto));
});
