import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { accessDePrueba, refreshDePrueba, respuestaDePrueba } from "./test/tokens";
import { catalogoApiDePrueba } from "./test/catalogo";
import { guardarTokens, leerTokens } from "./utils/sesion";
import App from "./App";

// Backend falso: GET /api/v1/productos responde el catálogo (App lo pide al abrir)
// y cualquier otra ruta responde "otra" (el login, el registro, la lista de usuarios...).
function simularBackend(otra = respuestaDePrueba(404, { mensaje: "Ruta no simulada" })) {
  return vi.spyOn(globalThis, "fetch").mockImplementation(async (ruta) => {
    if (ruta.startsWith("/api/v1/productos")) {
      return respuestaDePrueba(200, catalogoApiDePrueba());
    }
    return otra;
  });
}

function llamadasAlCatalogo(fetchFalso) {
  return fetchFalso.mock.calls.filter(([ruta]) => ruta.startsWith("/api/v1/productos"));
}

// fetch se simula en cada prueba: no hay backend corriendo
beforeEach(() => {
  simularBackend();
});

afterEach(() => {
  vi.restoreAllMocks();
});

function renderizarApp(ruta = "/") {
  render(
    <MemoryRouter initialEntries={[ruta]}>
      <App />
    </MemoryRouter>
  );
}

// Deja una sesión guardada, como si el usuario ya hubiera iniciado sesión antes
function conSesion(rol, nombre = "Usuario de prueba") {
  guardarTokens({ accessToken: accessDePrueba({ rol, nombre }), refreshToken: refreshDePrueba() });
}

// El backend responde al login (o al registro) con un par de tokens del rol indicado
function backendResponde(rol, nombre, status = 200) {
  return simularBackend(
    respuestaDePrueba(status, { accessToken: accessDePrueba({ rol, nombre }), refreshToken: refreshDePrueba() })
  );
}

async function ingresar(correo) {
  await userEvent.type(screen.getByLabelText("Correo"), correo);
  await userEvent.type(screen.getByLabelText("Contraseña"), "Maestros2026");
  await userEvent.click(screen.getByRole("button", { name: "Ingresar" }));
}

function menu() {
  // Hay enlaces también en el pie: se busca solo dentro del menú principal
  return within(screen.getByRole("navigation", { name: "Navegación principal" }));
}

describe("App", () => {
  it("parte en el inicio", () => {
    renderizarApp();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Ferretería Los Maestros");
  });

  it("el botón lleva al catálogo y sube al inicio de la ventana", async () => {
    renderizarApp();
    window.scrollTo.mockClear();

    await userEvent.click(await screen.findByRole("link", { name: "Ver catálogo completo" }));

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Catálogo");
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it("al hacer clic en una tarjeta abre su detalle", async () => {
    renderizarApp("/catalogo");

    await userEvent.click(await screen.findByRole("link", { name: "Cemento Polpaico gris 25 kg" }));

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Cemento Polpaico gris 25 kg");
  });

  it("agregar productos actualiza el contador del encabezado", async () => {
    renderizarApp("/catalogo");
    const botonCemento = await screen.findByRole("button", { name: "Agregar Cemento Polpaico gris 25 kg al carrito" });

    await userEvent.click(botonCemento);
    await userEvent.click(botonCemento);

    expect(menu().getByRole("link", { name: /carrito/i })).toHaveTextContent("2");
  });

  it("recupera el carrito guardado al abrir la página", () => {
    localStorage.setItem("carrito", '[{"codigo":"MC001","cantidad":3}]');
    renderizarApp();

    expect(menu().getByRole("link", { name: /carrito/i })).toHaveTextContent("3");
  });

  it("en la página del carrito se puede sumar y el cambio se guarda", async () => {
    renderizarApp("/catalogo");
    await userEvent.click(await screen.findByRole("button", { name: "Agregar Cemento Polpaico gris 25 kg al carrito" }));

    await userEvent.click(menu().getByRole("link", { name: /carrito/i }));
    await userEvent.click(screen.getByRole("button", { name: "Sumar una unidad de Cemento Polpaico gris 25 kg" }));

    // 5990 x 2 = 11980; aparece en el subtotal y en el total.
    expect(screen.getAllByText("$11.980")).toHaveLength(2);
    expect(localStorage.getItem("carrito")).toBe('[{"codigo":"MC001","cantidad":2}]');
  });

  it("en la página del carrito se puede quitar un producto y vaciarlo", async () => {
    localStorage.setItem("carrito", '[{"codigo":"MC001","cantidad":1},{"codigo":"PT001","cantidad":1}]');
    renderizarApp("/carrito");

    await userEvent.click(await screen.findByRole("button", { name: "Quitar Cemento Polpaico gris 25 kg del carrito" }));
    expect(screen.getAllByRole("button", { name: /^Quitar/ })).toHaveLength(1);

    await userEvent.click(screen.getByRole("button", { name: "Vaciar carrito" }));
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Tu carrito está vacío");
  });
});

describe("sesión y rutas protegidas", () => {
  it("sin sesión, una vista protegida lleva a iniciar sesión", () => {
    renderizarApp("/vendedor");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Iniciar sesión");
  });

  it("con un rol que no corresponde muestra acceso restringido", () => {
    conSesion("CLIENTE");
    renderizarApp("/admin/usuarios");
    expect(screen.getByRole("heading", { name: "Esta vista no está disponible para tu rol" })).toBeInTheDocument();
  });

  it("el administrador con sesión abre la gestión de roles", () => {
    conSesion("ADMINISTRADOR", "Alex Muñoz Herrera");
    renderizarApp("/admin/usuarios");
    expect(screen.getByRole("heading", { name: "Usuarios y roles" })).toBeInTheDocument();
  });

  it("el vendedor inicia sesión y llega a su panel", async () => {
    backendResponde("VENDEDOR", "Valentina Soto Pizarro");
    renderizarApp("/acceso");

    await ingresar("vendedor@ferreteria.cl");

    expect(await screen.findByRole("heading", { name: "Panel del vendedor" })).toBeInTheDocument();
  });

  it("el administrador inicia sesión y llega a su panel", async () => {
    backendResponde("ADMINISTRADOR", "Alex Muñoz Herrera");
    renderizarApp("/acceso");

    await ingresar("admin@ferreteria.cl");

    expect(await screen.findByRole("heading", { name: "Panel de administración" })).toBeInTheDocument();
  });

  it("el cliente inicia sesión, ve su cuenta y al cerrar sesión se borran los tokens pero no el carrito", async () => {
    localStorage.setItem("carrito", '[{"codigo":"MC001","cantidad":1}]');
    backendResponde("CLIENTE", "Camila Rojas Díaz");
    renderizarApp("/acceso");

    await ingresar("cliente@ferreteria.cl");
    expect(await screen.findByRole("heading", { name: "Hola, Camila Rojas Díaz" })).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Cerrar sesión" }));

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Ferretería Los Maestros");
    expect(leerTokens()).toBeNull();
    expect(localStorage.getItem("carrito")).toBe('[{"codigo":"MC001","cantidad":1}]');
  });

  it("crear una cuenta inicia sesión y abre la cuenta del cliente", async () => {
    backendResponde("CLIENTE", "María Soto Díaz", 201);
    renderizarApp("/registro");

    await userEvent.type(screen.getByLabelText("RUT"), "12.345.678-5");
    await userEvent.type(screen.getByLabelText("Correo"), "maria@correo.cl");
    await userEvent.type(screen.getByLabelText("Nombre"), "María");
    await userEvent.type(screen.getByLabelText("Apellidos"), "Soto Díaz");
    await userEvent.type(screen.getByLabelText("Contraseña"), "Clave2026x");
    await userEvent.type(screen.getByLabelText("Confirmar contraseña"), "Clave2026x");
    await userEvent.click(screen.getByRole("button", { name: "Crear cuenta" }));

    expect(await screen.findByRole("heading", { name: "Hola, María Soto Díaz" })).toBeInTheDocument();
  });

  it("al recargar con el access vencido y el refresh vigente, renueva antes de mostrar la vista", async () => {
    guardarTokens({ accessToken: accessDePrueba({ rol: "ADMINISTRADOR", minutos: -1 }), refreshToken: refreshDePrueba() });
    const fetchFalso = backendResponde("ADMINISTRADOR", "Alex Muñoz Herrera");

    renderizarApp("/admin");

    expect(screen.getByText("Verificando sesión…")).toBeInTheDocument();
    expect(await screen.findByRole("heading", { name: "Panel de administración" })).toBeInTheDocument();
    expect(fetchFalso.mock.calls[0][0]).toBe("/api/v1/auth/refresh");
  });

  it("al recargar, si el backend rechaza el refresh, queda sin sesión", async () => {
    guardarTokens({ accessToken: accessDePrueba({ minutos: -1 }), refreshToken: refreshDePrueba() });
    simularBackend(respuestaDePrueba(401, { mensaje: "Token inválido o expirado" }));

    renderizarApp("/cuenta");

    expect(await screen.findByRole("heading", { level: 1, name: "Iniciar sesión" })).toBeInTheDocument();
    expect(leerTokens()).toBeNull();
  });

  it("al recargar con los dos tokens vencidos, se limpia la sesión", () => {
    guardarTokens({ accessToken: accessDePrueba({ minutos: -1 }), refreshToken: refreshDePrueba({ dias: -1 }) });

    renderizarApp("/cuenta");

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Iniciar sesión");
    expect(leerTokens()).toBeNull();
  });

  it("si la sesión expira en medio del uso, lleva a iniciar sesión", () => {
    conSesion("CLIENTE", "Camila Rojas Díaz");
    renderizarApp("/cuenta");
    expect(screen.getByRole("heading", { name: "Hola, Camila Rojas Díaz" })).toBeInTheDocument();

    act(() => {
      window.dispatchEvent(new Event("sesion-expirada"));
    });

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Iniciar sesión");
  });

  it("el administrador ve los usuarios del backend y no puede tocar su propia cuenta", async () => {
    conSesion("ADMINISTRADOR", "Alex Muñoz Herrera");   // accessDePrueba usa el id 3
    simularBackend(
      respuestaDePrueba(200, [
        { id: 2, rut: "22222222-2", nombre: "Valentina", apellidos: "Soto Pizarro", correo: "vendedor@ferreteria.cl", rol: "VENDEDOR" },
        { id: 3, rut: "11111111-1", nombre: "Alex", apellidos: "Muñoz Herrera", correo: "admin@ferreteria.cl", rol: "ADMINISTRADOR" },
      ])
    );
    renderizarApp("/admin/usuarios");

    expect(await screen.findByRole("row", { name: /Valentina Soto Pizarro/ })).toBeInTheDocument();
    const propia = screen.getByRole("row", { name: /Alex Muñoz Herrera/ });
    expect(within(propia).getByRole("button", { name: "Eliminar" })).toBeDisabled();
  });
});

describe("menú por rol", () => {
  it("el invitado ve la tienda, el carrito y los accesos", () => {
    renderizarApp();
    expect(menu().getByRole("link", { name: "Catálogo" })).toBeInTheDocument();
    expect(menu().getByRole("link", { name: /carrito/i })).toBeInTheDocument();
    expect(menu().getByRole("link", { name: "Iniciar sesión" })).toBeInTheDocument();
    expect(menu().getByRole("link", { name: "Crear cuenta" })).toBeInTheDocument();
  });

  it("el vendedor solo ve Productos y Órdenes", () => {
    conSesion("VENDEDOR", "Valentina Soto Pizarro");
    renderizarApp("/vendedor");

    expect(menu().getByRole("link", { name: "Productos" })).toBeInTheDocument();
    expect(menu().getByRole("link", { name: "Órdenes" })).toBeInTheDocument();
    expect(menu().queryByRole("link", { name: "Inicio" })).not.toBeInTheDocument();
    expect(menu().queryByRole("link", { name: "Catálogo" })).not.toBeInTheDocument();
    expect(menu().queryByRole("link", { name: /carrito/i })).not.toBeInTheDocument();
    expect(menu().queryByRole("link", { name: "Administración" })).not.toBeInTheDocument();
  });

  it("el administrador ve Administración y no el carrito", () => {
    conSesion("ADMINISTRADOR");
    renderizarApp();

    expect(menu().getByRole("link", { name: "Administración" })).toBeInTheDocument();
    expect(menu().queryByRole("link", { name: /carrito/i })).not.toBeInTheDocument();
  });

  it("el cliente ve Mi cuenta y el carrito", () => {
    conSesion("CLIENTE");
    renderizarApp();

    expect(menu().getByRole("link", { name: "Mi cuenta" })).toBeInTheDocument();
    expect(menu().getByRole("link", { name: /carrito/i })).toBeInTheDocument();
  });
});

describe("catálogo desde ms-catalogo", () => {
  it("muestra que está cargando y después los 85 productos que entrega la API", async () => {
    renderizarApp("/catalogo");

    expect(screen.getByText("Cargando catálogo…")).toBeInTheDocument();
    expect(await screen.findAllByRole("article")).toHaveLength(85);
    expect(screen.queryByText("Cargando catálogo…")).not.toBeInTheDocument();
  });

  it("si la API no responde avisa, y Reintentar vuelve a pedir el catálogo", async () => {
    let caido = true;
    vi.spyOn(globalThis, "fetch").mockImplementation(async () => {
      if (caido) {
        throw new TypeError("Failed to fetch");
      }
      return respuestaDePrueba(200, catalogoApiDePrueba());
    });
    renderizarApp("/catalogo");

    expect(await screen.findByRole("alert")).toHaveTextContent("No se pudo cargar el catálogo");

    caido = false;
    await userEvent.click(screen.getByRole("button", { name: "Reintentar" }));

    expect(await screen.findAllByRole("article")).toHaveLength(85);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("al iniciar sesión vuelve a pedir el catálogo, ahora con el token (el admin recibe precioCompra)", async () => {
    const fetchFalso = backendResponde("ADMINISTRADOR", "Alex Muñoz Herrera");
    renderizarApp("/acceso");

    await ingresar("admin@ferreteria.cl");
    await screen.findByRole("heading", { name: "Panel de administración" });

    const llamadas = llamadasAlCatalogo(fetchFalso);
    expect(llamadas).toHaveLength(2);
    expect(llamadas[0][1].headers.Authorization).toBeUndefined();
    expect(llamadas[1][1].headers.Authorization).toMatch(/^Bearer /);
  });

  it("el vendedor ve los productos en solo lectura, con su stock", async () => {
    conSesion("VENDEDOR", "Valentina Soto Pizarro");
    renderizarApp("/vendedor/productos");

    expect(await screen.findByRole("heading", { name: "Productos" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "Cemento Polpaico gris 25 kg" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Editar" })).not.toBeInTheDocument();
  });

  it("los precios del carrito salen del catálogo de la API, no de datos guardados en el navegador", async () => {
    localStorage.setItem("carrito", '[{"codigo":"MC001","cantidad":2}]');
    vi.spyOn(globalThis, "fetch").mockImplementation(async () => {
      const catalogo = catalogoApiDePrueba().map((producto) =>
        producto.codigo === "MC001" ? { ...producto, precioVenta: 6490 } : producto
      );
      return respuestaDePrueba(200, catalogo);
    });
    renderizarApp("/carrito");

    // 6490 x 2 = 12980, en el subtotal y en el total
    expect(await screen.findAllByText("$12.980")).toHaveLength(2);
  });
});
