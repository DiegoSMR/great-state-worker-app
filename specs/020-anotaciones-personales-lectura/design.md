# Design: Anotaciones personales de lectura

Fase: 2 — Design. Estado: borrador, pendiente de aprobación de Diego.
Última actualización: 2026-09-15

## Visión general

Se añade una capa de anotación cliente-only sobre el contenido ya renderizado por `SeccionesConcepto.tsx`, sin tocar `content/estudio/*.md` ni el pipeline de `Markdown.tsx`/`rehype-sanitize` que sirve el texto enriquecido de autoría. Sigue el mismo patrón ya validado por `lib/progreso-lectura.ts`: `localStorage` por concepto, lectura/escritura defensiva (`try/catch`), aplicada en un efecto al montar para no producir mismatch de hidratación.

## Decisiones clave

### Decisión: almacenamiento en `localStorage`, por concepto y por sección

- **Opción elegida:** nuevo `lib/anotaciones-lectura.ts`, mismo prefijo de clave que `progreso-lectura.ts` pero propio (`gsw_anotaciones:<conceptoId>:<seccionId>`), con `seccionId` = los mismos 4 ids que ya usa `SeccionesConcepto` (`texto-oficial`, `material-adaptado`, `esquema`, `resumen-extenso`). Valor guardado: `{ html: string; hashOriginal: string; actualizadoEn: number }`.
- **Satisface:** Requisito 2 (1, 2, 4)

### Decisión: detección de contenido desactualizado vía hash del texto plano

- **Opción elegida:** al guardar una anotación, se calcula un hash simple (no criptográfico — basta una función tipo checksum de una pasada, sin dependencia nueva) del `textContent` de la sección **antes** de aplicar ningún formato, y se guarda junto al HTML anotado. Al restaurar, se recalcula el hash del `textContent` actual (ya renderizado por el servidor) y se compara: si no coincide, la entrada se descarta de `localStorage` y se muestra el contenido original sin anotar.
- **Alternativas consideradas:** guardar una copia del texto original completo para comparar cadena a cadena — descartado por duplicar datos sin necesidad; un hash corto basta para detectar el caso que importa (el contenido cambió) sin guardar el texto dos veces.
- **Satisface:** Requisito 2.3

### Decisión: edición con `contentEditable` nativo + Range API manual, sin librería de editor

- **Opción elegida:** cuando el modo edición está activo, cada `div.contenido-lectura` se marca `contentEditable`. Los 3 botones de formato operan directamente sobre `window.getSelection()`/`Range`, envolviendo la selección en `<strong>` (negrita), `<u>` (subrayado) o `<mark class="anotacion-resaltado">` (resaltado); "quitar formato" desenvuelve esos tags de la selección actual.
- **Alternativas consideradas:**
  - Librería de rich-text (TipTap/Lexical/Slate): descartada — sobre-ingeniería para 3 comandos de formato en una app personal; añade un modelo de documento propio que no encaja con contenido que ya llega como HTML renderizado desde markdown.
  - `document.execCommand('bold'|'underline'|...)`: más simple de implementar pero deprecated y con comportamiento inconsistente entre navegadores (anidamiento de tags distinto según el motor); con Range API manual se controla exactamente qué tag se inserta, alineado con la lista cerrada de tags que ya usa `esquemaTextoEnriquecido` en `Markdown.tsx`.
- **Satisface:** Requisito 1 (2, 3)

### Decisión: estado de modo edición y vista vive en `SeccionesConcepto`, sin Context nuevo

- **Opción elegida:** `SeccionesConcepto` (ya Client Component, ya conoce `conceptoId`) gana `const [modoEdicion, setModoEdicion] = useState(false)` y `const [mostrarAnotaciones, setMostrarAnotaciones] = useState(true)`. El botón de modo edición y el checkbox de vista se añaden a la barra sticky que ya existe (mismo contenedor que las pestañas y `<ProgresoLectura />`).
- **Alternativas consideradas:** un Context/Provider nuevo (tipo `PreferenciasProvider`) — descartado porque el alcance es una sola página/concepto, no transversal a toda la app; no hay otro componente que necesite leer este estado.
- **Satisface:** Requisito 1.1, Requisito 3 (1, 5)

### Decisión: alternar "con/sin anotaciones" sin volver a pedir datos al servidor

- **Opción elegida:** al montar, antes de aplicar cualquier anotación, se guarda en un `ref` el HTML original de cada sección tal como llegó del servidor. El checkbox de vista alterna, para cada sección, entre ese `ref` (vista limpia) y el HTML anotado restaurado de `localStorage` (vista con anotaciones) — sin re-fetch ni duplicar el árbol de Markdown.
- **Satisface:** Requisito 3 (2, 3, 4)

### Decisión: sanitizar el HTML antes de guardarlo y antes de reinyectarlo

- **Opción elegida:** función propia en `lib/anotaciones-lectura.ts` (sin librería nueva) que recorre el HTML producido por `contentEditable` y descarta cualquier tag/atributo fuera de una lista cerrada: los tags normales que ya puede contener el contenido de estudio (`p`, listas, `strong`, `em`, tablas, etc. — mismo universo que ya permite `esquemaTextoEnriquecido` de `Markdown.tsx`) más `u` y `mark.anotacion-resaltado`. Se aplica tanto al guardar en `localStorage` como al reinyectar en el DOM.
- **Por qué (a diferencia de `content/estudio/*.md`, que no tiene superficie XSS real porque solo lo escriben nuestros propios agentes):** el HTML de `contentEditable` sí puede arrastrar basura si Diego pega texto copiado de otra web mientras anota (estilos inline, tags ajenos) — la sanitización aquí es robustez frente a ese pegado accidental, mismo espíritu que `rehype-sanitize` pero aplicado a una fuente distinta.
- **Satisface:** Requisito 1.2 (implícito — que el formato aplicado sea consistente y no rompa el layout)

### Decisión: un único color de resaltado nuevo, no los 6 `ink-*` existentes

- **Opción elegida:** nuevo par de tokens `--anotacion-fondo` (+ variantes oscuro/papel), siguiendo el mismo patrón de los pares ya existentes (`--ejemplo-*`, `--excepcion-*`, `--atencion-*` de `specs/003-sistema-de-diseno` §14), pero con un color propio y distinto de los 6 `ink-*` — para que una marca personal de Diego no se confunda visualmente con un resaltado que puso el redactor del contenido.
- **Alternativas consideradas:** reutilizar directamente uno de los 6 `ink-*`: descartado por la razón anterior (ambigüedad autoría vs. lectura personal); ofrecer varios colores de resaltado en v1: descartado por ahora — mantiene la barra de herramientas simple; se deja como ampliación futura si hace falta, sin bloquear esta spec.
- **Satisface:** Requisito 1.2

## Componentes afectados

- `lib/anotaciones-lectura.ts` (nuevo) — guardar/leer/borrar por sección, cálculo de hash, sanitización.
- `components/estudio/SeccionesConcepto.tsx` — estado de modo edición/vista, refs por sección, lógica de restaurar/alternar.
- `components/estudio/BarraFormato.tsx` (nuevo) — botones Negrita/Subrayado/Resaltar/Quitar formato, opera sobre `window.getSelection()`.
- `app/globals.css` — nuevo par de tokens `--anotacion-fondo*` y clase `.anotacion-resaltado`.

## Flujo de datos / interacción

1. Al montar `SeccionesConcepto`, se guarda en un `ref` el HTML original de cada sección (tal cual vino del servidor).
2. En un efecto (mismo patrón que la restauración de scroll ya existente), por cada sección: leer `localStorage`, calcular hash del `textContent` actual, comparar con `hashOriginal` guardado.
   - Coincide → queda disponible como "versión anotada" de esa sección (se aplica solo si `mostrarAnotaciones` es `true`).
   - No coincide → se borra la entrada de `localStorage` de esa sección (Requisito 2.3) y se usa el original.
3. Diego pulsa "Modo edición" → `modoEdicion = true`, `mostrarAnotaciones` se fuerza a `true`, las 4 secciones pasan a `contentEditable`, aparece `BarraFormato`.
4. Diego selecciona texto y pulsa Negrita/Subrayado/Resaltar → se envuelve la selección con el tag correspondiente.
5. Al perder el foco una sección editable (o con debounce mientras escribe), se sanitiza su HTML actual, se calcula el hash de su `textContent` y se guarda en `localStorage`.
6. Diego desactiva "Modo edición" → las secciones vuelven a solo lectura; el checkbox de vista queda disponible para alternar entre "con anotaciones" (ref anotado) y "sin anotaciones" (ref original) sin perder lo guardado.

## Riesgos y mitigaciones

- **`contentEditable` en tablet/iOS Safari tiene peculiaridades conocidas** (comportamiento del cursor, teclado virtual) — riesgo real de UX, no teórico, porque Diego usa sobre todo tablet (`CONSTITUTION.md`, principio de producto). Mitigación: probar específicamente en tablet durante la implementación; si el comportamiento nativo resulta pobre al tacto, considerar una barra de herramientas que aparezca solo tras una selección válida (patrón "selection toolbar" tipo Notion/Medium) en vez de barra siempre visible — decisión de afinado de UX en implementación, no bloquea este diseño.
- **Falsos positivos del hash de staleness** (un cambio trivial de espacio en blanco en el markdown invalida una anotación por lo demás válida): aceptado como coste consciente — el propio Requisito 2.3 pide explícitamente "mejor descartar que mostrar contenido desactualizado en silencio".
- **Crecimiento de `localStorage`** por guardar HTML completo por sección: mismo límite práctico ya aceptado para `gsw_progreso:*` (`ARCHITECTURE.md`) — no es un riesgo nuevo introducido por esta spec.
