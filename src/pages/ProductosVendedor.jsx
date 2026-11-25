import { useState } from "react";
import { Alert, Badge, Form } from "react-bootstrap";
import { formatearPrecio } from "../utils/precio";

// Busca por nombre o código, sin importar mayúsculas
function coincide(producto, texto) {
  const buscado = texto.trim().toLowerCase();
  if (buscado === "") {
    return true;
  }
  return (
    producto.nombre_producto.toLowerCase().includes(buscado) ||
    producto.codigo.toLowerCase().includes(buscado)
  );
}

// Vista del VENDEDOR: lista de productos de solo lectura (Anexo 1: "ver lista y detalle de productos").
// Sirve para responder las consultas de stock por teléfono. No tiene botones para editar: además,
// el backend responde 403 si un vendedor intenta crear, editar o eliminar.
function ProductosVendedor({ productos }) {
  const [texto, setTexto] = useState("");
  const [soloStockBajo, setSoloStockBajo] = useState(false);

  const cantidadStockBajo = productos.filter((producto) => producto.stock_bajo).length;

  const visibles = productos.filter((producto) => {
    if (soloStockBajo && !producto.stock_bajo) {
      return false;
    }
    return coincide(producto, texto);
  });

  return (
    <section className="container py-5" aria-labelledby="titulo-productos-vendedor">
      <h1 id="titulo-productos-vendedor">Productos</h1>
      <p>Consulta de precios y stock en tiempo real. Esta vista es de solo lectura.</p>

      {cantidadStockBajo > 0 && (
        <Alert variant="warning">
          {cantidadStockBajo} {cantidadStockBajo === 1 ? "producto tiene" : "productos tienen"} stock bajo
          (igual o menor al stock mínimo).
        </Alert>
      )}

      <div className="row g-3 align-items-end mb-4">
        <Form.Group className="col-12 col-md-6" controlId="buscar-producto-vendedor">
          <Form.Label>Buscar por nombre o código</Form.Label>
          <Form.Control type="search" value={texto} onChange={(evento) => setTexto(evento.target.value)} />
        </Form.Group>
        <div className="col-12 col-md-6">
          <Form.Check
            type="switch"
            id="solo-stock-bajo"
            label="Mostrar solo stock bajo"
            checked={soloStockBajo}
            onChange={(evento) => setSoloStockBajo(evento.target.checked)}
          />
        </div>
      </div>

      {visibles.length === 0 ? (
        <p>No hay productos que coincidan con la búsqueda.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th scope="col">Código</th>
                <th scope="col">Producto</th>
                <th scope="col">Categoría</th>
                <th scope="col">Precio</th>
                <th scope="col">Stock</th>
                <th scope="col">Stock mínimo</th>
                <th scope="col">Estado</th>
              </tr>
            </thead>
            <tbody>
              {visibles.map((producto) => (
                <tr key={producto.codigo}>
                  <td>{producto.codigo}</td>
                  <td>{producto.nombre_producto}</td>
                  <td>{producto.categoria}</td>
                  <td>{formatearPrecio(producto.precio_venta_clp)}</td>
                  <td>{producto.stock}</td>
                  <td>{producto.stock_minimo}</td>
                  <td>
                    {producto.stock_bajo ? (
                      <Badge bg="warning" text="dark">Stock bajo</Badge>
                    ) : (
                      <Badge bg="success">Disponible</Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default ProductosVendedor;
