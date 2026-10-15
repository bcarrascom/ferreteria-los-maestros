import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";  // Envolvemos los render en memoryRouter para que funcionen los Link y useNavigate
import Catalogo from "./Catalogo";

describe("Catalogo", () => {
  it("parte mostrando los 85 productos", () => {
    render(
      <MemoryRouter>
        <Catalogo />
      </MemoryRouter>
    );
    expect(screen.getAllByRole("article")).toHaveLength(85);
  });

    it("al elegir una categoría muestra solo sus productos", async () => {
    render(
      <MemoryRouter>
        <Catalogo />
      </MemoryRouter>
    );

    await userEvent.click(screen.getByRole("button", { name: "Pinturas" }));

    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(1);
    expect(screen.getAllByRole("article")).toHaveLength(9);
  });

  it("vuelve a mostrar todo al elegir Todas", async () => {
    render(
      <MemoryRouter>
        <Catalogo />
      </MemoryRouter>
    );

    await userEvent.click(screen.getByRole("button", { name: "Pinturas" }));
    await userEvent.click(screen.getByRole("button", { name: "Todas" }));

    expect(screen.getAllByRole("article")).toHaveLength(85);
  });

  it("guarda la categoría elegida en localStorage", async () => {
    render(
      <MemoryRouter>
        <Catalogo />
      </MemoryRouter>
    );

    await userEvent.click(screen.getByRole("button", { name: "Pinturas" }));

    expect(JSON.parse(localStorage.getItem("categoriaActiva"))).toBe("Pinturas");
  });

  it("recuerda la categoría elegida en una visita anterior", () => {
    localStorage.setItem("categoriaActiva", JSON.stringify("Pinturas"));

    render(
      <MemoryRouter>
        <Catalogo />
      </MemoryRouter>
    );

    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(1);
    expect(screen.getAllByRole("article")).toHaveLength(9);
  });

  it("si la categoría guardada ya no existe, muestra todas", () => {
    localStorage.setItem("categoriaActiva", JSON.stringify("Inventada"));

    render(
      <MemoryRouter>
        <Catalogo />
      </MemoryRouter>
    );

    expect(screen.getAllByRole("article")).toHaveLength(85);
  });
});
