import Encabezado from "./components/Encabezado";

function App() {
  return (
    <>
      {/* El 0 es provisorio: en el Paso 8 lo reemplaza el total del carrito. */}
      <Encabezado cantidadCarrito={0} />

      <main className="container py-5">
        <h1>Catálogo en construcción</h1>
        <p className="lead">
          Los demás componentes se agregan en los siguientes bloques.
        </p>
      </main>
    </>
  );
}

export default App;
