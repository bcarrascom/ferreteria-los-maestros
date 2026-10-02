import { useEffect, useState } from "react";

const distancia_opacidad = 350;
const parallax = 0.4;

function Hero() {
  const [desplazamiento, setDesplazamiento] = useState(0);

  // UseEffect se usa para sincronizar la app a datos externos
  useEffect(() => {
    const consulta = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (consulta.matches) return;

    function alHacerScroll() {
      setDesplazamiento(window.scrollY);
    }

    alHacerScroll();
    window.addEventListener("scroll", alHacerScroll, { passive: true });

    // Se ejecuta al desmontar: evita que quede el listener colgado.
    return () => window.removeEventListener("scroll", alHacerScroll);
  }, []);

  const avance = Math.min(desplazamiento / distancia_opacidad, 1);
  const estiloTexto = {
    opacity: 1 - avance,
    transform: `translateY(${desplazamiento * parallax}px)`,
  };



  return (
    <section id="inicio" className="hero" aria-labelledby="titulo-hero">
      <h1 id="titulo-hero" style={estiloTexto}>
        Ferretería Los Maestros
      </h1>
      <p style={estiloTexto}>
        22 años surtiendo a maestros y contratistas de La Serena. Revisa el
        stock en línea antes de venir.
      </p>
    </section>
  );
}

export default Hero;
