import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AccesoRestringido from "./AccesoRestringido";
import NoEncontrada from "./NoEncontrada";
import PanelAdministrador from "./PanelAdministrador";
import PedidosVendedor from "./PedidosVendedor";

function renderizar(elemento) {
  render(<MemoryRouter>{elemento}</MemoryRouter>);
}

describe("páginas simples", () => {
  it("NoEncontrada ofrece volver al inicio", () => {
    renderizar(<NoEncontrada />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Página no encontrada");
    expect(screen.getByRole("link", { name: "Ir al inicio" })).toHaveAttribute("href", "/");
  });

  it("PanelAdministrador muestra las cantidades que recibe", () => {
    renderizar(<PanelAdministrador cantidadUsuarios={4} cantidadProductos={85} />);
    expect(screen.getByText("4 cuentas registradas")).toBeInTheDocument();
    expect(screen.getByText("85 productos en el catálogo")).toBeInTheDocument();
  });

  it("PedidosVendedor lista los pedidos de demostración", () => {
    renderizar(<PedidosVendedor />);
    // 1 fila de encabezado + 3 pedidos
    expect(screen.getAllByRole("row")).toHaveLength(4);
  });
});

describe("AccesoRestringido", () => {
  it("sin sesión invita a iniciar sesión", () => {
    renderizar(<AccesoRestringido usuario={null} />);
    expect(screen.getByRole("link", { name: "Iniciar sesión" })).toHaveAttribute("href", "/acceso");
  });

  it("con sesión dice el rol y ofrece volver a la tienda", () => {
    renderizar(<AccesoRestringido usuario={{ nombre: "Camila", rol: "comprador" }} />);
    expect(screen.getByText("Tu cuenta tiene el rol comprador.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Volver a la tienda" })).toHaveAttribute("href", "/");
  });
});
