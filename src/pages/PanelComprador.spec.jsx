import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { respuestaDePrueba } from "../test/tokens";
import PanelComprador from "./PanelComprador";

afterEach(() => {
  vi.restoreAllMocks();
});

function renderizarCuenta() {
  render(
    <MemoryRouter>
      <PanelComprador usuario={{ id: 3, nombre: "Camila Rojas Díaz", rol: "CLIENTE" }} />
    </MemoryRouter>
  );
}

describe("PanelComprador (Mi cuenta)", () => {
  it("muestra los datos que devuelve /usuarios/me", async () => {
    const fetchFalso = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      respuestaDePrueba(200, {
        id: 3, rut: "33333333-3", nombre: "Camila", apellidos: "Rojas Díaz", correo: "cliente@ferreteria.cl",
        telefono: null, region: "Coquimbo", comuna: "La Serena", direccion: "Rengifo 100",
      })
    );
    renderizarCuenta();

    expect(screen.getByRole("heading", { name: "Hola, Camila Rojas Díaz" })).toBeInTheDocument();
    expect(await screen.findByText("33333333-3")).toBeInTheDocument();
    expect(screen.getByText("Rengifo 100, La Serena, Coquimbo")).toBeInTheDocument();
    expect(screen.getByText("—")).toBeInTheDocument();             // sin teléfono
    expect(fetchFalso.mock.calls[0][0]).toBe("/api/v1/usuarios/me");
  });

  it("si no se pueden cargar los datos, avisa", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new TypeError("Failed to fetch"));
    renderizarCuenta();

    expect(await screen.findByText("No se pudieron cargar los datos de tu cuenta.")).toBeInTheDocument();
  });
});
