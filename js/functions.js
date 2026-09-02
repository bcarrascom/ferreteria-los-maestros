/* Ferretería Los Maestros - comportamiento propio del sitio */

document.addEventListener('DOMContentLoaded', function () {
	var caption = document.querySelector('.hero-banner .hero-caption');
	if (!caption) return;

	var fadeDistance = 350; // px de scroll hasta que el texto desaparece por completo

	function updateHeroFade() {
		var scrolled = window.pageYOffset || document.documentElement.scrollTop;
		var progress = Math.min(Math.max(scrolled / fadeDistance, 0), 1);

		caption.style.opacity = String(1 - progress);
		caption.style.transform = 'translateY(' + (scrolled * 0.4) + 'px)';
	}

	updateHeroFade();
	window.addEventListener('scroll', updateHeroFade, { passive: true });
});
