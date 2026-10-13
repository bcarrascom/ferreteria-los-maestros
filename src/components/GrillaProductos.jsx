import TarjetaProducto from "./TarjetaProducto";

// Muestra una lista de productos en una grilla responsiva.
function GrillaProductos({ productos, alAgregar }) {
  return (
    <ul className="row g-4 list-unstyled">
      {productos.map((producto) => (
        <li key={producto.codigo} className="col-12 col-sm-6 col-lg-3">
          <TarjetaProducto producto={producto} alAgregar={alAgregar} />
        </li>
      ))}
    </ul>
  );
}

export default GrillaProductos;
