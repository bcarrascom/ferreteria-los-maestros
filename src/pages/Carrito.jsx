import { Link } from "react-router-dom";
import FilaCarrito from "../components/FilaCarrito";
import { calcularTotal } from "../utils/carrito";
import { formatearPrecio } from "../utils/precio";
import { buscarProductoPorCodigo } from "../utils/productos";

function Carrito({ carrito, productos, alCambiarCantidad, alQuitar, alVaciar }) {
  if (carrito.length === 0) {
    return (
      <section className="container py-5 text-center">
        <h1>Tu carrito está vacío</h1>
        <p>Agrega productos desde el catálogo.</p>
        <Link to="/catalogo" className="btn btn-primary">
          Ir al catálogo
        </Link>
      </section>
    );
  }

  return (
    <section className="container py-5" aria-labelledby="titulo-carrito">
      <h1 id="titulo-carrito" className="mb-4">
        Carrito de compras
      </h1>

      <div className="table-responsive">
        <table className="table align-middle">
          <thead>
            <tr>
              <th scope="col">Producto</th>
              <th scope="col">Precio</th>
              <th scope="col">Cantidad</th>
              <th scope="col">Subtotal</th>
              <th scope="col"><span className="visually-hidden">Acciones</span></th>
            </tr>
          </thead>
          <tbody>
            {carrito.map((item) => {
              const producto = buscarProductoPorCodigo(item.codigo, productos);

              // Si el producto ya no existe, no se muestra.
              if (!producto) {
                return null;
              }

              return (
                <FilaCarrito
                  key={item.codigo}
                  producto={producto}
                  cantidad={item.cantidad}
                  alCambiarCantidad={alCambiarCantidad}
                  alQuitar={alQuitar}
                />
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row" colSpan="3">Total</th>
              <td colSpan="2" className="fw-bold">
                {formatearPrecio(calcularTotal(carrito, productos))}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <button type="button" className="btn btn-outline-danger" onClick={alVaciar}>
        Vaciar carrito
      </button>
    </section>
  );
}

export default Carrito;
