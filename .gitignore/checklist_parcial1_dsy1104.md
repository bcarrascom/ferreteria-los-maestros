# Evaluación Parcial N°1 — DSY1104 Desarrollo Fullstack II
## Caso: Ferretería Los Maestros (Forma E) — Frontend

**Ponderación:** 30% de la asignatura · **Plazo:** 1 semana · **Equipos:** máximo 3 estudiantes
**Importante:** el trabajo es grupal, pero **la nota del encargo y de la presentación es individual**. Cada uno tiene que poder defender todo el proyecto, no solo su parte.

---

## 1. Entregables (sin estos 3 no hay nota)

- [ ] **Enlace a repositorio GitHub público** del proyecto frontend
- [ ] **Proyecto frontend comprimido** (.zip con el código completo)
- [ ] **Documento ERS — Versión 1** (propuesta previa, no completa)

---

## 2. Distribución del puntaje

| Situación evaluativa | Peso | Cómo se evalúa |
|---|---|---|
| **1. Entrega de encargo** (proyecto + ERS) | **40%** | Grupal |
| **2. Presentación** | **60%** | Individual |

### Desglose por indicador

**Situación 1 — Encargo (40%)**

| Indicador | Peso | Qué mide |
|---|---|---|
| IE1.1.1 | 8% | Estructura y etiquetado HTML actual + navegación, imágenes, botones, videos, formularios y footer |
| IE1.1.2 | 10% | Hoja de estilos CSS personalizada, enlazada de forma externa |
| IE1.2.1 | 10% | Validaciones en JavaScript con sugerencias y mensajes de error personalizados |
| IE1.3.1 | 12% | Cambios en el repositorio remoto, commits coherentes, tareas distribuidas |

**Situación 2 — Presentación (60%)**

| Indicador | Peso | Qué mide |
|---|---|---|
| IE1.1.3 | 10% | **Explicar** cómo creaste el contenido web y por qué importa la semántica correcta |
| IE1.1.4 | 15% | **Describir** el uso de CSS personalizado externo y por qué facilita el mantenimiento |
| IE1.2.2 | 15% | **Demostrar** las validaciones JS en vivo, incluyendo sugerencias y mensajes de error |
| IE1.3.2 | 20% | **Justificar** la importancia de commits coherentes y del trabajo colaborativo |

> El indicador de mayor peso de toda la evaluación (20%) es hablar de Git, no programar. Prepara esa parte con el mismo cuidado que el código.

---

## 3. Requisitos técnicos del proyecto

### 3.1 HTML (IE1.1.1 / IE1.1.3)

- [ ] Estructura HTML5 válida usando `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`
- [ ] Etiquetado según prácticas actuales de HTML5 (semántica correcta, no `<div>` para todo)
- [ ] **Hipervínculos funcionales** (ningún enlace roto ni `href="#"` de relleno)
- [ ] **Imágenes correctamente insertadas** (con `alt`, rutas relativas que funcionen al descomprimir el zip)
- [ ] **Botones operativos** (que hagan algo, no decorativos)
- [ ] **Videos embebidos** — requisito explícito y fácil de olvidar. Sirve un `<iframe>` de YouTube o un `<video>` local
- [ ] **Formularios interactivos**
- [ ] **Footer informativo** (datos de contacto, dirección, redes, copyright)
- [ ] Todas las páginas interconectadas entre sí; se puede navegar de una a otra de forma coherente y fluida (sin callejones sin salida)

### 3.2 CSS (IE1.1.2 / IE1.1.4)

- [ ] **Hoja de estilos externa** (`<link rel="stylesheet">`). Cero `<style>` en el HTML y cero atributos `style=""` inline
- [ ] La **misma** hoja aplicada de forma consistente en **todas** las páginas
- [ ] Estilos personalizados (si usas un framework, tiene que haber una capa propia encima; el indicador dice "personalizada")
- [ ] Interfaz atractiva y funcional

**Del caso (Sección 0.3) — el diseño responsive es requisito del cliente:**
- [ ] Móvil ≥ 360 px, con menú de navegación colapsado tipo hamburguesa
- [ ] Tableta ≥ 768 px, menú lateral o barra superior
- [ ] Escritorio ≥ 1280 px, layout de múltiples columnas
- [ ] Formularios, tablas y menús adaptados a los tres tamaños (probar cada vista antes de entregar)

### 3.3 JavaScript — validación de formularios (IE1.2.1 / IE1.2.2)

- [ ] Validaciones **controladas por JavaScript** que impidan enviar datos incorrectos o incompletos
- [ ] **Etiquetas asociadas**: cada `<input>` con su `<label for="id">`
- [ ] **Autocompletar**: atributo `autocomplete` en los campos que corresponda (`name`, `email`, `tel`, `street-address`)
- [ ] **Sugerencias**: `<datalist>`, placeholders útiles, texto de ayuda bajo el campo
- [ ] **Mensajes de error personalizados** — no los del navegador por defecto. Claros, específicos ("El RUT debe incluir dígito verificador", no "Campo inválido")
- [ ] Los mensajes se muestran **en el contexto adecuado del formulario**: junto al campo que falla, no en un `alert()` genérico
- [ ] Idealmente valida al perder foco (`blur`) y al enviar (`submit`), y con `e.preventDefault()` cuando hay errores

### 3.4 Git y repositorio colaborativo (IE1.3.1 / IE1.3.2)

- [ ] Repositorio **público** en GitHub
- [ ] Commits con **mensajes claros y descriptivos** que reflejen el cambio real (nada de "cambios", "update", "asdf")
- [ ] **Todos los integrantes con commits propios** en el historial — es la evidencia de que las tareas se distribuyeron
- [ ] Los cambios se **integran efectivamente** (ramas que se mergean, no carpetas duplicadas ni archivos `index_final_v2.html`)
- [ ] Historial que se pueda mostrar en pantalla durante la presentación

> Si vienen trabajando con un proyecto a medias sin commits repartidos, esto es lo primero que hay que arreglar: 32% de la nota total (12% + 20%) depende de este punto.

---

## 4. Documento ERS — Versión 1

Es una **propuesta previa**, no el documento final. Las instrucciones piden tres bloques mínimos:

- [ ] **Requerimientos**: necesidades y expectativas que el proyecto debe cumplir (funcionalidades, restricciones, requisitos técnicos)
- [ ] **Herramientas**: software, hardware, plataformas y lenguajes que se usarán
- [ ] **Propuestas del proyecto**: ideas y enfoques para abordarlo, cómo piensan cumplir los requerimientos

Del caso puedes sacar directamente los requerimientos funcionales:
- Consulta de stock en tiempo real sin llamar por teléfono (hoy reciben 30–50 llamadas diarias)
- Actualización automática de inventario al registrar una venta
- Alerta cuando un producto baja del umbral de reposición
- Historial de compras por cliente y productos más vendidos
- Cuentas corrientes digitales, con saldo visible para dueño y contratista
- Catálogo de más de 800 referencias
- Confidencialidad: los datos de compras y cuenta corriente de un cliente no son visibles para otros

Y las restricciones de contexto: usuarios de nivel básico en Excel, contratistas conectándose desde obras con señal variable, dueño con notebook, empleado con PC de escritorio.

---

## 5. Qué maquetar del caso Ferretería Los Maestros

Los tres roles del sistema (Sección 0.2) definen las vistas mínimas:

| Rol | Vistas a maquetar |
|---|---|
| **Administrador** | Panel de administración: listado de usuarios, crear/editar/desactivar, asignar roles |
| **Vendedor / Empleado** | Inventario (ver y actualizar stock), listado y estado de pedidos |
| **Contratista / Cliente** | Catálogo con stock, detalle de producto, carrito, confirmación de pedido, historial de compras, saldo de cuenta corriente |
| **Público** | Login, registro, home/landing con presentación de la ferretería |

Vistas adicionales que cubren requisitos de la rúbrica:
- **Mapa** (Sección 0.7 del caso): ubicación de la ferretería en La Serena y zona de cobertura de despacho. Leaflet es gratis y no necesita API key
- **Formulario de contacto o de pedido**: es donde luces las validaciones JS
- **Sección con video embebido**: un "cómo comprar" o un video institucional resuelve ese requisito

En esta etapa los datos son simulados (arreglos en JS o JSON local). El backend, la base de datos y AWS son de los parciales 2 y 3.

---

## 6. Punto a aclarar con el docente

El caso (Sección 0.1) exige **React como frontend obligatorio**, pero la rúbrica del Parcial 1 evalúa "estructura y etiquetado de la versión actual de HTML" y "hoja de estilos CSS **añadida de forma externa a las páginas HTML**", y las instrucciones generales hablan de HTML, CSS y JavaScript. Son dos lecturas distintas:

- **HTML/CSS/JS puro**: encaja literalmente con la rúbrica del parcial 1, pero implica rehacer todo en React para el parcial 2
- **React desde ya**: cumple el caso, pero hay que justificar en la presentación cómo el JSX produce HTML semántico y cómo el CSS sigue siendo externo (archivos `.css` importados, no estilos inline)

Pregúntalo antes de avanzar. Si ya tienes la carpeta a medias en una de las dos tecnologías, esa respuesta define si sigues o migras.

---

## 7. Preparación de la presentación (60% de la nota)

Es individual, así que prepara tu propio guion aunque el proyecto sea grupal. Los cuatro puntos que te van a pedir:

1. **Explicar** cómo creaste el contenido web con HTML actual, **enfatizando por qué importa la semántica correcta** (accesibilidad, lectores de pantalla, SEO, mantenibilidad). No basta con mostrar el código: hay que argumentar
2. **Describir** el uso de CSS personalizado y por qué va externo (un cambio en un archivo se propaga a todas las páginas, separación de responsabilidades, caché del navegador)
3. **Demostrar** las validaciones JS en vivo: dejar un campo vacío, escribir un email malo, mostrar el mensaje personalizado apareciendo junto al campo
4. **Mostrar** el repositorio: historial de commits, contribuciones de cada integrante, y **justificar** por qué los mensajes coherentes importan en un equipo (trazabilidad, revertir cambios, entender qué pasó sin preguntar)
