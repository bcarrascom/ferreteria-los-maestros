// Botón del filtro. Se ve relleno cuando su categoría está elegida.
function BotonCategoria({ etiqueta, activo, alHacerClic }) {
  let clases = "btn btn-outline-primary";

  if (activo) {
    clases = "btn btn-primary";
  }

  return (
    <button
      type="button"
      className={clases}
      aria-pressed={activo}
      onClick={alHacerClic}
    >
      {etiqueta}
    </button>
  );
}

export default BotonCategoria;
