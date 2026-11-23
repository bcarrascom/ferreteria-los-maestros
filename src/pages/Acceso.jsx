import { useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { iniciarSesion } from "../api/auth";

function Acceso({ alAcceder }) {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function enviar(evento) {
    evento.preventDefault();
    setError("");
    setEnviando(true);

    try {
      await iniciarSesion(correo.trim(), password);
      alAcceder();
    } catch (errorApi) {
      // El backend responde el mismo mensaje si el correo no existe o la contraseña es incorrecta
      setError(errorApi.mensaje ?? "No se pudo conectar con el servidor. Intenta de nuevo.");
      setEnviando(false);
    }
  }

  return (
    <section className="container py-5" aria-labelledby="titulo-acceso">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <h1 id="titulo-acceso">Iniciar sesión</h1>
          <p>Ingresa con tu correo y contraseña para comprar o entrar a tu panel.</p>
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
            <Form.Group className="mb-3" controlId="password-acceso">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(evento) => setPassword(evento.target.value)}
                required
              />
            </Form.Group>
            <Button type="submit" disabled={enviando}>
              {enviando ? "Ingresando…" : "Ingresar"}
            </Button>
          </Form>
          <p className="mt-3 mb-2">Cuentas de demostración (contraseña <code>Maestros2026</code>):</p>
          <ul>
            <li>cliente@ferreteria.cl</li>
            <li>vendedor@ferreteria.cl</li>
            <li>admin@ferreteria.cl</li>
          </ul>
          <p>
            ¿Aún no tienes cuenta? <Link to="/registro">Crear cuenta</Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Acceso;
