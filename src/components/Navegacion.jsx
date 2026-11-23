import { Badge, Button, Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";

// Menú por rol (contrato §8.4). Ocultar enlaces es experiencia de usuario:
// aunque alguien escriba la URL a mano, RutaProtegida y el backend (403) lo bloquean.
function Navegacion({ cantidadCarrito, usuario, alCerrarSesion }) {
  const rol = usuario?.rol;
  const esVendedor = rol === "VENDEDOR";

  return (
    <Nav as="nav" aria-label="Navegación principal" className="ms-auto">
      {/* El vendedor solo ve Productos y Órdenes: "los demás accesos no deben aparecer" (Anexo 1) */}
      {!esVendedor && <Nav.Link as={NavLink} to="/" end>Inicio</Nav.Link>}
      {!esVendedor && <Nav.Link as={NavLink} to="/catalogo">Catálogo</Nav.Link>}

      {(!usuario || rol === "CLIENTE") && (
        <Nav.Link as={NavLink} to="/carrito">
          Carrito{" "}
          <Badge bg="primary">
            {cantidadCarrito}
            <span className="visually-hidden">productos en el carrito</span>
          </Badge>
        </Nav.Link>
      )}

      {!usuario && <Nav.Link as={NavLink} to="/acceso">Iniciar sesión</Nav.Link>}
      {!usuario && <Nav.Link as={NavLink} to="/registro">Crear cuenta</Nav.Link>}
      {rol === "CLIENTE" && <Nav.Link as={NavLink} to="/cuenta">Mi cuenta</Nav.Link>}
      {esVendedor && <Nav.Link as={NavLink} to="/vendedor/productos">Productos</Nav.Link>}
      {esVendedor && <Nav.Link as={NavLink} to="/vendedor/pedidos">Órdenes</Nav.Link>}
      {rol === "ADMINISTRADOR" && <Nav.Link as={NavLink} to="/admin">Administración</Nav.Link>}

      {usuario && (
        <>
          <span className="nav-link text-body-secondary">
            {usuario.nombre} · {usuario.rol}
          </span>
          <Button
            variant="outline-secondary"
            size="sm"
            className="my-1"
            onClick={alCerrarSesion}
          >
            Cerrar sesión
          </Button>
        </>
      )}
    </Nav>
  );
}

export default Navegacion;
