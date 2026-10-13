import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import DetalleProducto from "./pages/DetalleProducto";
import { agregarAlCarrito, contarProductos } from "./utils/carrito";
import VolverArriba from "./components/VolverArriba";
import Encabezado from "./components/Encabezado";
import PiePagina from "./components/PiePagina";
import Catalogo from "./pages/Catalogo";
import Inicio from "./pages/Inicio";



function App() {

    // El carrito vive aquí porque lo usan el encabezado y todas las páginas.
  const [carrito, setCarrito] = useState([]);

  function agregarProducto(producto) {
    setCarrito(agregarAlCarrito(carrito, producto));
  }

  return (
    <>
      {/* El 0 es provisorio: en el Paso 8 lo reemplaza el total del carrito. */}
      <VolverArriba />
      <Encabezado cantidadCarrito={contarProductos(carrito)} />

            <main>
        <Routes>
          <Route path="/" element={<Inicio alAgregar={agregarProducto} />} />
          <Route path="/catalogo" element={<Catalogo alAgregar={agregarProducto} />} />
          <Route
            path="/catalogo/:codigo"
            element={<DetalleProducto alAgregar={agregarProducto} />}
          />
        </Routes>
      </main>


      <PiePagina />
    </>
  );
}

//  Los ":" en la ruta marcan un parámetro, que se puede leer con useParams()
//  Si se hiciera "/catalogo/codigo", solo calzaría con la URL literal "/catalogo/codigo"


export default App;
