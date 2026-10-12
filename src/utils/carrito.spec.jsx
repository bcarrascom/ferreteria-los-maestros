// src/utils/carrito.spec.jsx
import {
  agregarAlCarrito,
  calcularTotal,
  cambiarCantidad,
  contarProductos,
  quitarDelCarrito,
} from "./carrito";

// Productos de prueba: AA002 permite probar "sin stock", que no existe en los datos reales.
const taladro = { codigo: "AA001", stock: 3 };
const sinStock = { codigo: "AA002", stock: 0 };
const martillo = { codigo: "AA003", stock: 10 };

describe("agregarAlCarrito", () => {
  it("agrega un producto nuevo con cantidad 1", () => {
    const carrito = agregarAlCarrito([], taladro);
    expect(carrito).toEqual([{ codigo: "AA001", cantidad: 1 }]);
  });

  it("si el producto ya está, suma 1 en vez de duplicarlo", () => {
    const inicial = [
      { codigo: "AA001", cantidad: 1 },
      { codigo: "AA003", cantidad: 1 },
    ];
    const carrito = agregarAlCarrito(inicial, taladro);

    expect(carrito).toHaveLength(2);
    expect(carrito[0].cantidad).toBe(2);
    expect(carrito[1].cantidad).toBe(1);
  });

  it("no supera el stock disponible", () => {
    const inicial = [{ codigo: "AA001", cantidad: 3 }];
    const carrito = agregarAlCarrito(inicial, taladro);
    expect(carrito[0].cantidad).toBe(3);
  });

  it("no agrega un producto sin stock", () => {
    expect(agregarAlCarrito([], sinStock)).toEqual([]);
  });

  it("no modifica el carrito original", () => {
    const inicial = [{ codigo: "AA001", cantidad: 1 }];
    agregarAlCarrito(inicial, taladro);
    agregarAlCarrito(inicial, martillo);

    expect(inicial).toEqual([{ codigo: "AA001", cantidad: 1 }]);
  });
});

describe("cambiarCantidad", () => {
  const inicial = [
    { codigo: "AA001", cantidad: 1 },
    { codigo: "AA003", cantidad: 1 },
  ];

  it("cambia solo la cantidad del producto indicado", () => {
    const carrito = cambiarCantidad(inicial, martillo, 4);
    expect(carrito).toEqual([
      { codigo: "AA001", cantidad: 1 },
      { codigo: "AA003", cantidad: 4 },
    ]);
  });

  it("si piden más que el stock, deja el máximo disponible", () => {
    const carrito = cambiarCantidad(inicial, taladro, 99);
    expect(carrito[0].cantidad).toBe(3);
  });

  it("bajar de 1 quita el producto", () => {
    const carrito = cambiarCantidad(inicial, taladro, 0);
    expect(carrito).toEqual([{ codigo: "AA003", cantidad: 1 }]);
  });
});

describe("quitarDelCarrito", () => {
  it("quita el producto con ese código", () => {
    const inicial = [
      { codigo: "AA001", cantidad: 2 },
      { codigo: "AA003", cantidad: 1 },
    ];
    expect(quitarDelCarrito(inicial, "AA001")).toEqual([{ codigo: "AA003", cantidad: 1 }]);
  });
});

describe("contarProductos", () => {
  it("suma las cantidades de todos los productos", () => {
    const carrito = [
      { codigo: "AA001", cantidad: 2 },
      { codigo: "AA003", cantidad: 3 },
    ];
    expect(contarProductos(carrito)).toBe(5);
  });
});

describe("calcularTotal", () => {
  it("suma precio por cantidad con los precios reales", () => {
    // MC001 cuesta $5.990 y PT001 $9.990: 5990 x 2 + 9990 x 1 = 21970
    const carrito = [
      { codigo: "MC001", cantidad: 2 },
      { codigo: "PT001", cantidad: 1 },
    ];
    expect(calcularTotal(carrito)).toBe(21970);
  });

  it("ignora códigos que ya no existen", () => {
    const carrito = [
      { codigo: "MC001", cantidad: 1 },
      { codigo: "XX999", cantidad: 5 },
    ];
    expect(calcularTotal(carrito)).toBe(5990);
  });
});
