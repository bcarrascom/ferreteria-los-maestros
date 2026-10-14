import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import DetalleProducto from "./pages/DetalleProducto";
import VolverArriba from "./components/VolverArriba";
import Encabezado from "./components/Encabezado";
import PiePagina from "./components/PiePagina";
import Catalogo from "./pages/Catalogo";
import Carrito from "./pages/Carrito";
import Inicio from "./pages/Inicio";

import {
  agregarAlCarrito,
  cambiarCantidad,
  contarProductos,
  guardarCarrito,
  leerCarritoGuardado,
  quitarDelCarrito,
} from "./utils/carrito";


function App() {

    // El carrito vive aquí porque lo usan el encabezado y todas las páginas.
  const [carrito, setCarrito] = useState(leerCarritoGuardado);

  // Cada vez que cambia el carrito, se guarda en el navegador.
  useEffect(() => {
    guardarCarrito(carrito);
  }, [carrito]);


  function agregarProducto(producto) {
    setCarrito(agregarAlCarrito(carrito, producto));
  }

  function cambiarCantidadProducto(producto, cantidadNueva) {
    setCarrito(cambiarCantidad(carrito, producto, cantidadNueva));
  }

  function quitarProducto(codigo) {
    setCarrito(quitarDelCarrito(carrito, codigo));
  }

  function vaciarCarrito() {
    setCarrito([]);
  }


  return (
    <>
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
          <Route
            path="/carrito"
            element={
              <Carrito
                carrito={carrito}
                alCambiarCantidad={cambiarCantidadProducto}
                alQuitar={quitarProducto}
                alVaciar={vaciarCarrito}
              />
            }
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
