# Tasks: Sistema de diseño (legibilidad, navegación y temas)

Fase: 3 — Tasks. Generadas a partir de la lista "Componentes afectados" y el "Flujo de datos" de `design.md` (revisión 2, aprobado para implementación). Cada tarea señala el Requisito de `requirements.md` al que sirve. Un commit por Requisito completado (más uno por tarea de base técnica sin Requisito propio), según `CONSTITUTION.md`.

Nota de proceso: Diego ya aprobó `requirements.md` y marcó `design.md` como "aprobado para implementación", y encargó explícitamente ejecutar esta fase de implementación completa sin pausas intermedias de aprobación. Este documento se genera y se seguirá en la misma sesión de trabajo, sin round-trip de aprobación de `tasks.md` en sí, tratando ese encargo como la aprobación de Fase 3→4.

## Base técnica (sin Requisito propio — tokens, persistencia, layout raíz)

- [x] T0.1 `app/globals.css`: tokens de color light/dark + 3 pares de estado, `@theme inline`, tokens tipográficos, `.medida-lectura`/`.medida-lectura-oficial`/`.contenido-lectura`, estilos de `<dialog>`.
- [x] T0.2 `lib/preferencias.ts`: tipos `Preferencias`, defaults, `parsearPreferencias`.
- [x] T0.3 `app/_actions/preferencias.ts`: Server Action `guardarPreferencias`.
- [x] T0.4 `components/preferencias/PreferenciasProvider.tsx`: Context Client Component (tema, navDensidad, tamanoLetra, concentracion).
- [x] T0.5 `app/layout.tsx`: lee cookie, `data-theme`/`data-tamano-letra` en `<html>`, envuelve en `PreferenciasProvider` + `NavShell`.

## Requisito 1 — Contraste y legibilidad

- [x] T1.1 Migrar todas las páginas de `neutral-*`/hex sueltos a tokens (`text-texto-primario`, `text-texto-secundario`, `border-borde`, `bg-bg-primario`/`bg-bg-secundario`).
- [x] T1.2 Verificar estados interactivos (hover/focus/active/disabled/enlaces) usan tokens, no colores nuevos.

## Requisito 2 — Navegación global responsive por niveles de densidad

- [x] T2.1 `lib/nav-densidad.ts`: `clasesVariante`.
- [x] T2.2 `lib/nav-items.ts`: catálogo de entradas.
- [x] T2.3 `components/nav/iconos.tsx`: set mínimo de iconos inline.
- [x] T2.4 `components/nav/NavShell.tsx`, `NavHamburguesa.tsx`, `NavIconos.tsx`, `NavVisible.tsx`.
- [x] T2.5 `components/preferencias/PreferenciasPanel.tsx` (incluye selector de tema y tamaño de letra, accesible desde las 3 variantes).

## Requisito 3 — Selector de tema explícito y extensible

- [x] T3.1 Selector "Claro"/"Oscuro" dentro de `PreferenciasPanel`, modelo de string no booleano (ya cubierto por T0.2).

## Requisito 4 — Navegación y estructura local dentro de un concepto

- [x] T4.1 `components/estudio/SeccionesConcepto.tsx`: tabs + scrollspy + cajas por sección.
- [x] T4.2 `components/estudio/Markdown.tsx` (Server): wrapper de `ReactMarkdown` con tokens de tipografía.

## Requisito 5 — Estado "sin escribir"

- [x] T5.1 `components/estudio/EstadoPendiente.tsx` extraído y retocado con tokens.

## Requisito 6 — Estado "en revisión"

- [x] T6.1 `lib/contenido.ts`: parsear `en_revision` → `enRevision`.
- [x] T6.2 `components/estudio/AvisoRevision.tsx`.

## Requisito 7 — Badges consistentes

- [x] T7.1 `NucleoComunBadge.tsx`, `BookmarkButton.tsx` recoloreados con tokens (ámbar/violeta).

## Requisito 8 — Perfil de lectura extensible

- [x] T8.1 Control de tamaño de letra en `PreferenciasPanel` (ya cubierto en T2.5), aplicado vía `data-tamano-letra` + `--tamano-base`.

## Requisito 9 — Modo concentración

- [x] T9.1 `concentracion`/`toggleConcentracion` en `PreferenciasProvider` (ya en T0.4).
- [x] T9.2 `components/estudio/BotonSalirConcentracion.tsx` + `NavShell` renderiza variante mínima cuando `concentracion === true`. Además, `components/estudio/OcultarEnConcentracion.tsx` (nuevo) oculta las oposiciones asociadas y el badge de núcleo común en la vista de concepto mientras el modo está activo, tal como especifica `design.md` (gap detectado y corregido en la verificación final).

## Requisito 10 — Progreso de lectura

- [x] T10.1 `lib/progreso-lectura.ts`: `guardarPosicion`/`leerPosicion` sobre `localStorage`.
- [x] T10.2 `components/estudio/ProgresoLectura.tsx`: barra + integración de restauración de scroll y aviso "continuar leyendo" en `SeccionesConcepto`.

## Requisito 11 — Trazabilidad de fuentes normativas

- [x] T11.1 `lib/contenido.ts`: `extraerEnlaceFuente` (tolera dominios sin esquema).
- [x] T11.2 `components/estudio/FuenteNormativa.tsx` (`<details>`), enlazado desde `AvisoRevision`.

## Requisito 12 — Accesibilidad mínima

- [x] T12.1 Checklist aplicado transversalmente (foco visible, `aria-label`, `<dialog>` nativo para overlay/panel, `prefers-reduced-motion`, HTML semántico) — verificado componente a componente, sin infraestructura nueva. Durante la revisión final se corrigieron dos huecos reales: faltaba la regla `scroll-behavior: smooth` en `app/globals.css` (el atributo `data-scroll-behavior="smooth"` de `app/layout.tsx` no tenía efecto sin ella, así que las anclas de `SeccionesConcepto` no se desplazaban suavemente) y los botones "Cerrar menú"/"Cerrar preferencias" tenían un tamaño táctil menor (p-1.5 + icono 1.1em) que el resto de iconos de la app (p-2/p-2.5 + 1.2–1.3em) — ambos corregidos.

## Requisito 13 — Jerarquía visual estable

- [x] T13.1 Revisión final: ningún badge/aviso supera en peso visual al contenido — confirmado (`NucleoComunBadge` text-xs, `BookmarkButton`/`AvisoRevision`/`FuenteNormativa` text-sm, todos por debajo de `--tamano-base` del cuerpo de lectura; `ProgresoLectura` es `aria-hidden` y usa el token neutro `--borde`, nunca un color de estado). Se detectó y corrigió además una discrepancia entre `design.md` y el código: el modo concentración no ocultaba las oposiciones asociadas ni el badge de núcleo común como estaba decidido — se añadió `components/estudio/OcultarEnConcentracion.tsx` para resolverlo.

## Páginas a adaptar (consumen lo anterior)

- [x] TP.1 `app/page.tsx`
- [x] TP.2 `app/estudio/page.tsx`
- [x] TP.3 `app/estudio/tema/page.tsx`
- [x] TP.4 `app/estudio/oposicion/[oposicionId]/page.tsx`
- [x] TP.5 `app/estudio/tema/[conceptoId]/page.tsx`
- [x] TP.6 `app/estudio/marcadores/page.tsx`

## Verificación (Fase 5)

- [x] V1 `npm run lint`, `npm run build` limpios.
- [x] V2 Recorrido en navegador (dev server, Playwright headless): inicio, `/estudio`, concepto con contenido real (los 3 nuevos: constitucion-espanola, empleo-publico, procedimiento-administrativo-comun) en claro/oscuro, concepto sin contenido (`cortes-generales`), aviso "en revisión" (probado marcando `en_revision: true` temporalmente en `empleo-publico.md` y revertido después), 3 densidades de nav, selector de tema, panel de tamaño de letra, modo concentración (activar/salir), progreso de lectura + restauración de posición + aviso "continuar leyendo" tras recargar, foco de teclado visible, overlay móvil con cierre por Escape. Sin errores de consola en ningún escenario.
- [x] V3 Verificar enganche de contenido nuevo (`content/estudio/constitucion-espanola.md`, `empleo-publico.md`, `procedimiento-administrativo-comun.md`) en `dga-aux-adm`/`ayto-zgz-aux-adm` — confirmado visualmente en las capturas de V2 (ambos organismos aparecen listados en los tres conceptos).
- [x] V4 Actualizar `ARCHITECTURE.md`.

## Fuera de alcance de v1 (documentado, no bloqueante)

- Indicador de completitud "partial" del Requisito 5.5 — los conceptos reales de hoy son todos `empty` o `complete`; Requisito 5.4 permite implementar solo esos dos valores en v1. No se construye UI para un caso sin datos reales que lo ejerciten; se deja anotado como evolutivo si aparece un concepto parcial de verdad.
