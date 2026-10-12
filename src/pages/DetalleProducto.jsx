import { Link, useParams } from "react-router-dom";
import { formatearPrecio } from "../utils/precio";
import { buscarProductoPorCodigo } from "../utils/productos";

// Página de un solo producto. El código viene en la URL: /catalogo/MC001
function DetalleProducto() {
  const parametros = useParams(); // devuelve un objeto con los parámetros de la URL
  const producto = buscarProductoPorCodigo(parametros.codigo);

  if (!producto) {  // si no existe el producto, mostramos un mensaje de error
    return (
      <section className="container py-5 text-center">
        <h1>Producto no encontrado</h1>
        <p>No existe un producto con el código {parametros.codigo}.</p>
        <Link to="/catalogo" className="btn btn-primary">
          Volver al catálogo
        </Link>
      </section>
    );
  }

  const imagen = `/img/productos/${producto.codigo}.jpg`;

  return (
    <section className="container py-5" aria-labelledby="titulo-producto">
      <p>
        <Link to="/catalogo">← Volver al catálogo</Link>
      </p>

      <div className="row g-5 align-items-center">
        <div className="col-12 col-md-6">
          <img
            className="img-fluid border rounded detalle-producto-imagen"
            src={imagen}
            alt={producto.nombre_producto}
          />
        </div>

        <div className="col-12 col-md-6">
          <p className="text-body-secondary mb-1">
            {producto.categoria} · {producto.subcategoria}
          </p>
          <h1 id="titulo-producto" className="h2">
            {producto.nombre_producto}
          </h1>
          <p className="lead">{producto.marca}</p>
          <p className="h3 text-primary mb-4">
            {formatearPrecio(producto.precio_venta_clp)}
          </p>

          <dl className="row mb-0">
            <dt className="col-5">Código</dt>
            <dd className="col-7">{producto.codigo}</dd>
            <dt className="col-5">Unidad de venta</dt>
            <dd className="col-7">{producto.unidad}</dd>
            <dt className="col-5">Stock disponible</dt>
            <dd className="col-7">{producto.stock}</dd>
          </dl>
        </div>
      </div>
    </section>
  );
}

export default DetalleProducto;
