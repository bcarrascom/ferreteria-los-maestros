import { Alert, Button, Spinner } from "react-bootstrap";

// Estado de la carga del catálogo desde ms-catalogo: mientras carga muestra un indicador;
// si falló, un aviso con el botón para volver a intentarlo.
function AvisoCatalogo({ cargando, error, alReintentar }) {
  if (cargando) {
    return (
      <section className="container py-5 text-center" role="status">
        <Spinner animation="border" aria-hidden="true" />
        <p className="mt-3">Cargando catálogo…</p>
      </section>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="container mt-3 d-flex flex-wrap align-items-center gap-3" role="alert">
        <span>{error}</span>
        <Button variant="outline-danger" size="sm" onClick={alReintentar}>
          Reintentar
        </Button>
      </Alert>
    );
  }

  return null;
}

export default AvisoCatalogo;
