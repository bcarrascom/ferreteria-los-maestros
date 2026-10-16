import { Badge, Button, Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";

function Navegacion({ cantidadCarrito, usuario, alCerrarSesion }) {
  return (
    <Nav as="nav" aria-label="Navegación principal" className="ms-auto">
      <Nav.Link as={NavLink} to="/" end>Inicio</Nav.Link>
      <Nav.Link as={NavLink} to="/catalogo">Catálogo</Nav.Link>

      {(!usuario || usuario.rol === "comprador") && (
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
      {usuario?.rol === "comprador" && <Nav.Link as={NavLink} to="/cuenta">Mi cuenta</Nav.Link>}
      {usuario?.rol === "vendedor" && <Nav.Link as={NavLink} to="/vendedor">Panel vendedor</Nav.Link>}
      {usuario?.rol === "administrador" && <Nav.Link as={NavLink} to="/admin">Administración</Nav.Link>}

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