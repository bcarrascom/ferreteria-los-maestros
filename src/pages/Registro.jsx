import { useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { registrarCliente } from "../api/auth";
import CampoFormulario from "../components/CampoFormulario";
import { esRutValido } from "../utils/rut";

const formularioInicial = {
  rut: "",
  nombre: "",
  apellidos: "",
  correo: "",
  password: "",
  confirmacion: "",
  telefono: "",
  region: "",
  comuna: "",
  direccion: "",
};

// Cada campo del formulario de registro, con su error debajo
function Campo(props) {
  return <CampoFormulario idFormulario="registro" {...props} />;
}

function Registro({ alRegistrar }) {
  const [datos, setDatos] = useState(formularioInicial);
  const [errores, setErrores] = useState({});
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  function cambiar(evento) {
    const { name, value } = evento.target;
    setDatos({ ...datos, [name]: value });
  }

  // Lo que se puede revisar sin ir al servidor. El resto (formato, duplicados) lo valida el backend.
  function validarAntesDeEnviar() {
    const encontrados = {};
    if (!esRutValido(datos.rut)) {
      encontrados.rut = "RUT inválido";
    }
    if (datos.password !== datos.confirmacion) {
      encontrados.confirmacion = "Las contraseñas no coinciden";
    }
    return encontrados;
  }

  async function enviar(evento) {
    evento.preventDefault();
    setError("");

    const encontrados = validarAntesDeEnviar();
    setErrores(encontrados);
    if (Object.keys(encontrados).length > 0) {
      return;
    }

    // La confirmación no viaja al backend
    const cuenta = { ...datos };
    delete cuenta.confirmacion;
    setEnviando(true);

    try {
      await registrarCliente(cuenta);
      alRegistrar();
    } catch (errorApi) {
      setErrores(errorApi.detalles ?? {});
      setError(errorApi.mensaje ?? "No se pudo conectar con el servidor. Intenta de nuevo.");
      setEnviando(false);
    }
  }

  const propiedades = { datos, errores, alCambiar: cambiar };

  return (
    <section className="container py-5" aria-labelledby="titulo-registro">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <h1 id="titulo-registro">Crear cuenta</h1>
          <p>El registro crea una cuenta de cliente.</p>
          {error && <Alert variant="danger" role="alert">{error}</Alert>}
          <Form onSubmit={enviar} noValidate className="row g-3">
            <Campo nombre="rut" etiqueta="RUT" className="col-12 col-md-6" {...propiedades} />
            <Campo nombre="correo" etiqueta="Correo" tipo="email" autoComplete="email" className="col-12 col-md-6" {...propiedades} />
            <Campo nombre="nombre" etiqueta="Nombre" autoComplete="given-name" className="col-12 col-md-6" {...propiedades} />
            <Campo nombre="apellidos" etiqueta="Apellidos" autoComplete="family-name" className="col-12 col-md-6" {...propiedades} />
            <Campo nombre="password" etiqueta="Contraseña" tipo="password" autoComplete="new-password" className="col-12 col-md-6" {...propiedades} />
            <Campo nombre="confirmacion" etiqueta="Confirmar contraseña" tipo="password" autoComplete="new-password" className="col-12 col-md-6" {...propiedades} />
            <p className="small text-body-secondary mb-0">
              La contraseña debe tener entre 8 y 64 caracteres, con letras y números.
            </p>

            <h2 className="h6 mt-4 mb-0">Datos de despacho (opcionales)</h2>
            <Campo nombre="telefono" etiqueta="Teléfono" tipo="tel" autoComplete="tel" className="col-12 col-md-6" {...propiedades} />
            <Campo nombre="region" etiqueta="Región" className="col-12 col-md-6" {...propiedades} />
            <Campo nombre="comuna" etiqueta="Comuna" className="col-12 col-md-6" {...propiedades} />
            <Campo nombre="direccion" etiqueta="Dirección" autoComplete="street-address" className="col-12 col-md-6" {...propiedades} />

            <div className="col-12">
              <Button type="submit" disabled={enviando}>
                {enviando ? "Creando cuenta…" : "Crear cuenta"}
              </Button>
            </div>
          </Form>
          <p className="mt-3">¿Ya tienes cuenta? <Link to="/acceso">Iniciar sesión</Link></p>
        </div>
      </div>
    </section>
  );
}

export default Registro;
