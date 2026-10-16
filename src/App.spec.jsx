import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

describe("App", () => {
  it("parte en el inicio", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Ferretería Los Maestros");
  });

  it("no permite abrir el panel del vendedor sin una sesión de vendedor", () => {
  render(
    <MemoryRouter initialEntries={["/vendedor"]}>
      <App />
    </MemoryRouter>
  );

  expect(
    screen.getByRole("heading", { name: "Esta vista no está disponible para tu rol" })
  ).toBeInTheDocument();
});

it("permite al administrador abrir la gestión de roles", () => {
  localStorage.setItem("sesion-ferreteria", JSON.stringify({
    id: "cuenta-admin",
    nombre: "Alex Administrador",
    correo: "admin@ferreteria.cl",
    rol: "administrador",
  }));

  render(
    <MemoryRouter initialEntries={["/admin/usuarios"]}>
      <App />
    </MemoryRouter>
  );

  expect(screen.getByRole("heading", { name: "Usuarios y roles" })).toBeInTheDocument();
});

it("inicia la sesión local de vendedor con el correo de demostración", async () => {
  const usuario = userEvent.setup();

  render(
    <MemoryRouter initialEntries={["/acceso"]}>
      <App />
    </MemoryRouter>
  );

  await usuario.type(screen.getByLabelText("Correo"), "vendedor@ferreteria.cl");
  await usuario.click(screen.getByRole("button", { name: "Continuar" }));

  expect(screen.getByRole("heading", { name: "Panel del vendedor" })).toBeInTheDocument();
});

it("crea una cuenta de comprador y abre su vista de cuenta", async () => {
  const usuario = userEvent.setup();

  render(
    <MemoryRouter initialEntries={["/registro"]}>
      <App />
    </MemoryRouter>
  );

  await usuario.type(screen.getByLabelText("Nombre"), "María Soto");
  await usuario.type(screen.getByLabelText("Correo"), "maria@mail.cl");
  await usuario.click(screen.getByRole("button", { name: "Crear cuenta" }));

  expect(screen.getByRole("heading", { name: "Hola, María Soto" })).toBeInTheDocument();
});

  
  it("el botón lleva al catálogo y sube al inicio de la ventana", async () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    window.scrollTo.mockClear();

    await userEvent.click(screen.getByRole("link", { name: "Ver catálogo completo" }));

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Catálogo");
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  
  it("al hacer clic en una tarjeta abre su detalle", async () => {
    render(
      <MemoryRouter initialEntries={["/catalogo"]}>
        <App />
      </MemoryRouter>
    );

    await userEvent.click(screen.getByRole("link", { name: "Cemento Polpaico gris 25 kg" }));

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Cemento Polpaico gris 25 kg");
  });


    it("agregar productos actualiza el contador del encabezado", async () => {
    render(
      <MemoryRouter initialEntries={["/catalogo"]}>
        <App />
      </MemoryRouter>
    );
    const botonCemento = screen.getByRole("button", { name: "Agregar Cemento Polpaico gris 25 kg al carrito" });

    await userEvent.click(botonCemento);
    await userEvent.click(botonCemento);

    // Hay un enlace "Carrito" también en el pie: se busca solo dentro del menú principal.
    const menu = screen.getByRole("navigation", { name: "Navegación principal" });
    expect(within(menu).getByRole("link", { name: /carrito/i })).toHaveTextContent("2");
  });


    it("recupera el carrito guardado al abrir la página", () => {
    localStorage.setItem("carrito", '[{"codigo":"MC001","cantidad":3}]');

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    const menu = screen.getByRole("navigation", { name: "Navegación principal" });
    expect(within(menu).getByRole("link", { name: /carrito/i })).toHaveTextContent("3");
  });

  it("en la página del carrito se puede sumar y el cambio se guarda", async () => {
    render(
      <MemoryRouter initialEntries={["/catalogo"]}>
        <App />
      </MemoryRouter>
    );
    await userEvent.click(screen.getByRole("button", { name: "Agregar Cemento Polpaico gris 25 kg al carrito" }));

    const menu = screen.getByRole("navigation", { name: "Navegación principal" });
    await userEvent.click(within(menu).getByRole("link", { name: /carrito/i }));
    await userEvent.click(screen.getByRole("button", { name: "Sumar una unidad de Cemento Polpaico gris 25 kg" }));

    // 5990 x 2 = 11980; aparece en el subtotal y en el total.
    expect(screen.getAllByText("$11.980")).toHaveLength(2);
    expect(localStorage.getItem("carrito")).toBe('[{"codigo":"MC001","cantidad":2}]');
  });

  it("en la página del carrito se puede quitar un producto y vaciarlo", async () => {
    localStorage.setItem("carrito", '[{"codigo":"MC001","cantidad":1},{"codigo":"PT001","cantidad":1}]');
    render(
      <MemoryRouter initialEntries={["/carrito"]}>
        <App />
      </MemoryRouter>
    );

    await userEvent.click(screen.getByRole("button", { name: "Quitar Cemento Polpaico gris 25 kg del carrito" }));
    expect(screen.getAllByRole("button", { name: /^Quitar/ })).toHaveLength(1);

    await userEvent.click(screen.getByRole("button", { name: "Vaciar carrito" }));
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Tu carrito está vacío");
  });


});
