# Tasks: Anotaciones personales de lectura

Fase: 3 — Tasks (completa). Fase 4 — Implementación (completa, en la rama `020-anotaciones-personales-lectura`). Fase 5 — Verificación (completa, ver sección al final). Pendiente de revisión final de Diego y de su confirmación explícita para abrir el Pull Request hacia `development`.
Última actualización: 2026-09-17

Generadas a partir de "Componentes afectados" y "Flujo de datos" de `design.md` (aprobado). Un commit por Requisito completado (más uno para la base técnica sin Requisito propio), según `CONSTITUTION.md`. Rama `020-anotaciones-personales-lectura`, creada desde `development` al empezar la Fase 4.

## Base técnica (sin Requisito propio)

- [x] T0.1 `lib/anotaciones-lectura.ts`: tipo `AnotacionGuardada` (`{ html: string; hashOriginal: string; actualizadoEn: number }`); `calcularHash(texto: string)` (checksum simple, sin dependencia nueva); `guardarAnotacion`/`leerAnotacion`/`borrarAnotacion` (clave `gsw_anotaciones:<conceptoId>:<seccionId>`, mismo patrón `try/catch` defensivo que `lib/progreso-lectura.ts`); `sanitizarHtml(html: string)` (allowlist de tags/atributos: los ya permitidos por `esquemaTextoEnriquecido` de `Markdown.tsx` + `u` + `mark.anotacion-resaltado`).
  - Satisface: base de Requisito 2 (1, 2, 3, 4); base de Requisito 1.2 (sanitización del formato aplicado).
- [x] T0.2 `app/globals.css`: nuevo par de tokens `--anotacion-fondo` (+ variantes oscuro/papel), mismo patrón que `--ejemplo-*`/`--excepcion-*`/`--atencion-*` (`specs/003-sistema-de-diseno` §14); clase `.anotacion-resaltado`.
  - Satisface: Requisito 1.2 (color de resaltado propio, distinto de los `ink-*` de autoría).

## Requisito 1 — Modo edición de anotaciones

- [x] T1.1 `components/estudio/BarraFormato.tsx` (nuevo, `"use client"`): botones Negrita/Subrayado/Resaltar/Quitar formato; opera sobre `window.getSelection()`/`Range`, envuelve la selección en `<strong>`/`<u>`/`<mark class="anotacion-resaltado">` o la desenvuelve.
  - Satisface: Requisito 1.2.
- [x] T1.2 `components/estudio/SeccionesConcepto.tsx`: nuevo estado `modoEdicion` (`useState`), botón toggle en la barra sticky ya existente (junto a `<ProgresoLectura />`); cuando `modoEdicion` es `true`, las 4 `div.contenido-lectura` pasan a `contentEditable` y se muestra `<BarraFormato>`; cuando es `false`, vuelven a solo lectura.
  - Satisface: Requisito 1 (1, 2, 3).

## Requisito 2 — Persistencia local, no compartida

- [x] T2.1 `components/estudio/SeccionesConcepto.tsx`: al montar, guarda en un `ref` el HTML original de cada sección (antes de aplicar cualquier anotación); en un efecto (mismo patrón que la restauración de scroll ya existente), por cada sección: lee `localStorage` vía `lib/anotaciones-lectura.ts`, calcula el hash del `textContent` actual y lo compara con `hashOriginal` — si coincide, la deja disponible como versión anotada; si no coincide, borra esa entrada de `localStorage`.
  - Satisface: Requisito 2 (2, 3, 4 — el aislamiento por dispositivo es consecuencia directa de usar `localStorage`).
- [x] T2.2 `components/estudio/SeccionesConcepto.tsx`: al perder el foco una sección editable (o con debounce mientras se escribe, mismo criterio de ~500ms que el guardado de posición de scroll), sanitiza su HTML actual (`lib/anotaciones-lectura.ts`), calcula su hash y lo guarda en `localStorage`.
  - Satisface: Requisito 2.1.

## Requisito 3 — Alternar entre vista con anotaciones y vista limpia

- [x] T3.1 `components/estudio/SeccionesConcepto.tsx`: nuevo estado `mostrarAnotaciones` (`useState`, por defecto `true`); checkbox/switch en la barra sticky; alterna, por sección, entre el `ref` del HTML original (vista limpia) y el HTML anotado restaurado en T2.1 (vista con anotaciones), sin volver a pedir datos al servidor.
  - Satisface: Requisito 3 (1, 2, 3, 4).
- [x] T3.2 `components/estudio/SeccionesConcepto.tsx`: activar `modoEdicion` fuerza `mostrarAnotaciones` a `true`.
  - Satisface: Requisito 3.5.

## Verificación (Fase 5)

- [x] V1 `npm run lint` y `npm run build` limpios.
- [x] V2 Recorrido en navegador (dev server), con énfasis en tablet (riesgo de `contentEditable` en touch señalado en `design.md`): activar modo edición, aplicar negrita/subrayado/resaltado, desactivar modo edición, recargar la página y comprobar que persiste; alternar el checkbox con/sin anotaciones sin perder lo guardado; editar a mano un `content/estudio/*.md` de prueba y comprobar que la anotación de esa sección se descarta sin romper el resto; claro/oscuro/papel.
- [x] V3 Repaso criterio a criterio de los 3 Requisitos de `requirements.md` con evidencia concreta.

## Verificación

Repaso criterio a criterio de `requirements.md`, con evidencia concreta. `npm run lint` y `npm run build` limpios tras cada uno de los 4 commits (base técnica + 3 Requisitos), más un commit adicional de corrección de bugs encontrados en esta misma verificación. Recorrido funcional con Playwright headless (dev server, puerto 3001, `chromium-cli` no disponible en este entorno) en viewport de tablet (820×1180, `hasTouch: true`) contra el concepto real `constitucion-espanola`, con selección de texto por arrastre de ratón real (no una API programática) para los recorridos principales, y por Range API directa para los casos de borde (varias secciones, selección que abarca varios nodos) — sin errores de consola en ningún caso. Claro/oscuro/papel verificados visualmente.

### Requisito 1 — Modo edición de anotaciones

1. **Botón para activar/desactivar modo edición.** `components/estudio/SeccionesConcepto.tsx` líneas ~266-280 (botón "Modo edición"/"Salir de modo edición" en la barra sticky, junto a `<ProgresoLectura />`). Confirmado visualmente en captura de tablet (`02-modo-edicion.png`) y funcionalmente: `alternarModoEdicion()` cambia `modoEdicion` y el texto del botón.
2. **Seleccionar texto en cualquier sección y aplicar negrita/subrayado/resaltado mediante una barra de herramientas.** `components/estudio/BarraFormato.tsx` — botones Negrita/Subrayado/Resaltar operan sobre `window.getSelection()`/`Range` (`envolverSeleccion`), envolviendo en `<strong>`/`<u>`/`<mark class="anotacion-resaltado">`. Verificado con selección real por arrastre de ratón en `texto-oficial` (negrita + resaltado, captura `03-negrita-aplicada.png`/`04-resaltado-aplicado.png`) y con Range API en las 3 secciones restantes (`material-adaptado`, `esquema` — tabla Markdown, no párrafos — y `resumen-extenso`), las 4 con resultado correcto.
3. **Modo edición desactivado → solo lectura, sin cursor ni selección-y-formato.** `contentEditable={modoEdicion}` en las 4 `div.contenido-lectura` (`SeccionesConcepto.tsx`); al desactivar, el atributo pasa a `false` y `BarraFormato` deja de renderizarse (`{modoEdicion && <BarraFormato .../>}`).

### Requisito 2 — Persistencia local, no compartida

1. **Guardar en `localStorage`, nunca en `content/estudio/*.md` ni en base de datos.** `lib/anotaciones-lectura.ts` (`guardarAnotacion`) escribe únicamente en `window.localStorage`, clave `gsw_anotaciones:<conceptoId>:<seccionId>`. Verificado inspeccionando `window.localStorage` tras guardar: `gsw_anotaciones:constitucion-espanola:texto-oficial` presente con `{ html, hashOriginal, actualizadoEn }`; `git status` sobre `content/estudio/` sin cambios en ningún momento de la prueba.
2. **Restaurar anotaciones previas al reabrir el mismo concepto.** Recorrido completo: aplicar negrita+resaltado → salir de modo edición → recargar la página (`page.reload`) → el HTML de `texto-oficial` sigue conteniendo `<strong>` y `mark.anotacion-resaltado` tras la recarga. Mismo resultado confirmado en `material-adaptado`, `esquema` y `resumen-extenso` de forma independiente (claves de `localStorage` separadas, una por sección).
3. **Contenido cambiado → se descarta la anotación desactualizada, no se mezcla.** Prueba dedicada: guardar un resaltado en `texto-oficial`, editar a mano (temporalmente) `content/estudio/constitucion-espanola.md` cambiando el texto de "Título Preliminar" a "Título Preliminar MODIFICADO", recargar — el nuevo texto se sirve correctamente, el resaltado NO aparece mezclado con el contenido nuevo, y la entrada `gsw_anotaciones:...:texto-oficial` se borra sola de `localStorage` (`SeccionesConcepto.tsx`, efecto de restauración: compara `calcularHash(el.textContent)` con el `hashOriginal` guardado y llama a `borrarAnotacion` si no coincide). El resto de la página (`material-adaptado`, sin cambios en su `.md`) queda intacto — comparación byte a byte de su `innerHTML` antes/después. Archivo `.md` restaurado a su contenido original al terminar la prueba (`git diff` limpio).
4. **Aislado por dispositivo/navegador.** Consecuencia directa de usar `localStorage` (nunca una cookie ni una tabla con `usuario_id`) — mismo criterio ya validado por `lib/progreso-lectura.ts`, sin mecanismo de sincronización entre orígenes/navegadores en ningún punto del código.

### Requisito 3 — Alternar entre vista con anotaciones y vista limpia

1. **Control con/sin anotaciones en la página del concepto.** Checkbox "Ver con mis anotaciones" en la barra sticky (`SeccionesConcepto.tsx`, junto al botón de modo edición) — visible en captura `06-sin-anotaciones.png`.
2. **"Con mis anotaciones" muestra el formato personal guardado.** Estado por defecto (`mostrarAnotaciones = true`); el efecto `aplicarVista` pinta `htmlAnotadoRef.current[seccionId]` cuando existe.
3. **"Sin anotaciones" muestra el contenido tal cual de `content/estudio/*.md`.** Desmarcar el checkbox → `aplicarVista` pinta `htmlOriginalRef.current[seccionId]` (capturado al montar, antes de aplicar ninguna anotación). Verificado: tras desmarcar, `innerHTML` de `texto-oficial` deja de contener `anotacion-resaltado` (comprobación específica de este marcador, no de `<strong>` genérico — el propio contenido de autoría de `constitucion-espanola.md` usa **negrita** de Markdown en varios sitios, p. ej. "**Título Preliminar**", así que `<strong>` por sí solo no distingue autoría de anotación personal).
4. **Cambiar de vista no borra ni modifica lo guardado.** Tras desmarcar y volver a marcar el checkbox, el formato reaparece exactamente igual (`<strong>` + `anotacion-resaltado` de vuelta) y el número de claves `gsw_anotaciones:*` en `localStorage` no cambia en ningún momento del ciclo marcar→desmarcar→marcar.
5. **Activar modo edición fuerza la vista a "con mis anotaciones".** `alternarModoEdicion()` (`SeccionesConcepto.tsx`) llama a `setMostrarAnotaciones(true)` al activar; el checkbox además queda `disabled` mientras `modoEdicion` es `true` (no tiene sentido alternar la vista mientras se edita sobre ella).

### Decisiones tomadas durante la implementación (no reabren `design.md`)

- **Se mantuvo la barra de herramientas siempre visible en la barra sticky** (la opción por defecto de `design.md`), en vez de pasar al patrón "selection toolbar" (Notion/Medium) que el propio `design.md` anticipaba como alternativa si `contentEditable` resultaba pobre al tacto. En las pruebas con viewport de tablet (820px, selección por arrastre de ratón real) el resultado fue sólido: la barra no se solapa con el contenido, no hay overflow horizontal, y pulsar un botón nunca perdió la selección gracias a `onMouseDown`+`preventDefault()`. Limitación honesta: este entorno no tiene acceso a un dispositivo táctil real ni a Safari/iOS — la verificación cubre `hasTouch: true` en Chromium headless (que ejercita la misma ruta de eventos que un tap real para el propósito de esta app, dado que no se usa ningún gesto táctil específico como pinch/long-press) pero no las peculiaridades exactas de iOS Safari que `design.md` señala como riesgo abierto. Si en uso real con el iPad de Diego el comportamiento resulta pobre, el cambio al patrón "selection toolbar" sigue disponible sin tocar el resto del diseño.
- **Bug real encontrado en `BarraFormato.tsx` (`quitarFormatoSeleccion`):** `Range.extractContents()` no incluye el envoltorio de formato (`strong`/`u`/`mark.anotacion-resaltado`) dentro del fragmento extraído cuando toda la selección cae en un único nodo de texto — lo deja vacío en el DOM (spec DOM Range: vaciar un `CharacterData`, no eliminarlo) en vez de dentro del fragmento, y "Quitar formato" reinsertaba el contenido ya limpio dentro de (o junto a) esa misma etiqueta vacía, dejando el resultado visual idéntico al de partida. Corregido con `purgarEnvoltoriosVacios()`: marca el punto de inserción con un nodo de texto vacío y limpia los envoltorios vacíos que hayan quedado tanto como ancestro (selección contenida en un único nodo) como hermano (selección que abarcaba el envoltorio entero desde fuera). Cubre además el caso de formato anidado (`<u>` dentro de `<strong>` de autoría markdown) sin tocar el `<strong>` que no formaba parte de la selección.
- **Bug real encontrado en `SeccionesConcepto.tsx` (efecto de restauración, Requisito 2):** sin protección, la doble invocación de efectos de React StrictMode en desarrollo sobrescribía `htmlOriginalRef` con el HTML ya anotado en su segunda pasada (mismo nodo DOM real entre ambas pasadas, sin desmontaje real de por medio) — rompía silenciosamente el checkbox "Ver con mis anotaciones" tras recargar la página, solo en `npm run dev`, nunca en producción (sin doble invocación de efectos). Corregido con un guard (`if (htmlOriginalRef.current[seccionId] === undefined)`) que solo captura el HTML original la primera vez.
- **Color de resaltado elegido (`--anotacion-fondo`/`--anotacion-texto`):** teal (`#cfeef0`/`#164e52` en claro, `#1c3f42`/`#8fd4d9` en oscuro), deliberadamente distinto del azul ya usado por `--revision-bg`/`--revision-texto` para no repetir hue con un estado existente. Contraste verificado ≥6.8:1 contra su propio fondo y contra `--bg-primario`/`--bg-secundario` de cada tema (cálculo WCAG 2.1, luminancia relativa).
- **`npm ci` necesario en este worktree** (no compartía `node_modules` con el checkout principal — Turbopack, a diferencia de la resolución estándar de Node, no camina hacia directorios padre en busca de `node_modules` cuando el worktree tiene su propio `package-lock.json`) y `.env` copiado desde el checkout principal (gitignored, nunca commiteado) para poder levantar `npm run dev` con `DATABASE_URL` real durante la verificación — sin él, la página falla con 500 porque `isBookmarked` (Server Action) necesita la base de datos incluso para una ruta que no depende del bookmark en sí.

## Extensión (2026-09-15): ajuste tras revisión de Diego con la app ya en marcha

Diego probó `Modo edición` en `/estudio/tema/constitucion-espanola` (tema "1978", modo manuscrito/papel) y encontró el problema que anticipaba `design.md` en su sección de Riesgos: escribir dentro de una sección `contentEditable` reestructuraba listas/citas del "Texto oficial". Pidió además que el texto oficial anotado tenga su propia pestaña en vez de alternar con el checkbox. Ver `requirements.md` y `design.md`, secciones "Extensión (2026-09-15)", para el detalle de las dos decisiones.

- [x] TE.1 `components/estudio/SeccionesConcepto.tsx`: nueva entrada `material-oficial-anotado` en `SECCIONES`, entre `texto-oficial` y `material-adaptado`; nueva `<section id="material-oficial-anotado">` con el `ref`/`data-seccion-id="texto-oficial"` que antes vivía dentro de "Texto oficial"; `<section id="texto-oficial">` pasa a renderizar `{textoOficial}` sin ref ni anotación.
  - Satisface: Requisito 3 (extensión).
- [x] TE.2 `components/estudio/SeccionesConcepto.tsx`: se retiran `contentEditable`/`suppressContentEditableWarning`/`onInput`/`onBlur` de las 4 divs anotables (ya no hace falta guardar mientras se "escribe" — no hay escritura); el guardado pasa a depender solo de `onCambio` de `BarraFormato`. `aplicarVista` deja `texto-oficial` fuera del toggle del checkbox (siempre `mostrar = true` para esa clave).
  - Satisface: Requisito 1.2 (extensión), Requisito 3 (extensión).
- [x] TE.3 Etiqueta del checkbox actualizada a "Ver material adaptado y resumen con mis anotaciones", reflejando que ya no gobierna el texto oficial.
  - Satisface: Requisito 3 (extensión).

### Verificación (extensión)

`npx eslint components/estudio/SeccionesConcepto.tsx components/estudio/BarraFormato.tsx lib/anotaciones-lectura.ts` y `npm run build` limpios. Recorrido con Playwright headless (dev server, puerto 3033, viewport 834×1100) contra `constitucion-espanola`:

1. **Pestañas en el orden correcto.** `["Texto oficial", "Material oficial anotado", "Material adaptado", "Resumen"]` — confirmado leyendo los textos de la barra de navegación sticky.
2. **Ninguna de las dos secciones es `contentEditable`.** `getAttribute("contenteditable")` devuelve `null` tanto en `#texto-oficial .contenido-lectura` como en `#material-oficial-anotado .contenido-lectura`, con "Modo edición" activo.
3. **El formato sigue funcionando sin `contentEditable`.** Selección por arrastre de ratón real dentro de "Material oficial anotado" + clic en "Negrita" → el `innerHTML` de esa sección pasa a contener `<strong>`.
4. **Teclear ya no hace nada.** Con foco dentro de "Material oficial anotado", `page.keyboard.type("ESTO NO DEBERIA APARECER")` + Enter → el texto no aparece en el DOM. Mismo resultado tecleando dentro de "Texto oficial": su `innerHTML` permanece **byte a byte idéntico** al capturado antes de la prueba.
5. **Persistencia tras recargar, ya con la nueva estructura.** Tras salir de modo edición y recargar la página: "Material oficial anotado" conserva el `<strong>` aplicado; "Texto oficial" sigue idéntico al original. Sin errores de consola en todo el recorrido.

Instalación de Playwright aislada en el scratchpad de la sesión (no como dependencia del proyecto), mismo criterio que las verificaciones anteriores de esta spec.

## Corrección (2026-09-17): reescritura de `envolverSeleccion`/`quitarFormatoSeleccion`

- [x] TC.1 `components/estudio/BarraFormato.tsx`: `nodosTextoEnRango`/`recortarAlRango` (recorren y recortan nodos de texto que intersecan el `Range`, sin mover nada de su padre original); `envolverSeleccion` envuelve cada nodo recortado en su sitio; `sacarDeFormato` desenvuelve dividiendo el/los tag(s) ancestro(s) en clones "antes"/"después"; se elimina `purgarEnvoltoriosVacios`/`desenvolverEtiquetas`/el marcador de texto vacío (ya no hacen falta, no hay extracción/reinserción).
  - Satisface: Requisito 1.2 (corrección — el formato aplicado ya no rompe el layout al solaparse con formato existente ni al cruzar párrafos). Ver `design.md`, sección "Corrección (2026-09-17)".

### Verificación (corrección)

`npx tsc --noEmit` y `npx eslint components/estudio/BarraFormato.tsx` limpios. Recorrido con Playwright headless contra el dev server ya en marcha (puerto 3001) sobre `constitucion-espanola`, pestaña "Material adaptado":

1. **Resaltar una porción parcial de texto ya en `<strong>`** ("máxima protección"): resultado `<strong><mark class="anotacion-resaltado">máxima</mark> protección</strong>` — el resaltado queda anidado limpiamente dentro de la negrita existente, sin mezclar el resto.
2. **Quitar formato de una porción parcial de lo ya resaltado** (mitad de la palabra "máxima" ya en `<mark>`): resultado `máx<strong><mark class="anotacion-resaltado">ima</mark> protección</strong>` — solo se destachó la porción seleccionada, el resto conserva negrita y resaltado.
3. **Negrita sobre una selección que cruza dos párrafos:** número de `<p>`/`<li>` antes y después idéntico (12), cero anidamiento inválido (`p p`, `strong p`, `mark li`, etc.), y se mantiene igual tras recargar la página (persistencia intacta). Sin errores de consola en ningún escenario.

## Extensión (2026-09-17): `BarraFormato` a panel flotante contextual, con iconos

Ver `design.md`, sección "Extensión (2026-09-17)", para el detalle de las 3 decisiones (panel contextual pegado a la selección, iconos propios extendiendo `components/nav/iconos.tsx`, controles de sesión fuera del panel).

- [x] TF.1 `components/estudio/iconosFormato.tsx` (nuevo): iconos de Negrita ("B"), Subrayado ("U" + línea), Resaltar (rotulador), Quitar formato (goma), Modo edición (lápiz / check cuando `aria-pressed`), Restablecer al texto oficial (flecha circular) — mismo `Base` (`viewBox 0 0 20 20`, `stroke="currentColor"`, `fill="none"`, `strokeWidth={1.6}`) que `components/nav/iconos.tsx`.
  - Satisface: petición de iconos, sin dependencia nueva.
  - Hecho en `feat: añade iconos y sombra local para el panel de formato de anotación` (b102291).
- [x] TF.2 `components/estudio/BarraFormato.tsx`: el panel deja de renderizarse en flujo normal dentro de la franja sticky; se posiciona con `position: fixed` sobre `range.getBoundingClientRect()` (centrado horizontal, ~10px por encima, volteo a debajo si no cabe arriba, clamp a bordes del viewport, recálculo en scroll/resize vía `requestAnimationFrame`); aparece solo cuando `obtenerRangoValido()` es no nulo y `puedeFormatear()` no es `null`, desaparece al colapsarse la selección. Botones ganan icono de `iconosFormato.tsx` (con `aria-label`/texto accesible, no solo icono visual). Sin cambios en `envolverSeleccion`/`quitarFormatoSeleccion`/helpers de formato.
  - Satisface: Requisito 1.2 (extensión — barra flotante contextual).
  - Hecho en `feat: convierte BarraFormato en panel flotante contextual sobre la selección` (963d0f1). Decisión de implementación no cerrada en `design.md`: el panel se mantiene siempre montado en el DOM (oculto con `visibility:hidden`/`pointer-events:none`/`aria-hidden`/`tabIndex=-1` en sus botones, nunca desmontado) para poder medir su propio ancho/alto con `panelRef` ANTES de la primera vez que se muestra — sin esa medida no se puede centrar ni decidir el volteo en el primer cálculo. Los listeners de scroll/resize se registran sobre `window` (no `document`, que no recibe esos dos eventos de forma útil) con `capture: true` para cubrir también el scroll de contenedores internos, no solo el de la página.
- [x] TF.3 `components/estudio/SeccionesConcepto.tsx`: se retira el render de `<BarraFormato>` de la franja sticky (queda montado aparte, mismo gate `seccionActiva !== "texto-oficial" && modoEdicion`, ya no ocupa espacio en la franja); los botones "Modo edición"/"Salir de modo edición" y "Restablecer al texto oficial" ganan icono de `iconosFormato.tsx` junto al texto existente (no icono-solo en estos dos).
  - Satisface: Requisito 1.2 (extensión), decisión de mantener los controles de sesión anclados.
  - Hecho en `feat: convierte BarraFormato en panel flotante contextual sobre la selección` (963d0f1).
- [x] TF.4 `app/globals.css`: sombra local modesta (nombre propio, no `--sombra-tarjeta`) para que el panel se lea como flotante en los 3 temas.
  - Satisface: base visual de TF.2.
  - Hecho en `feat: añade iconos y sombra local para el panel de formato de anotación` (b102291) — clase `.sombra-panel-flotante` (`box-shadow: 0 4px 14px rgb(0 0 0 / 0.18), 0 1px 3px rgb(0 0 0 / 0.14)`), mismo valor en los 3 temas (opacidad baja, se lee como elevación sutil sobre cualquiera de los tres fondos sin necesitar variarla).

### Verificación (extensión)

- [x] VF1 `npx tsc --noEmit`, `npm run lint` y `npm run build` limpios (los tres ejecutados tras TF.1-TF.4, cero errores/warnings).
- [x] VF2 Recorrido con Playwright headless (instalado aislado en scratchpad, sin añadirlo a `package.json` — mismo criterio que la verificación de la corrección anterior) contra el dev server ya en marcha (puerto 3001), viewport de tablet 834×1194, sobre `constitucion-espanola`:
  - Selección real vía `Range`/`window.getSelection()` (no arrastre de ratón) en las 3 secciones anotables (`material-oficial-anotado`, `material-adaptado`, `esquema`, `resumen-extenso` — las 4 claves de `SeccionAnotableId`): panel visible en las 4, sin errores de consola.
  - Panel pegado a la selección: con la selección en `top:450/bottom:471` (coordenadas de viewport), el panel aparece en `y:386` (10px por encima, redondeado por su propio alto), centrado horizontalmente sobre la selección.
  - Volteo a debajo cerca del borde superior: forzando una selección con `rect.top:40/rect.bottom:61` (bajo la franja sticky), el panel se coloca en `y:71` — DEBAJO de la selección en vez de encima, confirmando el volteo.
  - Recolocación en scroll sin desaparecer: tras `scrollBy(0, 250)`, el panel sigue `visible:true` y su `y` cambia de `386` a `136` (se recoloca, no se oculta).
  - Desaparición al colapsar: tras vaciar la selección, el panel pasa a `visible:false`.
  - Iconos SVG renderizados con tamaño real (no solo presentes en el markup): los 4 botones del panel miden 20.8×20.8px de icono dentro de un botón de 44×44px (área táctil, cumple el ≥40-44px pedido) — comprobado con `getBoundingClientRect()` de cada `<svg>`, no solo con `querySelector`.
  - Controles de sesión: "Modo edición"/"Salir de modo edición" (icono lápiz → check al activarse, `aria-pressed` correcto) y "Restablecer al texto oficial" (icono flecha circular) capturados con icono + texto, anclados en su franja de siempre (capturas `captura-franja-sesion-antes.png`/`captura-franja-sesion-despues.png` del scratchpad de esta sesión).
  - 3 temas: capturas del panel en claro/oscuro/papel (`captura-panel-zoom-claro.png`, `-oscuro.png`, `-papel.png` del scratchpad) — sombra visible como elevación sutil en los tres, iconos legibles en todos.
  - Cero errores de consola/página (`page.on("console"/"pageerror")`) en todo el recorrido.
- [x] VF3 Criterio de Requisito 1.2 verificado con evidencia concreta: capturas en `C:\Users\diego\AppData\Local\Temp\claude\c--Projects-great-state-worker-app\73562998-2dc4-44f9-8973-4ebdca3ea7c6\scratchpad\pw\` (`captura-panel-flotante.png` recorrido completo en tablet, `captura-panel-hires.png` iconos a alta resolución, capturas por tema y de la franja de sesión) — el panel flotante contextual con iconos funciona en las 3 secciones anotables, en los 3 temas, sigue la selección en scroll, voltea correctamente cerca del borde superior, y los controles de sesión no perdieron accesibilidad al ganar icono.
