import { Form } from "react-bootstrap";

// Un campo de formulario con su mensaje de error debajo (por ejemplo, los "detalles" de un 400 del backend).
// Lo usan Registro y AdminUsuarios.
function CampoFormulario({ nombre, etiqueta, tipo = "text", autoComplete, datos, errores, alCambiar, className = "col-12", idFormulario }) {
  return (
    <Form.Group className={className} controlId={`${nombre}-${idFormulario}`}>
      <Form.Label>{etiqueta}</Form.Label>
      <Form.Control
        type={tipo}
        name={nombre}
        autoComplete={autoComplete}
        value={datos[nombre]}
        onChange={alCambiar}
        isInvalid={Boolean(errores[nombre])}
      />
      <Form.Control.Feedback type="invalid">{errores[nombre]}</Form.Control.Feedback>
    </Form.Group>
  );
}

export default CampoFormulario;
