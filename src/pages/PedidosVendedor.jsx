import { formatearPrecio } from "../utils/precio";

const pedidosDemostracion = [
  { codigo: "PED-1001", cliente: "Camila Compradora", productos: "Cemento gris × 2", total: 11980, estado: "Recibido" },
  { codigo: "PED-1002", cliente: "Javier González", productos: "Taladro percutor × 1", total: 45990, estado: "En preparación" },
  { codigo: "PED-1003", cliente: "María Soto", productos: "Pintura blanca × 3", total: 32970, estado: "Listo para retiro" },
];

function PedidosVendedor() {
  return (
    <section className="container py-5" aria-labelledby="titulo-pedidos">
      <h1 id="titulo-pedidos">Órdenes y pedidos</h1>
      <p>Lista de pedidos de demostración para el panel de administración y ventas.</p>
      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead>
            <tr><th>Pedido</th><th>Cliente</th><th>Productos</th><th>Total</th><th>Estado</th></tr>
          </thead>
          <tbody>
            {pedidosDemostracion.map((pedido) => (
              <tr key={pedido.codigo}>
                <td>{pedido.codigo}</td>
                <td>{pedido.cliente}</td>
                <td>{pedido.productos}</td>
                <td>{formatearPrecio(pedido.total)}</td>
                <td>{pedido.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="small text-body-secondary">
        La tienda todavía no tiene un checkout conectado que genere pedidos reales.
      </p>
    </section>
  );
}

export default PedidosVendedor;