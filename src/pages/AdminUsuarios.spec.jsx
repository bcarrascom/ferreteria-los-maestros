import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { usuariosDePrueba } from "../utils/usuarios";
import AdminUsuarios from "./AdminUsuarios";

// La sesión es la del administrador (el tercer usuario de prueba).
const administrador = usuariosDePrueba[2];

function renderizarAdmin(alGuardar, alQuitar) {
  render(
    <AdminUsuarios
      usuarios={usuariosDePrueba}
      usuarioActual={administrador}
      alGuardar={alGuardar}
      alQuitar={alQuitar}
    />
  );
}

describe("AdminUsuarios", () => {
  it("pide nombre y un correo válido", async () => {
    const funcionFalsa = vi.fn();
    renderizarAdmin(funcionFalsa, vi.fn());

    await userEvent.click(screen.getByRole("button", { name: "Crear" }));

    expect(screen.getByRole("alert")).toHaveTextContent("Ingresa un nombre y un correo válido.");
    expect(funcionFalsa).not.toHaveBeenCalled();
  });

  it("no permite un correo que ya existe", async () => {
    renderizarAdmin(vi.fn(), vi.fn());

    await userEvent.type(screen.getByLabelText("Nombre"), "Otra");
    await userEvent.type(screen.getByLabelText("Correo"), "vendedor@ferreteria.cl");
    await userEvent.click(screen.getByRole("button", { name: "Crear" }));

    expect(screen.getByRole("alert")).toHaveTextContent("Ya existe una cuenta con ese correo.");
  });

  it("crea un usuario con el rol elegido y limpia el formulario", async () => {
    const funcionFalsa = vi.fn();
    renderizarAdmin(funcionFalsa, vi.fn());

    await userEvent.type(screen.getByLabelText("Nombre"), "Pedro");
    await userEvent.type(screen.getByLabelText("Correo"), "Pedro@Mail.cl");
    await userEvent.selectOptions(screen.getByLabelText("Rol"), "vendedor");
    await userEvent.click(screen.getByRole("button", { name: "Crear" }));

    expect(funcionFalsa).toHaveBeenCalledWith(
      expect.objectContaining({ nombre: "Pedro", correo: "pedro@mail.cl", rol: "vendedor" })
    );
    expect(screen.getByLabelText("Nombre")).toHaveValue("");
  });

  it("cambiar el rol en la tabla actualiza ese usuario", async () => {
    const funcionFalsa = vi.fn();
    renderizarAdmin(funcionFalsa, vi.fn());

    await userEvent.selectOptions(screen.getByLabelText("Rol de Camila Compradora"), "vendedor");

    expect(funcionFalsa).toHaveBeenCalledWith({ ...usuariosDePrueba[0], rol: "vendedor" }, true);
  });

  it("Quitar entrega el id del usuario", async () => {
    const funcionFalsa = vi.fn();
    renderizarAdmin(vi.fn(), funcionFalsa);

    const fila = screen.getByRole("row", { name: /Valentina Vendedora/ });
    await userEvent.click(within(fila).getByRole("button", { name: "Quitar" }));

    expect(funcionFalsa).toHaveBeenCalledWith("cuenta-vendedor");
  });

  it("no deja cambiar ni quitar la propia cuenta", () => {
    renderizarAdmin(vi.fn(), vi.fn());

    const fila = screen.getByRole("row", { name: /Alex Administrador/ });
    expect(within(fila).getByRole("combobox")).toBeDisabled();
    expect(within(fila).getByRole("button", { name: "Quitar" })).toBeDisabled();
  });
});
