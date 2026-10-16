import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { usuariosDePrueba } from "../utils/usuarios";
import Registro from "./Registro";

function renderizarRegistro(alRegistrar) {
  render(
    <MemoryRouter>
      <Registro usuarios={usuariosDePrueba} alRegistrar={alRegistrar} />
    </MemoryRouter>
  );
}

describe("Registro", () => {
  it("muestra el error si el correo ya existe y no registra", async () => {
    const funcionFalsa = vi.fn();
    renderizarRegistro(funcionFalsa);

    await userEvent.type(screen.getByLabelText("Nombre"), "Otra Camila");
    await userEvent.type(screen.getByLabelText("Correo"), "comprador@ferreteria.cl");
    await userEvent.click(screen.getByRole("button", { name: "Crear cuenta" }));

    expect(screen.getByRole("alert")).toHaveTextContent("Ya existe una cuenta con ese correo.");
    expect(funcionFalsa).not.toHaveBeenCalled();
  });

  it("con datos válidos entrega el usuario nuevo", async () => {
    const funcionFalsa = vi.fn();
    renderizarRegistro(funcionFalsa);

    await userEvent.type(screen.getByLabelText("Nombre"), "Pedro");
    await userEvent.type(screen.getByLabelText("Correo"), "pedro@mail.cl");
    await userEvent.click(screen.getByRole("button", { name: "Crear cuenta" }));

    expect(funcionFalsa).toHaveBeenCalledWith(expect.objectContaining({ nombre: "Pedro", rol: "comprador" }));
  });
});
