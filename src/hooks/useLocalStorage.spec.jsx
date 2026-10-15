// src/hooks/useLocalStorage.spec.jsx
import { act, renderHook } from "@testing-library/react";
import { useLocalStorage } from "./useLocalStorage";

// renderHook monta un componente mínimo que solo usa el hook, para probarlo aislado.
describe("useLocalStorage", () => {
  it("sin nada guardado usa el valor inicial", () => {
    const { result } = renderHook(() => useLocalStorage("prueba", "inicial"));
    expect(result.current[0]).toBe("inicial");
  });

  it("lee lo que ya estaba guardado", () => {
    localStorage.setItem("prueba", JSON.stringify("guardado"));
    const { result } = renderHook(() => useLocalStorage("prueba", "inicial"));
    expect(result.current[0]).toBe("guardado");
  });

  it("guarda cada cambio en localStorage", () => {
    const { result } = renderHook(() => useLocalStorage("prueba", 0));

    act(() => result.current[1](5));

    expect(result.current[0]).toBe(5);
    expect(JSON.parse(localStorage.getItem("prueba"))).toBe(5);
  });

  it("si lo guardado está dañado, usa el valor inicial", () => {
    localStorage.setItem("prueba", "{no es json");
    const { result } = renderHook(() => useLocalStorage("prueba", []));
    expect(result.current[0]).toEqual([]);
  });

  it("aplica la función limpiar a lo leído", () => {
    localStorage.setItem("prueba", JSON.stringify(99));
    const { result } = renderHook(() =>
      useLocalStorage("prueba", 0, (numero) => Math.min(numero, 10))
    );
    expect(result.current[0]).toBe(10);
  });

  it("si el navegador no deja guardar, la app no se cae", () => {
    // Simula modo incógnito o almacenamiento lleno.
    const espia = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("almacenamiento lleno");
    });

    const { result } = renderHook(() => useLocalStorage("prueba", 0));
    act(() => result.current[1](3));

    expect(result.current[0]).toBe(3);
    espia.mockRestore();
  });
});
