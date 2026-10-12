import SeccionCategoria from "../components/SeccionCategoria";
import {
  obtenerCategorias,
  obtenerProductosPorCategoria,
} from "../utils/productos";

function Catalogo() {
  const categorias = obtenerCategorias();

  return (
    <section className="container py-5" aria-labelledby="titulo-catalogo">
      <h1 id="titulo-catalogo" className="mb-4">
        Catálogo
      </h1>

      {categorias.map((categoria) => (
        <SeccionCategoria
          key={categoria}
          categoria={categoria}
          productos={obtenerProductosPorCategoria(categoria)}
        />
      ))}
    </section>
  );
}

export default Catalogo;
