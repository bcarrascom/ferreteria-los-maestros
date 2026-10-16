import { Link } from "react-router-dom";

function PanelVendedor({ usuario, cantidadProductos }) {
  return (
    <section className="container py-5" aria-labelledby="titulo-vendedor">
      <h1 id="titulo-vendedor">Panel del vendedor</h1>
      <p>Hola, {usuario.nombre}. Desde aquí puedes administrar productos y consultar pedidos.</p>
      <div className="row g-3">
        <div className="col-12 col-md-6">
          <article className="card h-100">
            <div className="card-body">
              <h2 className="h5">Productos</h2>
              <p>{cantidadProductos} productos en el catálogo</p>
              <Link to="/vendedor/productos" className="btn btn-primary">
                Administrar productos
              </Link>
            </div>
          </article>
        </div>
        <div className="col-12 col-md-6">
          <article className="card h-100">
            <div className="card-body">
              <h2 className="h5">Pedidos</h2>
              <p>Consulta los pedidos de demostración.</p>
              <Link to="/vendedor/pedidos" className="btn btn-outline-primary">
                Ver pedidos
              </Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

export default PanelVendedor;