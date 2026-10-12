import BotonCategoria from "./BotonCategoria";

// Fila de botones para elegir qué categoría mostrar.
function FiltroCategorias({ categorias, categoriaActiva, alCambiarCategoria }) {
  return (
    <div
      role="group"
      aria-label="Filtrar por categoría"
      className="d-flex flex-wrap gap-2 mb-5"
    >
      <BotonCategoria
        etiqueta="Todas"
        activo={categoriaActiva === "Todas"}
        alHacerClic={() => alCambiarCategoria("Todas")}
      />

      {categorias.map((categoria) => (
        <BotonCategoria
          key={categoria}
          etiqueta={categoria}
          activo={categoriaActiva === categoria}
          alHacerClic={() => alCambiarCategoria(categoria)}
        />
      ))}
    </div>
  );
}

export default FiltroCategorias;
