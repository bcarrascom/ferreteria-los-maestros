const formulario = document.querySelector("#formulario-registro");
const rut = document.querySelector("#rut");
const nombre = document.querySelector("#nombre");
const correo = document.querySelector("#correo");
const fechaNacimiento = document.querySelector("#fecha-nacimiento");
const contrasena = document.querySelector("#contrasena");
const mensajeExito = document.querySelector("#mensaje-exito");

function mostrarError(control, idError, mensaje) {
  const salida = document.querySelector(`#${idError}`);
  salida.textContent = mensaje;
  control.classList.add("campo-invalido");
  control.setAttribute("aria-invalid", "true");
}

function limpiarError(control, idError) {
  const salida = document.querySelector(`#${idError}`);
  salida.textContent = "";
  control.classList.remove("campo-invalido");
  control.removeAttribute("aria-invalid");
}

function validarNombre(valor) {
  limpiarError(nombre, "error-nombre");

  if (valor === "") {
    mostrarError(nombre, "error-nombre", "El nombre es obligatorio");
    return false;
  }

  if (valor.length > 50) {
    mostrarError(nombre, "error-nombre", "Máximo 50 caracteres");
    return false;
  }

  return true;
}

function validarCorreo(valor) {
  limpiarError(correo, "error-correo");

  if (valor === "") {
    mostrarError(correo, "error-correo", "El correo es obligatorio");
    return false;
  }

  if (!valor.includes("@")) {
    mostrarError(correo, "error-correo", "El correo debe contener @");
    return false;
  }

  const dominioPermitido =
    valor.endsWith("@duocuc.cl") ||
    valor.endsWith("@profesor.duoc.cl");

  if (!dominioPermitido) {
    mostrarError(correo, "error-correo", "Utiliza un dominio institucional");
    return false;
  }

  return true;
}

function validarContrasena(valor) {
  limpiarError(contrasena, "error-contrasena");

  if (valor.length < 6 || valor.length > 12) {
    mostrarError(
      contrasena,
      "error-contrasena",
      "Debe contener entre 6 y 12 caracteres"
    );
    return false;
  }

  return true;
}

function validarFecha(valor) {
  limpiarError(fechaNacimiento, "error-fecha");

  if (valor === "") {
    mostrarError(fechaNacimiento, "error-fecha", "Selecciona una fecha");
    return false;
  }

  const fechaIngresada = new Date(`${valor}T00:00:00`);
  const hoy = new Date();

  if (fechaIngresada > hoy) {
    mostrarError(fechaNacimiento, "error-fecha", "La fecha no puede ser futura");
    return false;
  }

  return true;
}

function validarRut(valor) {
  limpiarError(rut, "error-rut");

  const formatoRut = /^[0-9]{7,8}[0-9Kk]$/;

  if (!formatoRut.test(valor)) {
    mostrarError(rut, "error-rut", "Escribe el RUT sin puntos ni guion");
    return false;
  }

  const cuerpo = valor.slice(0, -1);
  const digitoIngresado = valor.slice(-1).toUpperCase();
  let suma = 0;
  let multiplicador = 2;

  for (let posicion = cuerpo.length - 1; posicion >= 0; posicion--) {
    suma = suma + Number(cuerpo[posicion]) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }

  const resto = 11 - (suma % 11);
  let digitoCalculado = String(resto);

  if (resto === 11) digitoCalculado = "0";
  if (resto === 10) digitoCalculado = "K";

  if (digitoIngresado !== digitoCalculado) {
    mostrarError(rut, "error-rut", "El dígito verificador no es correcto");
    return false;
  }

  return true;
}

function procesarRegistro(evento) {
  evento.preventDefault();

  const valorRut = rut.value.trim();
  const valorNombre = nombre.value.trim();
  const valorCorreo = correo.value.trim().toLowerCase();
  const valorFecha = fechaNacimiento.value;
  const valorContrasena = contrasena.value;

  const rutValido = validarRut(valorRut);
  const nombreValido = validarNombre(valorNombre);
  const correoValido = validarCorreo(valorCorreo);
  const contrasenaValida = validarContrasena(valorContrasena);
  const fechaValida = validarFecha(valorFecha);

  const formularioValido =
    rutValido && nombreValido && correoValido &&
    contrasenaValida && fechaValida;

  if (!formularioValido) {
    mensajeExito.textContent = "Revisa los campos marcados";
    return;
  }

  mensajeExito.textContent = "Registro válido";
}

nombre.addEventListener("blur", function () {
  validarNombre(nombre.value.trim());
});

nombre.addEventListener("input", function () {
  limpiarError(nombre, "error-nombre");
});

formulario.addEventListener("submit", procesarRegistro);
