import { Link } from "react-router-dom";
import { formatearPrecio } from "../utils/precio";

// Una fila de la tabla del carrito: producto, precio, cantidad, subtotal y quitar.
function FilaCarrito({ producto, cantidad, alCambiarCantidad, alQuitar }) {
  const nombre = producto.nombre_producto;
  const subtotal = producto.precio_venta_clp * cantidad;

  return (
    <tr>
      <td>
        <div className="d-flex align-items-center gap-3">
          <img
            src={`/img/productos/${producto.codigo}.jpg`}
            alt=""
            width="56"
            height="56"
            className="object-fit-contain border rounded"
          />
          <Link to={`/catalogo/${producto.codigo}`}>{nombre}</Link>
        </div>
      </td>
      <td>{formatearPrecio(producto.precio_venta_clp)}</td>
      <td>
        <div className="d-flex align-items-center gap-2">
          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            aria-label={`Restar una unidad de ${nombre}`}
            onClick={() => alCambiarCantidad(producto, cantidad - 1)}
          >
            −
          </button>
          <span>{cantidad}</span>
          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            aria-label={`Sumar una unidad de ${nombre}`}
            disabled={cantidad >= producto.stock}
            onClick={() => alCambiarCantidad(producto, cantidad + 1)}
          >
            +
          </button>
        </div>
      </td>
      <td>{formatearPrecio(subtotal)}</td>
      <td>
        <button
          type="button"
          className="btn btn-outline-danger btn-sm"
          aria-label={`Quitar ${nombre} del carrito`}
          onClick={() => alQuitar(producto.codigo)}
        >
          Quitar
        </button>
      </td>
    </tr>
  );
}

export default FilaCarrito;
