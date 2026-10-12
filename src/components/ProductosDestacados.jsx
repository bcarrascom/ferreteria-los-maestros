import { buscarProductoPorCodigo } from "../utils/productos";
import GrillaProductos from "./GrillaProductos";


// Mismos códigos que tenía el index.html del Parcial 1.
const codigosDestacados = ["MC001", "PT001", "HM001", "MC009"];

// Busca cada código en el JSON. Si alguno no existe, avisa y lo salta.
function buscarDestacados() {
  const encontrados = [];

  codigosDestacados.forEach((codigo) => {
    const producto = buscarProductoPorCodigo(codigo);

    if (producto) {
      encontrados.push(producto);
    } else {
      console.warn(`Producto con código "${codigo}" no encontrado en productos.json`);
    }
  });

  return encontrados;
}

function ProductosDestacados() {
  const destacados = buscarDestacados();

  return (
    <section className="container py-5" aria-labelledby="titulo-destacados">
      <h2 id="titulo-destacados" className="mb-4">
        Productos destacados
      </h2>
      <GrillaProductos productos={destacados} />
    </section>
  );
}

export default ProductosDestacados;
