import { useEffect, useState } from "react";
import { Alert, Badge, Button, Form } from "react-bootstrap";
import { listarCategorias } from "../api/categorias";
import { actualizarProducto, crearProducto, eliminarProducto } from "../api/productos";
import CampoFormulario from "../components/CampoFormulario";
import { formatearPrecio } from "../utils/precio";

const formularioInicial = {
  codigo: "",
  nombre_producto: "",
  categoriaId: "",
  subcategoria: "",
  marca: "",
  unidad: "Unidad",
  precio_venta_clp: "",
  precio_compra_clp: "",
  stock: "",
  stock_minimo: "0",
};

// El backend nombra los campos en camelCase; el formulario usa los nombres del front.
// Sirve para mostrar cada error de "detalles" (400) debajo de su campo.
const campoDelFormulario = {
  nombre: "nombre_producto",
  precioVenta: "precio_venta_clp",
  precioCompra: "precio_compra_clp",
  stockMinimo: "stock_minimo",
};

function traducirDetalles(detalles) {
  const errores = {};
  Object.entries(detalles ?? {}).forEach(([campo, mensaje]) => {
    errores[campoDelFormulario[campo] ?? campo] = mensaje;
  });
  return errores;
}

function Campo(props) {
  return <CampoFormulario idFormulario="producto" className="col-12 col-md-4" {...props} />;
}

// Gestión de productos contra ms-catalogo (solo ADMINISTRADOR). Cada guardar o eliminar llama a la API
// y después recarga el catálogo de App con alCambiarCatalogo. Las reglas (código único, precios, categoría
// existente) las aplica el backend; aquí se muestra su mensaje.
function GestionProductos({ productos, alCambiarCatalogo }) {
  const [categorias, setCategorias] = useState([]);
  const [datos, setDatos] = useState(formularioInicial);
  const [codigoEditando, setCodigoEditando] = useState("");
  const [errores, setErrores] = useState({});
  const [error, setError] = useState("");
  const [aviso, setAviso] = useState("");
  const [guardando, setGuardando] = useState(false);

  // Las categorías vienen de la API: el backend pide categoriaId, no el nombre
  useEffect(() => {
    let vigente = true;
    listarCategorias()
      .then((lista) => vigente && setCategorias(lista))
      .catch(() => vigente && setError("No se pudieron cargar las categorías."));
    return () => {
      vigente = false;
    };
  }, []);

  function cambiar(evento) {
    const { name, value } = evento.target;
    setDatos({ ...datos, [name]: value });
  }

  function limpiarFormulario() {
    setDatos(formularioInicial);
    setCodigoEditando("");
    setErrores({});
  }

  // Ejecuta una llamada a la API, recarga el catálogo y muestra el resultado
  async function ejecutar(accion, mensajeExito) {
    setError("");
    setAviso("");
    setErrores({});
    setGuardando(true);
    try {
      await accion();
      await alCambiarCatalogo();
      setAviso(mensajeExito);
      return true;
    } catch (errorApi) {
      setError(errorApi.mensaje ?? "No se pudo conectar con el servidor.");
      setErrores(traducirDetalles(errorApi.detalles));
      return false;
    } finally {
      setGuardando(false);
    }
  }

  async function guardar(evento) {
    evento.preventDefault();
    let guardado;
    if (codigoEditando) {
      guardado = await ejecutar(() => actualizarProducto(codigoEditando, datos), "Producto actualizado.");
    } else {
      guardado = await ejecutar(() => crearProducto(datos), "Producto agregado al catálogo.");
    }
    if (guardado) {
      limpiarFormulario();
    }
  }

  function editar(producto) {
    setCodigoEditando(producto.codigo);
    setDatos({
      codigo: producto.codigo,
      nombre_producto: producto.nombre_producto,
      categoriaId: String(producto.categoriaId ?? ""),
      subcategoria: producto.subcategoria ?? "",
      marca: producto.marca ?? "",
      unidad: producto.unidad ?? "",
      precio_venta_clp: String(producto.precio_venta_clp),
      precio_compra_clp: String(producto.precio_compra_clp ?? ""),
      stock: String(producto.stock),
      stock_minimo: String(producto.stock_minimo ?? 0),
    });
    setErrores({});
    setAviso("");
    setError("");
  }

  async function eliminar(producto) {
    if (!window.confirm(`¿Eliminar ${producto.nombre_producto}?`)) {
      return;
    }
    const eliminado = await ejecutar(() => eliminarProducto(producto.codigo), "Producto eliminado del catálogo.");
    if (eliminado && codigoEditando === producto.codigo) {
      limpiarFormulario();
    }
  }

  const propiedadesCampo = { datos, errores, alCambiar: cambiar };

  return (
    <section className="container py-5" aria-labelledby="titulo-gestion-productos">
      <h1 id="titulo-gestion-productos">Administrar productos</h1>
      <p>Los cambios se guardan en el servidor y se reflejan de inmediato en la tienda.</p>
      {error && <Alert variant="danger" role="alert">{error}</Alert>}
      {aviso && <Alert variant="success" role="status">{aviso}</Alert>}

      <Form onSubmit={guardar} noValidate className="row g-3 mb-5">
        <Form.Group className="col-12 col-md-4" controlId="codigo-producto">
          <Form.Label>Código</Form.Label>
          <Form.Control
            name="codigo"
            value={datos.codigo}
            onChange={cambiar}
            disabled={Boolean(codigoEditando)}
            isInvalid={Boolean(errores.codigo)}
          />
          <Form.Control.Feedback type="invalid">{errores.codigo}</Form.Control.Feedback>
        </Form.Group>
        <Campo nombre="nombre_producto" etiqueta="Nombre" {...propiedadesCampo} />
        <Form.Group className="col-12 col-md-4" controlId="categoria-producto">
          <Form.Label>Categoría</Form.Label>
          <Form.Select
            name="categoriaId"
            value={datos.categoriaId}
            onChange={cambiar}
            isInvalid={Boolean(errores.categoriaId)}
          >
            <option value="">Elige una categoría</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
            ))}
          </Form.Select>
          <Form.Control.Feedback type="invalid">{errores.categoriaId}</Form.Control.Feedback>
        </Form.Group>
        <Campo nombre="subcategoria" etiqueta="Subcategoría" {...propiedadesCampo} />
        <Campo nombre="marca" etiqueta="Marca" {...propiedadesCampo} />
        <Campo nombre="unidad" etiqueta="Unidad" {...propiedadesCampo} />
        <Campo nombre="precio_venta_clp" etiqueta="Precio de venta" tipo="number" {...propiedadesCampo} />
        <Campo nombre="precio_compra_clp" etiqueta="Precio de compra" tipo="number" {...propiedadesCampo} />
        <Campo nombre="stock" etiqueta="Stock" tipo="number" {...propiedadesCampo} />
        <Campo nombre="stock_minimo" etiqueta="Stock mínimo" tipo="number" {...propiedadesCampo} />
        <div className="col-12 d-flex gap-2">
          <Button type="submit" disabled={guardando}>
            {codigoEditando ? "Guardar cambios" : "Agregar producto"}
          </Button>
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
            <tr>
              <th scope="col">Código</th>
              <th scope="col">Producto</th>
              <th scope="col">Categoría</th>
              <th scope="col">Precio venta</th>
              <th scope="col">Precio compra</th>
              <th scope="col">Stock</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto.codigo}>
                <td>{producto.codigo}</td>
                <td>{producto.nombre_producto}</td>
                <td>{producto.categoria}</td>
                <td>{formatearPrecio(producto.precio_venta_clp)}</td>
                <td>
                  {typeof producto.precio_compra_clp === "number" ? formatearPrecio(producto.precio_compra_clp) : "—"}
                </td>
                <td>
                  {producto.stock}{" "}
                  {producto.stock_bajo && <Badge bg="warning" text="dark">Stock bajo</Badge>}
                </td>
                <td>
                  <div className="d-flex gap-2">
                    <Button size="sm" variant="outline-primary" onClick={() => editar(producto)}>Editar</Button>
                    <Button size="sm" variant="outline-danger" disabled={guardando} onClick={() => eliminar(producto)}>
                      Eliminar
                    </Button>
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
