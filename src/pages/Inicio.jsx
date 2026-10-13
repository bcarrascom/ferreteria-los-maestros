import Hero from "../components/Hero";
import ProductosDestacados from "../components/ProductosDestacados";

function Inicio({ alAgregar }) {
  return (
    <>
      <Hero />
      <ProductosDestacados alAgregar={alAgregar} />
    </>
  );
}

export default Inicio;
