import { Link } from "react-router-dom";

function PanelComprador({ usuario }) {
  return (
    <section className="container py-5" aria-labelledby="titulo-cuenta">
      <h1 id="titulo-cuenta">Hola, {usuario.nombre}</h1>
      <p>Tu cuenta tiene el rol de comprador.</p>
      <div className="d-flex flex-wrap gap-2">
        <Link to="/catalogo" className="btn btn-primary">Explorar productos</Link>
        <Link to="/carrito" className="btn btn-outline-primary">Ver mi carrito</Link>
      </div>
    </section>
  );
}

export default PanelComprador;