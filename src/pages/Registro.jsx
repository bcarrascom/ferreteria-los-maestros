import { useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { crearCuentaComprador } from "../utils/usuarios";

function Registro({ usuarios, alRegistrar }) {
  const [datos, setDatos] = useState({ nombre: "", correo: "" });
  const [error, setError] = useState("");

  function cambiar(evento) {
    const { name, value } = evento.target;
    setDatos({ ...datos, [name]: value });
  }

  function enviar(evento) {
    evento.preventDefault();
    const resultado = crearCuentaComprador(usuarios, datos);

    if (resultado.error) {
      setError(resultado.error);
      return;
    }

    setError("");
    alRegistrar(resultado.usuario);
  }

  return (
    <section className="container py-5" aria-labelledby="titulo-registro">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <h1 id="titulo-registro">Crear cuenta</h1>
          <p>El registro crea una cuenta de comprador.</p>
          {error && <Alert variant="danger" role="alert">{error}</Alert>}
          <Form onSubmit={enviar} noValidate>
            <Form.Group className="mb-3" controlId="nombre-registro">
              <Form.Label>Nombre</Form.Label>
              <Form.Control name="nombre" value={datos.nombre} onChange={cambiar} required />
            </Form.Group>
            <Form.Group className="mb-3" controlId="correo-registro">
              <Form.Label>Correo</Form.Label>
              <Form.Control
                type="email"
                name="correo"
                autoComplete="email"
                value={datos.correo}
                onChange={cambiar}
                required
              />
            </Form.Group>
            <Button type="submit">Crear cuenta</Button>
          </Form>
          <p className="mt-3">¿Ya tienes cuenta? <Link to="/acceso">Iniciar sesión</Link></p>
        </div>
      </div>
    </section>
  );
}

export default Registro;