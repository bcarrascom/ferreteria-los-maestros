import { fireEvent, render, screen } from "@testing-library/react";
import Hero from "./Hero";

describe("Hero", () => {
  it("el título se desvanece al hacer scroll", () => {
    render(<Hero />);

    window.scrollY = 350;
    fireEvent.scroll(window);

    expect(screen.getByRole("heading", { level: 1 })).toHaveStyle({ opacity: "0" });
    window.scrollY = 0;
  });

  it("no se anima si el usuario pidió reducir el movimiento", () => {
    window.matchMedia.mockReturnValueOnce({ matches: true });
    render(<Hero />);

    window.scrollY = 350;
    fireEvent.scroll(window);

    expect(screen.getByRole("heading", { level: 1 })).toHaveStyle({ opacity: "1" });
    window.scrollY = 0;
  });
});
