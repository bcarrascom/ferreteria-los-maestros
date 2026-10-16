import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useLocalStorage } from "./hooks/useLocalStorage";
import DetalleProducto from "./pages/DetalleProducto";
import VolverArriba from "./components/VolverArriba";
import Encabezado from "./components/Encabezado";
import PiePagina from "./components/PiePagina";
import Catalogo from "./pages/Catalogo";
import Carrito from "./pages/Carrito";
import Inicio from "./pages/Inicio";
import Acceso from "./pages/Acceso";
import Registro from "./pages/Registro";
import PanelComprador from "./pages/PanelComprador";
import PanelVendedor from "./pages/PanelVendedor";
import PanelAdministrador from "./pages/PanelAdministrador";
import AdminUsuarios from "./pages/AdminUsuarios";
import GestionProductos from "./pages/GestionProductos";
import PedidosVendedor from "./pages/PedidosVendedor";
import AccesoRestringido from "./pages/AccesoRestringido";
import NoEncontrada from "./pages/NoEncontrada";

import {
  CLAVE_CARRITO,
  agregarAlCarrito,
  cambiarCantidad,
  contarProductos,
  limpiarCarrito,
  quitarDelCarrito,
} from "./utils/carrito";
import {
  guardarSesion,
  guardarUsuarios,
  leerSesionGuardada,
  leerUsuariosGuardados,
} from "./utils/usuarios";
import { guardarProductos, leerProductosGuardados } from "./utils/productos";

function App() {
  const navigate = useNavigate();

  // El carrito, productos, usuarios y sesión se comparten desde App.
  const [productos, setProductos] = useState(leerProductosGuardados);
  const [usuarios, setUsuarios] = useState(leerUsuariosGuardados);
  const [sesion, setUsuario] = useState(leerSesionGuardada);

  // La sesión guardada es una copia: se busca al usuario en la lista actual
  // para que un cambio de rol o una cuenta borrada se apliquen de inmediato.
  const usuario = sesion
    ? usuarios.find((item) => item.id === sesion.id) ?? null
    : null;

  // useLocalStorage guarda el carrito en el navegador cada vez que cambia.
  // Lo leído se valida contra los productos actuales (va después de "productos").
  const [carrito, setCarrito] = useLocalStorage(CLAVE_CARRITO, [], (guardado) =>
    limpiarCarrito(guardado, productos)
  );

  // Si un administrador borra un producto o baja su stock, el carrito se ajusta.
  const carritoVigente = limpiarCarrito(carrito, productos);

  useEffect(() => {
    guardarProductos(productos);
  }, [productos]);

  useEffect(() => {
    guardarUsuarios(usuarios);
  }, [usuarios]);

  useEffect(() => {
    guardarSesion(usuario);
  }, [usuario]);

  function irAlPanel(usuarioActual) {
    if (usuarioActual.rol === "administrador") {
      navigate("/admin");
    } else if (usuarioActual.rol === "vendedor") {
      navigate("/vendedor");
    } else {
      navigate("/cuenta");
    }
  }

  function iniciarSesion(usuarioActual) {
    setUsuario(usuarioActual);
    irAlPanel(usuarioActual);
  }

  function registrarComprador(usuarioNuevo) {
    setUsuarios([...usuarios, usuarioNuevo]);
    setUsuario(usuarioNuevo);
    navigate("/cuenta");
  }

  function cerrarSesion() {
    setUsuario(null);
    navigate("/");
  }

  function actualizarUsuario(usuarioActualizado, yaExiste = false) {
    if (yaExiste) {
      setUsuarios(
        usuarios.map((item) =>
          item.id === usuarioActualizado.id ? usuarioActualizado : item
        )
      );
    } else {
      setUsuarios([...usuarios, usuarioActualizado]);
    }
  }

  function quitarUsuario(id) {
    setUsuarios(usuarios.filter((item) => item.id !== id));
  }

  // Muestra la vista solo si hay sesión y el rol coincide.
  function vistaProtegida(rol, vista) {
    if (usuario && usuario.rol === rol) {
      return vista;
    }

    return <AccesoRestringido usuario={usuario} />;
  }


  // Se pasa una función a setCarrito para partir siempre del carrito más reciente,
  // aunque haya dos clics seguidos antes de que React vuelva a dibujar.
  function agregarProducto(producto) {
    setCarrito((actual) => agregarAlCarrito(actual, producto));
  }

  function cambiarCantidadProducto(producto, cantidadNueva) {
    setCarrito((actual) => cambiarCantidad(actual, producto, cantidadNueva));
  }

  function quitarProducto(codigo) {
    setCarrito((actual) => quitarDelCarrito(actual, codigo));
  }

  function vaciarCarrito() {
    setCarrito([]);
  }

  return (
    <>
      <VolverArriba />
      <Encabezado
        cantidadCarrito={contarProductos(carritoVigente)}
        usuario={usuario}
        alCerrarSesion={cerrarSesion}
      />

      <main>
        <Routes>
          <Route
            path="/"
            element={<Inicio alAgregar={agregarProducto} productos={productos} />}
          />
          <Route
            path="/catalogo"
            element={<Catalogo alAgregar={agregarProducto} productos={productos} />}
          />
          <Route
            path="/catalogo/:codigo"
            element={<DetalleProducto alAgregar={agregarProducto} productos={productos} />}
          />
          <Route
            path="/carrito"
            element={
              <Carrito
                carrito={carritoVigente}
                productos={productos}
                alCambiarCantidad={cambiarCantidadProducto}
                alQuitar={quitarProducto}
                alVaciar={vaciarCarrito}
              />
            }
          />

          <Route
            path="/acceso"
            element={<Acceso usuarios={usuarios} alAcceder={iniciarSesion} />}
          />
          <Route
            path="/registro"
            element={<Registro usuarios={usuarios} alRegistrar={registrarComprador} />}
          />

          <Route
            path="/cuenta"
            element={vistaProtegida(
              "comprador",
              <PanelComprador usuario={usuario} />
            )}
          />
          <Route
            path="/admin"
            element={vistaProtegida(
              "administrador",
              <PanelAdministrador
                cantidadUsuarios={usuarios.length}
                cantidadProductos={productos.length}
              />
            )}
          />
          <Route
            path="/admin/usuarios"
            element={vistaProtegida(
              "administrador",
              <AdminUsuarios
                usuarios={usuarios}
                usuarioActual={usuario}
                alGuardar={actualizarUsuario}
                alQuitar={quitarUsuario}
              />
            )}
          />
          <Route
            path="/admin/productos"
            element={vistaProtegida(
              "administrador",
              <GestionProductos
                productos={productos}
                alGuardarProductos={setProductos}
              />
            )}
          />
          <Route
            path="/admin/pedidos"
            element={vistaProtegida(
              "administrador",
              <PedidosVendedor />
            )}
          />

          <Route
            path="/vendedor"
            element={vistaProtegida(
              "vendedor",
              <PanelVendedor
                usuario={usuario}
                cantidadProductos={productos.length}
              />
            )}
          />
          <Route
            path="/vendedor/productos"
            element={vistaProtegida(
              "vendedor",
              <GestionProductos
                productos={productos}
                alGuardarProductos={setProductos}
              />
            )}
          />
          <Route
            path="/vendedor/pedidos"
            element={vistaProtegida(
              "vendedor",
              <PedidosVendedor />
            )}
          />

          <Route path="*" element={<NoEncontrada />} />
        </Routes>
      </main>

      <PiePagina />
    </>
  );
}

export default App;