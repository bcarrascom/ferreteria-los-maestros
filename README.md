# Ferretería Los Maestros — versión React

Versión en React del sitio de **Ferretería Los Maestros**, negocio familiar de
Rengifo 320, La Serena, Región de Coquimbo.

Corresponde a la Experiencia 2 (EA2) del ramo DSY1104 Desarrollo Fullstack II,
Duoc UC. El proyecto del Parcial 1 (HTML + CSS + JavaScript vanilla) vive en un
repositorio aparte: son dos evidencias distintas.

## Stack

- React 19
- Vite 8 (servidor de desarrollo y empaquetado)
- React Bootstrap + Bootstrap 5 (sistema visual y responsivo)

## Cómo levantarlo

Requiere Node 22 o superior.

```bash
npm install     # instala las dependencias en node_modules
npm run dev     # servidor de desarrollo en http://localhost:5173
npm run build   # versión optimizada para producción en dist/
npm run preview # sirve localmente lo que generó build
```

## Estructura

```
public/img/        imágenes servidas sin procesar (logo y productos)
src/main.jsx       punto de entrada: monta App en el div#root
src/App.jsx        componente principal, compone la página
src/index.css      estilos propios de la marca
src/components/    piezas reutilizables (encabezado, navegación, tarjetas)
src/pages/         vistas completas (catálogo)
src/data/          datos simulados, separados de la presentación
```

## Alcance actual

Catálogo de 85 productos en 9 categorías, filtro por categoría y carrito con
cantidades persistido en `localStorage`. Las rutas, los formularios controlados
y las vistas administrativas llegan en la siguiente experiencia.
