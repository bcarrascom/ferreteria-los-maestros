import GrillaProductos from "../components/GrillaProductos";
import { obtenerProductos } from "../utils/productos";

function Catalogo() {
  const productos = obtenerProductos();

  return (
    <section className="container py-5" aria-labelledby="titulo-catalogo">
      <h1 id="titulo-catalogo" className="mb-4">
        Catálogo
      </h1>
      <GrillaProductos productos={productos} />
    </section>
  );
}

export default Catalogo;
