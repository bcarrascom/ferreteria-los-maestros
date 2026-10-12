// src/test/setup.js
import "@testing-library/jest-dom/vitest";

// jsdom no trae estas funciones del navegador: se simulan para todas las pruebas.
window.matchMedia = vi.fn(() => ({ matches: false }));
window.scrollTo = vi.fn();
