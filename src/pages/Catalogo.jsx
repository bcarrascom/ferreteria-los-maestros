import { useState } from "react";
import FiltroCategorias from "../components/FiltroCategorias";
import SeccionCategoria from "../components/SeccionCategoria";
import {
  obtenerCategorias,
  obtenerProductosPorCategoria,
} from "../utils/productos";

function Catalogo({ alAgregar, productos }) {
  const categorias = obtenerCategorias(productos);
  const [categoriaActiva, setCategoriaActiva] = useState("Todas");

  // Con "Todas" se muestran las categorías; si no, solo la elegida.
  let categoriasVisibles = categorias;

  if (categoriaActiva !== "Todas") {
    categoriasVisibles = [categoriaActiva];
  }

  return (
    <section className="container py-5" aria-labelledby="titulo-catalogo">
      <h1 id="titulo-catalogo" className="mb-4">
        Catálogo
      </h1>

      <FiltroCategorias
        categorias={categorias}
        categoriaActiva={categoriaActiva}
        alCambiarCategoria={setCategoriaActiva}
      />

      {categoriasVisibles.map((categoria) => (
        <SeccionCategoria
          key={categoria}
          categoria={categoria}
          productos={obtenerProductosPorCategoria(categoria, productos)}
          alAgregar={alAgregar}
        />
      ))}
    </section>
  );
}

export default Catalogo;