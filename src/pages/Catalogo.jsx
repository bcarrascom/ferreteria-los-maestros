import FiltroCategorias from "../components/FiltroCategorias";
import SeccionCategoria from "../components/SeccionCategoria";
import { useLocalStorage } from "../hooks/useLocalStorage";
import {
  obtenerCategorias,
  obtenerProductosPorCategoria,
} from "../utils/productos";

// Nombre con que se guarda la categoría elegida en localStorage.
const CLAVE_CATEGORIA = "categoriaActiva";

function Catalogo({ alAgregar }) {
  const categorias = obtenerCategorias();

  // Si la categoría guardada ya no existe en el catálogo, vuelve a "Todas".
  function validarCategoria(guardada) {
    if (categorias.includes(guardada)) {
      return guardada;
    }
    return "Todas";
  }

  // Recuerda la última categoría elegida, aunque se recargue la página.
  const [categoriaActiva, setCategoriaActiva] = useLocalStorage(
    CLAVE_CATEGORIA,
    "Todas",
    validarCategoria
  );

  // Con "Todas" se muestran las 9; si no, solo la elegida.
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
          productos={obtenerProductosPorCategoria(categoria)}
          alAgregar={alAgregar}
        />
      ))}
    </section>
  );
}

export default Catalogo;
