import { Route, Routes } from "react-router-dom";
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
        </Routes>
      </main>

      <PiePagina />
    </>
  );
}

export default App;
