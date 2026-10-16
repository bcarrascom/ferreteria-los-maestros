import { useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { buscarUsuarioPorCorreo } from "../utils/usuarios";

function Acceso({ usuarios, alAcceder }) {
  const [correo, setCorreo] = useState("");
  const [error, setError] = useState("");

  function enviar(evento) {
    evento.preventDefault();
    const usuario = buscarUsuarioPorCorreo(usuarios, correo);

    if (!usuario) {
      setError("No encontramos ese correo. Puedes crear una cuenta de comprador.");
      return;
    }

    setError("");
    alAcceder(usuario);
  }

  return (
    <section className="container py-5" aria-labelledby="titulo-acceso">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <h1 id="titulo-acceso">Iniciar sesión</h1>
          <p>Escribe el correo de una cuenta registrada para entrar a la tienda o a su panel.</p>
          {error && <Alert variant="danger" role="alert">{error}</Alert>}
          <Form onSubmit={enviar} noValidate>
            <Form.Group className="mb-3" controlId="correo-acceso">
              <Form.Label>Correo</Form.Label>
              <Form.Control
                type="email"
                autoComplete="email"
                value={correo}
                onChange={(evento) => setCorreo(evento.target.value)}
                required
              />
            </Form.Group>
            <Button type="submit">Continuar</Button>
          </Form>
          <p className="mt-3 mb-2">Cuentas de demostración:</p>
          <ul>
            <li>comprador@ferreteria.cl</li>
            <li>vendedor@ferreteria.cl</li>
            <li>admin@ferreteria.cl</li>
          </ul>
          <p>
            ¿Aún no tienes cuenta? <Link to="/registro">Crear cuenta de comprador</Link>
          </p>
          <p className="small text-body-secondary">
            Acceso de demostración: el navegador reconoce el correo, no comprueba una contraseña.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Acceso;