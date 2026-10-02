function Encabezado() {
  return (
    <header className="py-3 bg-white border-bottom border-3 border-primary">
      <div className="container d-flex align-items-center gap-3">
        <img
          src="/img/logo.jpg"
          alt="Logo de Ferretería Los Maestros"
          width="48"
          height="48"
        />
        <p className="h4 mb-0">Ferretería Los Maestros</p>
      </div>
    </header>
  );
}

export default Encabezado;