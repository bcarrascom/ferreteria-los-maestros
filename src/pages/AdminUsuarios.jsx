import { useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { rolesUsuario } from "../utils/usuarios";

const formularioInicial = { nombre: "", correo: "", rol: "comprador" };

function AdminUsuarios({ usuarios, usuarioActual, alGuardar, alQuitar }) {
  const [datos, setDatos] = useState(formularioInicial);
  const [error, setError] = useState("");

  function cambiar(evento) {
    const { name, value } = evento.target;
    setDatos({ ...datos, [name]: value });
  }

  function enviar(evento) {
    evento.preventDefault();
    const correo = datos.correo.trim().toLowerCase();

    if (!datos.nombre.trim() || !correo.includes("@")) {
      setError("Ingresa un nombre y un correo válido.");
      return;
    }

    if (usuarios.some((usuario) => usuario.correo.toLowerCase() === correo)) {
      setError("Ya existe una cuenta con ese correo.");
      return;
    }

    alGuardar({
      id: `usuario-${Date.now()}`,
      nombre: datos.nombre.trim(),
      correo,
      rol: datos.rol,
    });
    setDatos(formularioInicial);
    setError("");
  }

  return (
    <section className="container py-5" aria-labelledby="titulo-usuarios">
      <h1 id="titulo-usuarios">Usuarios y roles</h1>
      <p>El administrador puede crear cuentas y asignarles un rol.</p>
      {error && <Alert variant="danger" role="alert">{error}</Alert>}
      <Form onSubmit={enviar} noValidate className="row g-3 mb-5">
        <Form.Group className="col-12 col-md-4" controlId="nuevo-usuario-nombre">
          <Form.Label>Nombre</Form.Label>
          <Form.Control name="nombre" value={datos.nombre} onChange={cambiar} />
        </Form.Group>
        <Form.Group className="col-12 col-md-4" controlId="nuevo-usuario-correo">
          <Form.Label>Correo</Form.Label>
          <Form.Control type="email" name="correo" value={datos.correo} onChange={cambiar} />
        </Form.Group>
        <Form.Group className="col-12 col-md-2" controlId="nuevo-usuario-rol">
          <Form.Label>Rol</Form.Label>
          <Form.Select name="rol" value={datos.rol} onChange={cambiar}>
            {rolesUsuario.map((rol) => <option key={rol} value={rol}>{rol}</option>)}
          </Form.Select>
        </Form.Group>
        <div className="col-12 col-md-2 d-flex align-items-end">
          <Button type="submit" className="w-100">Crear</Button>
        </div>
      </Form>

      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead><tr><th>Nombre</th><th>Correo</th><th>Rol</th><th>Acción</th></tr></thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td>{usuario.nombre}</td>
                <td>{usuario.correo}</td>
                <td>
                  <Form.Select
                    aria-label={`Rol de ${usuario.nombre}`}
                    value={usuario.rol}
                    disabled={usuario.id === usuarioActual.id}
                    onChange={(evento) => alGuardar({ ...usuario, rol: evento.target.value }, true)}
                  >
                    {rolesUsuario.map((rol) => <option key={rol} value={rol}>{rol}</option>)}
                  </Form.Select>
                </td>
                <td>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    disabled={usuario.id === usuarioActual.id}
                    onClick={() => alQuitar(usuario.id)}
                  >
                    Quitar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="small text-body-secondary">
        No puedes cambiar ni quitar la cuenta con la que iniciaste sesión.
      </p>
    </section>
  );
}

export default AdminUsuarios;