import { useEffect, useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { actualizarUsuario, crearUsuario, eliminarUsuario, listarUsuarios } from "../api/usuarios";
import CampoFormulario from "../components/CampoFormulario";
import { rolesUsuario } from "../utils/usuarios";

const formularioInicial = { rut: "", nombre: "", apellidos: "", correo: "", password: "", rol: "CLIENTE" };

function Campo(props) {
  return <CampoFormulario idFormulario="nuevo-usuario" className="col-12 col-md-6 col-lg-4" {...props} />;
}

// Administración de usuarios contra ms-usuarios: cada cambio llama a la API y luego recarga la lista.
// Las reglas (correo o RUT duplicado, no quitarse el propio rol, último administrador) las aplica el backend.
function AdminUsuarios({ usuarioActual }) {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [version, setVersion] = useState(0);        // al cambiar, se vuelve a pedir la lista
  const [datos, setDatos] = useState(formularioInicial);
  const [errores, setErrores] = useState({});
  const [error, setError] = useState("");
  const [aviso, setAviso] = useState("");

  useEffect(() => {
    let vigente = true;      // si la vista se cierra antes de que responda, no se actualiza el estado
    listarUsuarios()
      .then((lista) => vigente && setUsuarios(lista))
      .catch((errorApi) => vigente && setError(errorApi.mensaje ?? "No se pudo cargar la lista de usuarios."))
      .finally(() => vigente && setCargando(false));
    return () => {
      vigente = false;
    };
  }, [version]);

  function cambiar(evento) {
    const { name, value } = evento.target;
    setDatos({ ...datos, [name]: value });
  }

  // Ejecuta una llamada a la API, muestra el resultado y recarga la lista
  async function ejecutar(accion, mensajeExito) {
    setError("");
    setAviso("");
    try {
      await accion();
      setAviso(mensajeExito);
      setVersion(version + 1);
      return true;
    } catch (errorApi) {
      setError(errorApi.mensaje ?? "No se pudo conectar con el servidor.");
      setErrores(errorApi.detalles ?? {});
      return false;
    }
  }

  async function crear(evento) {
    evento.preventDefault();
    setErrores({});
    const creado = await ejecutar(() => crearUsuario({ ...datos, activo: true }), `Se creó la cuenta de ${datos.nombre}.`);
    if (creado) {
      setDatos(formularioInicial);
    }
  }

  // El PUT necesita el usuario completo; password vacía = no cambiarla
  function cambiarRol(usuario, rol) {
    ejecutar(() => actualizarUsuario(usuario.id, { ...usuario, rol, password: "" }), `${usuario.nombre} ahora es ${rol}.`);
  }

  function eliminar(usuario) {
    if (!window.confirm(`¿Eliminar la cuenta de ${usuario.nombre} ${usuario.apellidos}? No se puede deshacer.`)) {
      return;
    }
    ejecutar(() => eliminarUsuario(usuario.id), `Se eliminó la cuenta de ${usuario.nombre}.`);
  }

  const propiedades = { datos, errores, alCambiar: cambiar };

  return (
    <section className="container py-5" aria-labelledby="titulo-usuarios">
      <h1 id="titulo-usuarios">Usuarios y roles</h1>
      <p>El administrador puede crear cuentas con cualquier rol, cambiar roles y eliminar cuentas.</p>
      {error && <Alert variant="danger" role="alert">{error}</Alert>}
      {aviso && <Alert variant="success">{aviso}</Alert>}

      <h2 className="h5">Nueva cuenta</h2>
      <Form onSubmit={crear} noValidate className="row g-3 mb-5">
        <Campo nombre="rut" etiqueta="RUT" {...propiedades} />
        <Campo nombre="nombre" etiqueta="Nombre" {...propiedades} />
        <Campo nombre="apellidos" etiqueta="Apellidos" {...propiedades} />
        <Campo nombre="correo" etiqueta="Correo" tipo="email" {...propiedades} />
        <Campo nombre="password" etiqueta="Contraseña" tipo="password" autoComplete="new-password" {...propiedades} />
        <Form.Group className="col-12 col-md-6 col-lg-2" controlId="nuevo-usuario-rol">
          <Form.Label>Rol</Form.Label>
          <Form.Select name="rol" value={datos.rol} onChange={cambiar}>
            {rolesUsuario.map((rol) => <option key={rol} value={rol}>{rol}</option>)}
          </Form.Select>
        </Form.Group>
        <div className="col-12 col-lg-2 d-flex align-items-end">
          <Button type="submit" className="w-100">Crear</Button>
        </div>
      </Form>

      {cargando ? (
        <p>Cargando usuarios…</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead><tr><th>Nombre</th><th>Correo</th><th>RUT</th><th>Rol</th><th>Acción</th></tr></thead>
            <tbody>
              {usuarios.map((usuario) => {
                const esPropia = usuario.id === usuarioActual.id;
                return (
                  <tr key={usuario.id}>
                    <td>{usuario.nombre} {usuario.apellidos}</td>
                    <td>{usuario.correo}</td>
                    <td>{usuario.rut}</td>
                    <td>
                      <Form.Select
                        aria-label={`Rol de ${usuario.nombre}`}
                        value={usuario.rol}
                        disabled={esPropia}
                        onChange={(evento) => cambiarRol(usuario, evento.target.value)}
                      >
                        {rolesUsuario.map((rol) => <option key={rol} value={rol}>{rol}</option>)}
                      </Form.Select>
                    </td>
                    <td>
                      <Button variant="outline-danger" size="sm" disabled={esPropia} onClick={() => eliminar(usuario)}>
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <p className="small text-body-secondary">
        No puedes cambiar el rol ni eliminar la cuenta con la que iniciaste sesión.
      </p>
    </section>
  );
}

export default AdminUsuarios;
