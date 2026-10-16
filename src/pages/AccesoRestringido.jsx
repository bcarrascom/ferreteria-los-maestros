import { Link } from "react-router-dom";

function AccesoRestringido({ usuario }) {
  return (
    <section className="container py-5 text-center">
      <h1>Esta vista no está disponible para tu rol</h1>
      <p>{usuario ? `Tu cuenta tiene el rol ${usuario.rol}.` : "Inicia sesión para continuar."}</p>
      <Link to={usuario ? "/" : "/acceso"} className="btn btn-primary">
        {usuario ? "Volver a la tienda" : "Iniciar sesión"}
      </Link>
    </section>
  );
}

export default AccesoRestringido;