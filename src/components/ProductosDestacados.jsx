import productos from "../data/productos.json";
import TarjetaProducto from "./tarjetaProducto";

// Mismos códigos que tenía el index.html del Parcial 1.
const codigosDestacados = ["MC001", "PT001", "HM001", "MC009"];

// Busca cada código en el JSON. Si alguno no existe, avisa y lo salta.
function buscarDestacados() {
  const encontrados = [];

  codigosDestacados.forEach((codigo) => {
    const producto = productos.find((p) => p.codigo === codigo);

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

      <ul className="row g-4 list-unstyled">
        {destacados.map((producto) => (
          <li key={producto.codigo} className="col-12 col-sm-6 col-lg-3">
            <TarjetaProducto producto={producto} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export default ProductosDestacados;
