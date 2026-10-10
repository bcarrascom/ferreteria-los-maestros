import { formatearPrecio } from "../utils/precio";

// Muestra un producto. Recibe el objeto completo por props.
function TarjetaProducto({ producto }) {
  // Las imágenes se llaman igual que el código: MC001.jpg, PT001.jpg...
  const imagen = `/img/productos/${producto.codigo}.jpg`;

  return (
    <article className="card h-100 tarjeta-producto">
      <img
        className="card-img-top"
        src={imagen}
        alt={producto.nombre_producto}
      />
      <div className="card-body">
        <h3 className="h6 card-title">{producto.nombre_producto}</h3>
        <p className="card-text text-body-secondary mb-1">{producto.marca}</p>
        <p className="card-text fw-bold">
          {formatearPrecio(producto.precio_venta_clp)}
        </p>
      </div>
    </article>
  );
}

export default TarjetaProducto;
