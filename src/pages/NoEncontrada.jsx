import { Link } from "react-router-dom";

function NoEncontrada() {
  return (
    <section className="container py-5 text-center">
      <h1>Página no encontrada</h1>
      <p>La dirección ingresada no corresponde a una página disponible.</p>
      <Link to="/" className="btn btn-primary">Ir al inicio</Link>
    </section>
  );
}

export default NoEncontrada;