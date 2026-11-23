import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { accessDePrueba, refreshDePrueba, respuestaDePrueba } from "./test/tokens";
import { guardarTokens, leerTokens } from "./utils/sesion";
import App from "./App";

// fetch se simula en cada prueba que habla con el backend
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
  return vi.spyOn(globalThis, "fetch").mockResolvedValue(
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

    await userEvent.click(screen.getByRole("link", { name: "Ver catálogo completo" }));

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Catálogo");
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it("al hacer clic en una tarjeta abre su detalle", async () => {
    renderizarApp("/catalogo");

    await userEvent.click(screen.getByRole("link", { name: "Cemento Polpaico gris 25 kg" }));

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Cemento Polpaico gris 25 kg");
  });

  it("agregar productos actualiza el contador del encabezado", async () => {
    renderizarApp("/catalogo");
    const botonCemento = screen.getByRole("button", { name: "Agregar Cemento Polpaico gris 25 kg al carrito" });

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
    await userEvent.click(screen.getByRole("button", { name: "Agregar Cemento Polpaico gris 25 kg al carrito" }));

    await userEvent.click(menu().getByRole("link", { name: /carrito/i }));
    await userEvent.click(screen.getByRole("button", { name: "Sumar una unidad de Cemento Polpaico gris 25 kg" }));

    // 5990 x 2 = 11980; aparece en el subtotal y en el total.
    expect(screen.getAllByText("$11.980")).toHaveLength(2);
    expect(localStorage.getItem("carrito")).toBe('[{"codigo":"MC001","cantidad":2}]');
  });

  it("en la página del carrito se puede quitar un producto y vaciarlo", async () => {
    localStorage.setItem("carrito", '[{"codigo":"MC001","cantidad":1},{"codigo":"PT001","cantidad":1}]');
    renderizarApp("/carrito");

    await userEvent.click(screen.getByRole("button", { name: "Quitar Cemento Polpaico gris 25 kg del carrito" }));
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

  it("el administrador crea, cambia de rol y quita usuarios", async () => {
    conSesion("ADMINISTRADOR", "Alex Muñoz Herrera");
    renderizarApp("/admin/usuarios");

    await userEvent.type(screen.getByLabelText("Nombre"), "Pedro");
    await userEvent.type(screen.getByLabelText("Correo"), "pedro@mail.cl");
    await userEvent.click(screen.getByRole("button", { name: "Crear" }));
    expect(screen.getByRole("row", { name: /Pedro/ })).toBeInTheDocument();

    await userEvent.selectOptions(screen.getByLabelText("Rol de Pedro"), "VENDEDOR");
    expect(screen.getByLabelText("Rol de Pedro")).toHaveValue("VENDEDOR");

    const fila = screen.getByRole("row", { name: /Pedro/ });
    await userEvent.click(within(fila).getByRole("button", { name: "Quitar" }));
    expect(screen.queryByRole("row", { name: /Pedro/ })).not.toBeInTheDocument();
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
