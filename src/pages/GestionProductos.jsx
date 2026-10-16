import { useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { formatearPrecio } from "../utils/precio";

const formularioInicial = {
  codigo: "",
  nombre_producto: "",
  categoria: "",
  subcategoria: "General",
  marca: "",
  unidad: "Unidad",
  precio_venta_clp: "",
  stock: "",
  stock_minimo: "0",
};

function GestionProductos({ productos, alGuardarProductos }) {
  const [datos, setDatos] = useState(formularioInicial);
  const [codigoEditando, setCodigoEditando] = useState("");
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  function cambiar(evento) {
    const { name, value } = evento.target;
    setDatos({ ...datos, [name]: value });
  }

  function limpiarFormulario() {
    setDatos(formularioInicial);
    setCodigoEditando("");
  }

  function guardar(evento) {
    evento.preventDefault();
    const codigo = datos.codigo.trim().toUpperCase();
    const nombre = datos.nombre_producto.trim();
    const precio = Number(datos.precio_venta_clp);
    const stock = Number(datos.stock);

    if (
      !codigo ||
      !nombre ||
      !datos.categoria.trim() ||
      datos.precio_venta_clp === "" ||
      datos.stock === "" ||
      !Number.isFinite(precio) ||
      !Number.isFinite(stock) ||
      precio < 0 ||
      stock < 0
    ) {
      setError("Completa código, nombre, categoría y valores válidos para precio y stock.");
      return;
    }

    if (codigoEditando !== codigo && productos.some((producto) => producto.codigo === codigo)) {
      setError("Ya existe un producto con ese código.");
      return;
    }

    const producto = {
      codigo,
      nombre_producto: nombre,
      categoria: datos.categoria.trim(),
      subcategoria: datos.subcategoria.trim() || "General",
      marca: datos.marca.trim() || "Sin marca",
      unidad: datos.unidad.trim() || "Unidad",
      precio_venta_clp: precio,
      precio_compra_clp: 0,
      stock,
      stock_minimo: Number(datos.stock_minimo) || 0,
    };

    const listaNueva = codigoEditando
      ? productos.map((item) => item.codigo === codigoEditando ? producto : item)
      : [...productos, producto];

    alGuardarProductos(listaNueva);
    limpiarFormulario();
    setError("");
    setMensaje(codigoEditando ? "Producto actualizado." : "Producto agregado al catálogo.");
  }

  function editar(producto) {
    setCodigoEditando(producto.codigo);
    setDatos({
      codigo: producto.codigo,
      nombre_producto: producto.nombre_producto,
      categoria: producto.categoria,
      subcategoria: producto.subcategoria || "General",
      marca: producto.marca || "",
      unidad: producto.unidad || "Unidad",
      precio_venta_clp: String(producto.precio_venta_clp),
      stock: String(producto.stock),
      stock_minimo: String(producto.stock_minimo || 0),
    });
    setMensaje("");
  }

  function quitar(codigo) {
    alGuardarProductos(productos.filter((producto) => producto.codigo !== codigo));
    if (codigoEditando === codigo) limpiarFormulario();
    setMensaje("Producto quitado del catálogo.");
  }

  return (
    <section className="container py-5" aria-labelledby="titulo-productos-vendedor">
      <h1 id="titulo-productos-vendedor">Administrar productos</h1>
      <p>Los cambios se guardan en este navegador y también se reflejan en el catálogo.</p>
      {error && <Alert variant="danger" role="alert">{error}</Alert>}
      {mensaje && <Alert variant="success" role="status">{mensaje}</Alert>}
      <Form onSubmit={guardar} noValidate className="row g-3 mb-5">
        <Form.Group className="col-12 col-md-3" controlId="producto-codigo">
          <Form.Label>Código</Form.Label>
          <Form.Control name="codigo" value={datos.codigo} onChange={cambiar} disabled={Boolean(codigoEditando)} />
        </Form.Group>
        <Form.Group className="col-12 col-md-5" controlId="producto-nombre">
          <Form.Label>Nombre</Form.Label>
          <Form.Control name="nombre_producto" value={datos.nombre_producto} onChange={cambiar} />
        </Form.Group>
        <Form.Group className="col-12 col-md-4" controlId="producto-categoria">
          <Form.Label>Categoría</Form.Label>
          <Form.Control name="categoria" value={datos.categoria} onChange={cambiar} />
        </Form.Group>
        <Form.Group className="col-12 col-md-3" controlId="producto-marca">
          <Form.Label>Marca</Form.Label>
          <Form.Control name="marca" value={datos.marca} onChange={cambiar} />
        </Form.Group>
        <Form.Group className="col-12 col-md-3" controlId="producto-unidad">
          <Form.Label>Unidad</Form.Label>
          <Form.Control name="unidad" value={datos.unidad} onChange={cambiar} />
        </Form.Group>
        <Form.Group className="col-12 col-md-2" controlId="producto-precio">
          <Form.Label>Precio CLP</Form.Label>
          <Form.Control type="number" min="0" name="precio_venta_clp" value={datos.precio_venta_clp} onChange={cambiar} />
        </Form.Group>
        <Form.Group className="col-12 col-md-2" controlId="producto-stock">
          <Form.Label>Stock</Form.Label>
          <Form.Control type="number" min="0" name="stock" value={datos.stock} onChange={cambiar} />
        </Form.Group>
        <Form.Group className="col-12 col-md-2" controlId="producto-stock-minimo">
          <Form.Label>Stock mínimo</Form.Label>
          <Form.Control type="number" min="0" name="stock_minimo" value={datos.stock_minimo} onChange={cambiar} />
        </Form.Group>
        <div className="col-12 d-flex gap-2">
          <Button type="submit">{codigoEditando ? "Guardar cambios" : "Agregar producto"}</Button>
          {codigoEditando && (
            <Button type="button" variant="outline-secondary" onClick={limpiarFormulario}>
              Cancelar
            </Button>
          )}
        </div>
      </Form>

      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead>
            <tr><th>Código</th><th>Producto</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto.codigo}>
                <td>{producto.codigo}</td>
                <td>{producto.nombre_producto}</td>
                <td>{producto.categoria}</td>
                <td>{formatearPrecio(producto.precio_venta_clp)}</td>
                <td>{producto.stock}</td>
                <td>
                  <div className="d-flex gap-2">
                    <Button size="sm" variant="outline-primary" onClick={() => editar(producto)}>Editar</Button>
                    <Button size="sm" variant="outline-danger" onClick={() => quitar(producto.codigo)}>Quitar</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default GestionProductos;