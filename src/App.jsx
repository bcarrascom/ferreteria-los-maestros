import { Route, Routes } from "react-router-dom";
import DetalleProducto from "./pages/DetalleProducto";
import VolverArriba from "./components/VolverArriba";
import Encabezado from "./components/Encabezado";
import PiePagina from "./components/PiePagina";
import Catalogo from "./pages/Catalogo";
import Inicio from "./pages/Inicio";


function App() {
  return (
    <>
      {/* El 0 es provisorio: en el Paso 8 lo reemplaza el total del carrito. */}
      <VolverArriba />
      <Encabezado cantidadCarrito={0} />

      <main>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/catalogo/:codigo" element={<DetalleProducto />} />
        </Routes>
      </main>

      <PiePagina />
    </>
  );
}

//  Los ":" en la ruta marcan un parámetro, que se puede leer con useParams()
//  Si se hiciera "/catalogo/codigo", solo calzaría con la URL literal "/catalogo/codigo"


export default App;
