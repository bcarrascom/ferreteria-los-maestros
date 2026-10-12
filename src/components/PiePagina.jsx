import { Link } from "react-router-dom";

function PiePagina() {
  return (
    <footer className="pie mt-5 py-5">
      <div className="container">
        <div className="row g-4">
          <section className="col-12 col-md-6 col-xl-4">
            <h2>Ferretería Los Maestros</h2>
            <address className="mb-3">
              Rengifo 320, La Serena, Región de Coquimbo
              <br />
              Teléfono: <a href="tel:+56912345678">+56 9 1234 5678</a>
              <br />
              Correo:{" "}
              <a href="mailto:contacto@ferreterialosmaestros.cl">
                contacto@ferreterialosmaestros.cl
              </a>
            </address>
            <p className="mb-0">
              Lunes a viernes de 8:30 a 19:00 · Sábados de 9:00 a 14:00
            </p>
          </section>

          <section className="col-12 col-md-6 col-xl-4">
            <h2>Navegación</h2>
            <nav aria-label="Navegación del pie de página">
              <ul className="list-unstyled d-grid gap-2 mb-0">
                <li>
                  <Link to="/">Inicio</Link>
                </li>
                <li>
                  <Link to="/catalogo">Catálogo</Link>
                </li>
                <li>
                  <Link to="/carrito">Carrito</Link>
                </li>
              </ul>
            </nav>
          </section>

          <section className="col-12 col-md-6 col-xl-4">
            <h2>Síguenos</h2>
            <ul className="list-unstyled d-grid gap-2 mb-0">
              <li>
                <a
                  className="d-flex align-items-center gap-2"
                  href="https://web.facebook.com/ferreteria_los_maestros"
                  target="_blank"
                  rel="noopener"
                >
                  <img src="/img/facebook-logo.png" alt="" width="20" height="20" />
                  Facebook
                </a>
              </li>
              <li>
                <a
                  className="d-flex align-items-center gap-2"
                  href="https://www.instagram.com/ferreteria_los_maestros"
                  target="_blank"
                  rel="noopener"
                >
                  <img src="/img/instagram-logo.png" alt="" width="20" height="20" />
                  Instagram
                </a>
              </li>
              <li>
                <a
                  className="d-flex align-items-center gap-2"
                  href="https://www.linkedin.com/company/ferreteria-los-maestros"
                  target="_blank"
                  rel="noopener"
                >
                  <img src="/img/linkedin-logo.png" alt="" width="20" height="20" />
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  className="d-flex align-items-center gap-2"
                  href="https://wa.me/56912345678"
                  target="_blank"
                  rel="noopener"
                >
                  <img src="/img/whatsapp-logo.png" alt="" width="20" height="20" />
                  WhatsApp
                </a>
              </li>
            </ul>
          </section>
        </div>

        <p className="pie-copyright text-center mt-4 pt-3 mb-0">
          © 2026 Ferretería Los Maestros · La Serena, Chile
        </p>
      </div>
    </footer>
  );
}

export default PiePagina;
