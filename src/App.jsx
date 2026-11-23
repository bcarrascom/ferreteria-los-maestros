import { startTransition, useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
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
import NoEncontrada from "./pages/NoEncontrada";
import RutaProtegida from "./components/RutaProtegida";

import {
  agregarAlCarrito,
  cambiarCantidad,
  contarProductos,
  guardarCarrito,
  leerCarritoGuardado,
  quitarDelCarrito,
} from "./utils/carrito";
import { guardarUsuarios, leerUsuariosGuardados } from "./utils/usuarios";
import { guardarProductos, leerProductosGuardados } from "./utils/productos";
import { borrarTokens, estaVigente, leerTokens, usuarioDeSesion } from "./utils/sesion";
import { renovarSesion } from "./api/cliente";

// Sesión al abrir la página (contrato §8.3):
// access vigente → hay sesión; access vencido pero refresh vigente → renovar antes de mostrar vistas protegidas;
// los dos vencidos o nada guardado → sin sesión.
function sesionAlCargar() {
  const tokens = leerTokens();

  if (tokens && estaVigente(tokens.accessToken)) {
    return { usuario: usuarioDeSesion(tokens), verificando: false };
  }
  if (tokens && estaVigente(tokens.refreshToken)) {
    return { usuario: null, verificando: true };
  }

  borrarTokens();
  return { usuario: null, verificando: false };
}

function App() {
  const navigate = useNavigate();

  // El carrito, productos, usuarios y sesión se comparten desde App.
  const [carrito, setCarrito] = useState(leerCarritoGuardado);
  const [productos, setProductos] = useState(leerProductosGuardados);
  const [usuarios, setUsuarios] = useState(leerUsuariosGuardados);
  const [sesionInicial] = useState(sesionAlCargar);
  const [usuario, setUsuario] = useState(sesionInicial.usuario);
  const [verificandoSesion, setVerificandoSesion] = useState(sesionInicial.verificando);

  useEffect(() => {
    if (!sesionInicial.verificando) {
      return;
    }
    renovarSesion()
      .then(() => setUsuario(usuarioDeSesion(leerTokens())))
      .catch(() => borrarTokens())
      .finally(() => setVerificandoSesion(false));
  }, [sesionInicial]);

  // cliente.js avisa con este evento cuando la renovación falla en medio del uso
  useEffect(() => {
    function alExpirarSesion() {
      setUsuario(null);
      navigate("/acceso");
    }
    window.addEventListener("sesion-expirada", alExpirarSesion);
    return () => window.removeEventListener("sesion-expirada", alExpirarSesion);
  }, [navigate]);

  useEffect(() => {
    guardarCarrito(carrito);
  }, [carrito]);

  useEffect(() => {
    guardarProductos(productos);
  }, [productos]);

  useEffect(() => {
    guardarUsuarios(usuarios);
  }, [usuarios]);

  function irAlPanel(usuarioActual) {
    if (usuarioActual.rol === "ADMINISTRADOR") {
      navigate("/admin");
    } else if (usuarioActual.rol === "VENDEDOR") {
      navigate("/vendedor");
    } else {
      navigate("/cuenta");
    }
  }

  // Acceso y Registro ya guardaron los tokens: el usuario visible se lee del access token
  function iniciarSesion() {
    const usuarioActual = usuarioDeSesion(leerTokens());
    setUsuario(usuarioActual);
    irAlPanel(usuarioActual);
  }

  function registrarCliente() {
    setUsuario(usuarioDeSesion(leerTokens()));
    navigate("/cuenta");
  }

  // Cerrar sesión borra los tokens; el carrito se conserva.
  // React Router navega dentro de una transición: si setUsuario(null) quedara fuera, RutaProtegida
  // vería "sin sesión" en la ruta actual y mandaría a /acceso antes de llegar al inicio.
  function cerrarSesion() {
    borrarTokens();
    startTransition(() => {
      setUsuario(null);
      navigate("/");
    });
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

  // Envuelve una vista para que solo la vean los roles indicados
  function soloPara(roles, vista) {
    return (
      <RutaProtegida usuario={usuario} roles={roles} verificando={verificandoSesion}>
        {vista}
      </RutaProtegida>
    );
  }


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
      <Encabezado
        cantidadCarrito={contarProductos(carrito)}
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
                carrito={carrito}
                productos={productos}
                alCambiarCantidad={cambiarCantidadProducto}
                alQuitar={quitarProducto}
                alVaciar={vaciarCarrito}
              />
            }
          />

          <Route
            path="/acceso"
            element={<Acceso alAcceder={iniciarSesion} />}
          />
          <Route
            path="/registro"
            element={<Registro alRegistrar={registrarCliente} />}
          />

          <Route
            path="/cuenta"
            element={soloPara(
              ["CLIENTE"],
              <PanelComprador usuario={usuario} />
            )}
          />
          <Route
            path="/admin"
            element={soloPara(
              ["ADMINISTRADOR"],
              <PanelAdministrador
                cantidadUsuarios={usuarios.length}
                cantidadProductos={productos.length}
              />
            )}
          />
          <Route
            path="/admin/usuarios"
            element={soloPara(
              ["ADMINISTRADOR"],
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
            element={soloPara(
              ["ADMINISTRADOR"],
              <GestionProductos
                productos={productos}
                alGuardarProductos={setProductos}
              />
            )}
          />
          <Route
            path="/admin/pedidos"
            element={soloPara(
              ["ADMINISTRADOR"],
              <PedidosVendedor />
            )}
          />

          <Route
            path="/vendedor"
            element={soloPara(
              ["VENDEDOR"],
              <PanelVendedor
                usuario={usuario}
                cantidadProductos={productos.length}
              />
            )}
          />
          <Route
            path="/vendedor/productos"
            element={soloPara(
              ["VENDEDOR"],
              <GestionProductos
                productos={productos}
                alGuardarProductos={setProductos}
              />
            )}
          />
          <Route
            path="/vendedor/pedidos"
            element={soloPara(
              ["VENDEDOR"],
              <PedidosVendedor />
            )}
          />

          <Route path="*" element={<NoEncontrada />} />
        </Routes>
      </main>

      <PiePagina rol={usuario?.rol} />
    </>
  );
}

export default App;