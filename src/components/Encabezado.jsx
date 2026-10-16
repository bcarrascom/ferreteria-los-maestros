import { Container, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import Navegacion from "./Navegacion";

function Encabezado({ cantidadCarrito, usuario, alCerrarSesion }) {
  return (
    <Navbar
      as="header"
      role={null}
      expand="md"
      bg="white"
      data-bs-theme="light"
      className="py-3 border-bottom border-3 border-primary"
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-3">
          <img
            src="/img/logo.jpg"
            alt="Logo de Ferretería Los Maestros"
            width="48"
            height="48"
          />
          <span className="h4 mb-0">Ferretería Los Maestros</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="menu-principal" />

        <Navbar.Collapse id="menu-principal">
          <Navegacion
            cantidadCarrito={cantidadCarrito}
            usuario={usuario}
            alCerrarSesion={alCerrarSesion}
          />
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Encabezado;