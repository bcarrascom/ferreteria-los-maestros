import { Link } from "react-router-dom";

function PanelAdministrador({ cantidadUsuarios, cantidadProductos }) {
  return (
    <section className="container py-5" aria-labelledby="titulo-admin">
      <h1 id="titulo-admin">Panel de administración</h1>
      <p>Desde aquí puedes revisar las secciones de administración de la ferretería.</p>
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-6">
          <article className="card h-100">
            <div className="card-body">
              <h2 className="h5">Usuarios</h2>
              <p>{cantidadUsuarios} cuentas registradas</p>
              <Link to="/admin/usuarios" className="btn btn-primary">
                Gestionar usuarios y roles
              </Link>
            </div>
          </article>
        </div>
        <div className="col-12 col-md-6">
          <article className="card h-100">
            <div className="card-body">
              <h2 className="h5">Productos</h2>
              <p>{cantidadProductos} productos en el catálogo</p>
              <Link to="/admin/productos" className="btn btn-outline-primary">
                Administrar productos
              </Link>
            </div>
          </article>
        </div>
        <div className="col-12 col-md-6">
          <article className="card h-100">
            <div className="card-body">
              <h2 className="h5">Órdenes</h2>
              <p>Consulta los pedidos de demostración.</p>
              <Link to="/admin/pedidos" className="btn btn-outline-primary">
                Ver órdenes
              </Link>
            </div>
          </article>
        </div>
      </div>
      <h2 className="h5">Otras vistas sugeridas en el Anexo</h2>
      <p>Órdenes, categorías, reportes y perfil forman parte del mapa administrativo propuesto.</p>
    </section>
  );
}

export default PanelAdministrador;