# Ferretería Los Maestros — versión React (EA2)

## Qué es este proyecto

Versión en React del caso **Ferretería Los Maestros**, para la Experiencia 2 (EA2)
del ramo DSY1104 Desarrollo Fullstack II, Duoc UC. Sigue las **Guías 9 y 10**
(React con Vite; datos, props y estado).

**Repositorio separado a propósito.** El proyecto del Parcial 1 (HTML + CSS + JS
vanilla) vive en la carpeta hermana `../ferreteria-los-maestros` y **no se toca**.
La guía lo exige: son dos evidencias distintas.

En el repo del Parcial 1 hay un `git stash` con un intento de React mezclado dentro
de `index.html`. **No hacer `git stash pop` ahí.** Si se necesita algo de ese stash,
revisarlo con `git stash show -p` y copiarlo a mano.

## Estado actual

- [x] Paso 1 — Proyecto Vite + React creado e instalado (`npm create vite`, `npm install`)
- [x] Paso 2 — Limpiar plantilla de ejemplo de Vite (§4.2 de la guía)
- [ ] Paso 3 — Instalar React Bootstrap
- [ ] Paso 4 — Componentes base: Encabezado, Navegacion, Hero, PiePagina
- [ ] Paso 5 — `src/data/productos.js` con los 85 productos
- [ ] Paso 6 — TarjetaProducto y Catalogo (props, map, key)
- [ ] Paso 7 — Filtro por categoría (useState)
- [ ] Paso 8 — Carrito con estado, cantidades e inmutabilidad
- [ ] Paso 9 — Persistencia con useEffect + localStorage
- [ ] Paso 10 — Publicar en GitHub como repo nuevo

Versiones instaladas: React 19, Vite 8, Node 24. La guía fue escrita para React 18
y Vite anteriores; todo lo que enseña funciona igual.

## Cómo quiere trabajar Bruno

Estas reglas vienen del Parcial 1 y siguen vigentes.

1. **Explicar todo el código.** Tiene una presentación oral individual donde le
   preguntan por el código. Necesita saber qué hace cada bloque, por qué se eligió
   esa función o etiqueta, qué alternativa se descartó y qué pasaría si no estuviera.
   Ante la duda, explicar de más.
2. **Paso a paso.** Un bloque a la vez, explicando qué cambió en cada uno. No
   generar medio proyecto de golpe.
3. **Código básico y legible.** Cinco líneas obvias antes que una ingeniosa. Sin
   abstracciones prematuras, sin ternarios anidados, sin encadenamientos largos.
   Funciones cortas con nombres descriptivos en español.
4. **Español de Chile** en contenido, comentarios, variables y funciones.
5. **No tocar Git.** Bruno maneja el repositorio al 100%. Se pueden sugerir mensajes
   de commit, pero nunca ejecutar `git add`, `commit`, `push` ni crear ramas.
6. **Preguntar antes de asumir** si falta un dato.
7. **Comentarios cortos**, precisos y resumidos. Nada de decoración.

## Datos del caso (reutilizables del Parcial 1)

- Negocio familiar, 22 años, **Rengifo 320, La Serena, Región de Coquimbo**
- Teléfono `+56 9 1234 5678` · correo `contacto@ferreterialosmaestros.cl`
- Horario: lunes a viernes 8:30–19:00, sábados 9:00–14:00
- **85 productos en 9 categorías**: Herramientas (16), Electricidad (13),
  Gasfitería (12), Mat. Construcción (10), Pinturas (9), Tornillería (8),
  Madera (7), Jardín (5), Seguridad (5)
- Campos de cada producto en el JSON original: `codigo`, `categoria`,
  `subcategoria`, `nombre_producto`, `marca`, `unidad`, `precio_compra_clp`,
  `precio_venta_clp`, `stock`, `stock_minimo`
- Fuentes de datos del Parcial 1: `../ferreteria-los-maestros/data/productos.json`
  y las 85 imágenes en `../ferreteria-los-maestros/assets/img/productos/`
- Color de marca: `#d1490b` (naranjo). Tipografías: Lato (texto), Poppins (títulos)

## Reglas del carrito (definidas en el Parcial 1, se conservan)

1. Un producto no se duplica: si ya está, se suma a su cantidad.
2. No se puede pedir más unidades que el stock disponible.
3. Un producto sin stock no se puede agregar.
4. La cantidad mínima es 1; bajar de ahí equivale a quitarlo.

## Diferencias aceptadas frente al Parcial 1

El Parcial 1 tenía reglas estrictas que en React cambian, y está bien:

- **Los `<div>` ahora se permiten** donde la grilla de Bootstrap los exige
  (`container`, `row`, `col-*`). El Parcial 1 tenía cero. Mantener etiquetas
  semánticas donde sí corresponden: `header`, `main`, `section`, `article`, `footer`.
- **Bootstrap reemplaza la hoja de estilos propia.** Breakpoints pasan a ser los de
  Bootstrap (`md` 768, `lg` 992, `xl` 1200), no los 768/1280 del Parcial 1.
- **Un solo `<h1>` por página** se mantiene. La guía pone dos (uno en la cabecera y
  otro en la bienvenida); acá el de la cabecera va como `<p className="h4">`.

## Lo que todavía NO corresponde portar

La Guía 11 trae rutas, formularios controlados y vistas administrativas. Por ahora
quedan fuera: `login`, `registro`, `contacto` (con la validación de RUT por módulo
11), `admin`, `nosotros`, `blogs` y el carrito como página propia.
