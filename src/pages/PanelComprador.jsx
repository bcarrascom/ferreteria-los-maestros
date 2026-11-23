import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { obtenerMiCuenta } from "../api/usuarios";

// "Mi cuenta" del cliente. El saludo sale del token; los datos completos se piden a GET /api/v1/usuarios/me.
function PanelComprador({ usuario }) {
  const [cuenta, setCuenta] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let vigente = true;
    obtenerMiCuenta()
      .then((datos) => vigente && setCuenta(datos))
      .catch(() => vigente && setError("No se pudieron cargar los datos de tu cuenta."));
    return () => {
      vigente = false;
    };
  }, []);

  return (
    <section className="container py-5" aria-labelledby="titulo-cuenta">
      <h1 id="titulo-cuenta">Hola, {usuario.nombre}</h1>
      <p>Tu cuenta es de cliente.</p>

      <h2 className="h5 mt-4">Mis datos</h2>
      {error && <p className="text-danger">{error}</p>}
      {!cuenta && !error && <p>Cargando tus datos…</p>}
      {cuenta && (
        <dl className="row mb-4">
          <dt className="col-sm-3">Nombre</dt>
          <dd className="col-sm-9">{cuenta.nombre} {cuenta.apellidos}</dd>
          <dt className="col-sm-3">RUT</dt>
          <dd className="col-sm-9">{cuenta.rut}</dd>
          <dt className="col-sm-3">Correo</dt>
          <dd className="col-sm-9">{cuenta.correo}</dd>
          <dt className="col-sm-3">Teléfono</dt>
          <dd className="col-sm-9">{cuenta.telefono ?? "—"}</dd>
          <dt className="col-sm-3">Dirección</dt>
          <dd className="col-sm-9">
            {[cuenta.direccion, cuenta.comuna, cuenta.region].filter(Boolean).join(", ") || "—"}
          </dd>
        </dl>
      )}

      <div className="d-flex flex-wrap gap-2">
        <Link to="/catalogo" className="btn btn-primary">Explorar productos</Link>
        <Link to="/carrito" className="btn btn-outline-primary">Ver mi carrito</Link>
      </div>
    </section>
  );
}

export default PanelComprador;
