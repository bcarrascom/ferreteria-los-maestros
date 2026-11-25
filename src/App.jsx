import { startTransition, useCallback, useEffect, useState } from "react";
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
import ProductosVendedor from "./pages/ProductosVendedor";
import PedidosVendedor from "./pages/PedidosVendedor";
import NoEncontrada from "./pages/NoEncontrada";
import RutaProtegida from "./components/RutaProtegida";
import AvisoCatalogo from "./components/AvisoCatalogo";

import {
  agregarAlCarrito,
  cambiarCantidad,
  contarProductos,
  guardarCarrito,
  leerCarritoGuardado,
  quitarDelCarrito,
} from "./utils/carrito";
import { borrarTokens, estaVigente, leerTokens, usuarioDeSesion } from "./utils/sesion";
import { renovarSesion } from "./api/cliente";
import { listarProductos } from "./api/productos";

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

  // El carrito, productos y sesión se comparten desde App. Los usuarios los maneja ms-usuarios.
  // Los productos vienen de ms-catalogo; el carrito sigue en localStorage.
  const [carrito, setCarrito] = useState(leerCarritoGuardado);
  const [productos, setProductos] = useState([]);
  const [cargandoProductos, setCargandoProductos] = useState(true);
  const [errorProductos, setErrorProductos] = useState("");
  const [sesionInicial] = useState(sesionAlCargar);
  const [usuario, setUsuario] = useState(sesionInicial.usuario);
  const [verificandoSesion, setVerificandoSesion] = useState(sesionInicial.verificando);

  // Pide el catálogo a la API. La usan la carga inicial, el botón Reintentar, la gestión de productos
  // (después de guardar o eliminar) y, más adelante, el checkout (el stock cambia después de comprar).
  // useCallback: la misma función en cada render, así el effect de abajo no se repite por gusto.
  const recargarProductos = useCallback(() => {
    return listarProductos()
      .then((lista) => {
        setProductos(lista);
        setErrorProductos("");
      })
      .catch(() => setErrorProductos("No se pudo cargar el catálogo. Revisa tu conexión e inténtalo de nuevo."))
      .finally(() => setCargandoProductos(false));
  }, []);

  // Se carga al abrir la página y otra vez cada vez que cambia el rol de la sesión:
  // con token de ADMINISTRADOR la API agrega precioCompra, y al cerrar sesión hay que sacarlo.
  // Si la sesión se está renovando, se espera, para no pedir el catálogo con un token vencido.
  const rolSesion = usuario?.rol;
  useEffect(() => {
    if (verificandoSesion) {
      return;
    }
    recargarProductos();
  }, [rolSesion, verificandoSesion, recargarProductos]);

  function reintentarCatalogo() {
    setErrorProductos("");
    setCargandoProductos(true);
    recargarProductos();
  }

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

  // Las vistas que necesitan el catálogo esperan a que llegue: si no, el detalle diría
  // "Producto no encontrado" y el carrito saldría vacío durante la carga.
  function conCatalogo(vista) {
    if (cargandoProductos) {
      return <AvisoCatalogo cargando />;
    }
    return vista;
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
        <AvisoCatalogo error={errorProductos} alReintentar={reintentarCatalogo} />
        <Routes>
          <Route
            path="/"
            element={<Inicio alAgregar={agregarProducto} productos={productos} />}
          />
          <Route
            path="/catalogo"
            element={conCatalogo(<Catalogo alAgregar={agregarProducto} productos={productos} />)}
          />
          <Route
            path="/catalogo/:codigo"
            element={conCatalogo(<DetalleProducto alAgregar={agregarProducto} productos={productos} />)}
          />
          <Route
            path="/carrito"
            element={conCatalogo(
              <Carrito
                carrito={carrito}
                productos={productos}
                alCambiarCantidad={cambiarCantidadProducto}
                alQuitar={quitarProducto}
                alVaciar={vaciarCarrito}
              />
            )}
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
              <PanelAdministrador cantidadProductos={productos.length} />
            )}
          />
          <Route
            path="/admin/usuarios"
            element={soloPara(
              ["ADMINISTRADOR"],
              <AdminUsuarios usuarioActual={usuario} />
            )}
          />
          <Route
            path="/admin/productos"
            element={soloPara(
              ["ADMINISTRADOR"],
              conCatalogo(
                <GestionProductos
                  productos={productos}
                  alCambiarCatalogo={recargarProductos}
                />
              )
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
              conCatalogo(<ProductosVendedor productos={productos} />)
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