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


  it("recupera el carrito guardado al iniciar", () => {
    // Simula que el usuario ya había agregado 3 cementos en una visita anterior.
    localStorage.setItem("carrito", JSON.stringify([{ codigo: "MC001", cantidad: 3 }]));

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    const menu = screen.getByRole("navigation", { name: "Navegación principal" });
    expect(within(menu).getByRole("link", { name: /carrito/i })).toHaveTextContent("3");
  });


  it("guarda el carrito en localStorage al agregar un producto", async () => {
    render(
      <MemoryRouter initialEntries={["/catalogo"]}>
        <App />
      </MemoryRouter>
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Agregar Cemento Polpaico gris 25 kg al carrito" })
    );

    expect(JSON.parse(localStorage.getItem("carrito"))).toEqual([{ codigo: "MC001", cantidad: 1 }]);
  });

});
