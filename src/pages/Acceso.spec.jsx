import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { usuariosDePrueba } from "../utils/usuarios";
import Acceso from "./Acceso";

function renderizarAcceso(alAcceder) {
  render(
    <MemoryRouter>
      <Acceso usuarios={usuariosDePrueba} alAcceder={alAcceder} />
    </MemoryRouter>
  );
}

describe("Acceso", () => {
  it("el campo de correo cambia al escribir", async () => {
    renderizarAcceso(vi.fn());
    await userEvent.type(screen.getByLabelText("Correo"), "hola@mail.cl");
    expect(screen.getByLabelText("Correo")).toHaveValue("hola@mail.cl");
  });

  it("muestra un error si el correo no está registrado", async () => {
    const funcionFalsa = vi.fn();
    renderizarAcceso(funcionFalsa);

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    await userEvent.type(screen.getByLabelText("Correo"), "nadie@mail.cl");
    await userEvent.click(screen.getByRole("button", { name: "Continuar" }));

    expect(screen.getByRole("alert")).toHaveTextContent("No encontramos ese correo");
    expect(funcionFalsa).not.toHaveBeenCalled();
  });

  it("con un correo registrado entrega ese usuario", async () => {
    const funcionFalsa = vi.fn();
    renderizarAcceso(funcionFalsa);

    await userEvent.type(screen.getByLabelText("Correo"), "admin@ferreteria.cl");
    await userEvent.click(screen.getByRole("button", { name: "Continuar" }));

    expect(funcionFalsa).toHaveBeenCalledWith(usuariosDePrueba[2]);
  });
});
