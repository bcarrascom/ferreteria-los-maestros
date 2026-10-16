import { formatearPrecio } from "../utils/precio";
import { Link } from "react-router-dom";

// Muestra un producto. Recibe el objeto completo por props.
function TarjetaProducto({ producto, alAgregar }) {
  const imagen = `/img/productos/${producto.codigo}.jpg`;

  return (
    <article className="card h-100 tarjeta-producto">
      <img
        className="card-img-top"
        src={imagen}
        alt={producto.nombre_producto}
        onError={(evento) => {
          evento.currentTarget.src = "/img/logo.jpg";
        }}
      />
      <div className="card-body d-flex flex-column">
        <h3 className="h6 card-title">
          <Link
            to={`/catalogo/${producto.codigo}`}
            className="stretched-link text-reset text-decoration-none"
          >
            {producto.nombre_producto}
          </Link>
        </h3>
        <p className="card-text text-body-secondary mb-1">{producto.marca}</p>
        <p className="card-text fw-bold">
          {formatearPrecio(producto.precio_venta_clp)}
        </p>
        <button
          type="button"
          className="btn btn-primary btn-sm mt-auto position-relative z-2"
          aria-label={`Agregar ${producto.nombre_producto} al carrito`}
          disabled={producto.stock === 0}
          onClick={() => alAgregar(producto)}
        >
          Agregar al carrito
        </button>
      </div>
    </article>
  );
}

export default TarjetaProducto;