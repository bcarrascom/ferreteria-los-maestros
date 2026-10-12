import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BotonCategoria from "./BotonCategoria";

describe("BotonCategoria", () => {
  it("muestra la etiqueta que recibe", () => {
    render(<BotonCategoria etiqueta="Pinturas" activo={false} alHacerClic={() => {}} />);
    expect(screen.getByRole("button", { name: "Pinturas" })).toBeInTheDocument();
  });

  it("llama a la función al hacer clic", async () => {
    const funcionFalsa = vi.fn();
    render(<BotonCategoria etiqueta="Pinturas" activo={false} alHacerClic={funcionFalsa} />);

    await userEvent.click(screen.getByRole("button", { name: "Pinturas" }));

    expect(funcionFalsa).toHaveBeenCalledTimes(1);
  });

  it("se marca como presionado cuando está activo", () => {
    render(<BotonCategoria etiqueta="Pinturas" activo={true} alHacerClic={() => {}} />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
  });
});
