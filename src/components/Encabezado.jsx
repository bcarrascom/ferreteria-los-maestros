import { Container, Navbar } from "react-bootstrap";
import Navegacion from "./Navegacion";
/* Para que la navegación sea parte del encabezado, la importamos aca directamente
en vez de importarla a App.jsx */

function Encabezado({ cantidadCarrito }) {
  return (
    <Navbar
      as="header"
      role={null}
      expand="md"   /* Dispositivos medianos, 768px*/
      bg="white"
      data-bs-theme="light"
      className="py-3 border-bottom border-3 border-primary"
    >
      <Container>
        <Navbar.Brand href="#inicio" className="d-flex align-items-center gap-3">
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
          <Navegacion cantidadCarrito={cantidadCarrito} />
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

/* Navbar es un componente de react-boostrap. expand define a partir de que ancho el menú se muesrta desplegado.
 Toggle diuja el botón del menú de hamburguesa y Collapse es el panel en si que se abre y cierra*/
export default Encabezado;
