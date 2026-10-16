import Hero from "../components/Hero";
import ProductosDestacados from "../components/ProductosDestacados";

function Inicio({ alAgregar, productos }) {
  return (
    <>
      <Hero />
      <ProductosDestacados alAgregar={alAgregar} productos={productos} />
    </>
  );
}

export default Inicio;
