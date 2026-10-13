import GrillaProductos from "./GrillaProductos";

// Muestra el título de una categoría y sus productos.
function SeccionCategoria({ categoria, productos, alAgregar }) {
  return (
    <section className="mb-5" aria-label={categoria}>
      <h2 className="h4 mb-3 pb-2 border-bottom border-primary">
        {categoria}
      </h2>
      <GrillaProductos productos={productos} alAgregar={alAgregar} />
    </section>
  );
}

export default SeccionCategoria;
