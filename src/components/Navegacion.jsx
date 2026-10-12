import { Badge, Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";


function Navegacion({ cantidadCarrito }) {
  return (
    <Nav as="nav" aria-label="Navegación principal" className="ms-auto">
      <Nav.Link as={NavLink} to="/" end>Inicio</Nav.Link>
      <Nav.Link as={NavLink} to="/catalogo">Catálogo</Nav.Link>
      <Nav.Link as={NavLink} to="/carrito">
        Carrito{" "}
        <Badge bg="primary">
          {cantidadCarrito}
          <span className="visually-hidden">productos en el carrito</span>
        </Badge>
      </Nav.Link>
    </Nav>
  );
}

/* Para que la navegación sea parte del encabezado, lo exportamos para luego
importarlo al componente de encabezado, no a App.jsx */
export default Navegacion;
