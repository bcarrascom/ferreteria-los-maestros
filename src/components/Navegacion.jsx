import { Badge, Nav } from "react-bootstrap";

function Navegacion({ cantidadCarrito }) {
  return (
    <Nav as="nav" aria-label="Navegación principal" className="ms-auto">
      <Nav.Link href="#inicio">Inicio</Nav.Link>
      <Nav.Link href="#catalogo">Catálogo</Nav.Link>
      <Nav.Link href="#carrito">
        Carrito{" "}
        <Badge bg="primary">
          {cantidadCarrito}
          <span className="visually-hidden">productos en el carrito</span>
        </Badge>
      </Nav.Link>
    </Nav>
  );
}

export default Navegacion;
