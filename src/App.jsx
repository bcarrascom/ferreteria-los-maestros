import Encabezado from "./components/Encabezado";
import Hero from "./components/Hero";

function App() {
  return (
    <>
      {/* El 0 es provisorio: en el Paso 8 lo reemplaza el total del carrito. */}
      <Encabezado cantidadCarrito={0} />

      <main>
        <Hero />

        <section className="container py-5">
          <h2>Catálogo en construcción</h2>
          <p className="lead">
            Los demás componentes se agregan en los siguientes bloques.
          </p>
        </section>
      </main>
    </>
  );
}

export default App;
