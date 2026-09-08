// Ferretería Los Maestros - efecto de desvanecido del texto del hero al bajar.

document.addEventListener("DOMContentLoaded", function () {
	const textosHero = document.querySelectorAll(".hero .hero-texto");
	if (textosHero.length === 0) return;

	// Si el usuario pidió menos animaciones en su sistema, no aplicamos el efecto.
	if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

	const distanciaDesvanecido = 350; // px de scroll hasta que el texto desaparece

	function actualizarHero() {
		const desplazamiento = window.scrollY;
		const avance = Math.min(desplazamiento / distanciaDesvanecido, 1);

		textosHero.forEach(function (texto) {
			texto.style.opacity = String(1 - avance);
			texto.style.transform = "translateY(" + desplazamiento * 0.4 + "px)";
		});
	}

	actualizarHero();
	window.addEventListener("scroll", actualizarHero, { passive: true });
});
