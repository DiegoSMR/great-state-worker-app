# Tasks: Sistema de diseño (legibilidad, navegación y temas)

Fase: 3 — Tasks. Generadas a partir de la lista "Componentes afectados" y el "Flujo de datos" de `design.md` (revisión 2, aprobado para implementación). Cada tarea señala el Requisito de `requirements.md` al que sirve. Un commit por Requisito completado (más uno por tarea de base técnica sin Requisito propio), según `CONSTITUTION.md`.

Nota de proceso: Diego ya aprobó `requirements.md` y marcó `design.md` como "aprobado para implementación", y encargó explícitamente ejecutar esta fase de implementación completa sin pausas intermedias de aprobación. Este documento se genera y se seguirá en la misma sesión de trabajo, sin round-trip de aprobación de `tasks.md` en sí, tratando ese encargo como la aprobación de Fase 3→4.

## Base técnica (sin Requisito propio — tokens, persistencia, layout raíz)

- [ ] T0.1 `app/globals.css`: tokens de color light/dark + 3 pares de estado, `@theme inline`, tokens tipográficos, `.medida-lectura`/`.medida-lectura-oficial`/`.contenido-lectura`, estilos de `<dialog>`.
- [ ] T0.2 `lib/preferencias.ts`: tipos `Preferencias`, defaults, `parsearPreferencias`.
- [ ] T0.3 `app/_actions/preferencias.ts`: Server Action `guardarPreferencias`.
- [ ] T0.4 `components/preferencias/PreferenciasProvider.tsx`: Context Client Component (tema, navDensidad, tamanoLetra, concentracion).
- [ ] T0.5 `app/layout.tsx`: lee cookie, `data-theme`/`data-tamano-letra` en `<html>`, envuelve en `PreferenciasProvider` + `NavShell`.

## Requisito 1 — Contraste y legibilidad

- [ ] T1.1 Migrar todas las páginas de `neutral-*`/hex sueltos a tokens (`text-texto-primario`, `text-texto-secundario`, `border-borde`, `bg-bg-primario`/`bg-bg-secundario`).
- [ ] T1.2 Verificar estados interactivos (hover/focus/active/disabled/enlaces) usan tokens, no colores nuevos.

## Requisito 2 — Navegación global responsive por niveles de densidad

- [ ] T2.1 `lib/nav-densidad.ts`: `clasesVariante`.
- [ ] T2.2 `lib/nav-items.ts`: catálogo de entradas.
- [ ] T2.3 `components/nav/iconos.tsx`: set mínimo de iconos inline.
- [ ] T2.4 `components/nav/NavShell.tsx`, `NavHamburguesa.tsx`, `NavIconos.tsx`, `NavVisible.tsx`.
- [ ] T2.5 `components/preferencias/PreferenciasPanel.tsx` (incluye selector de tema y tamaño de letra, accesible desde las 3 variantes).

## Requisito 3 — Selector de tema explícito y extensible

- [ ] T3.1 Selector "Claro"/"Oscuro" dentro de `PreferenciasPanel`, modelo de string no booleano (ya cubierto por T0.2).

## Requisito 4 — Navegación y estructura local dentro de un concepto

- [ ] T4.1 `components/estudio/SeccionesConcepto.tsx`: tabs + scrollspy + cajas por sección.
- [ ] T4.2 `components/estudio/Markdown.tsx` (Server): wrapper de `ReactMarkdown` con tokens de tipografía.

## Requisito 5 — Estado "sin escribir"

- [ ] T5.1 `components/estudio/EstadoPendiente.tsx` extraído y retocado con tokens.

## Requisito 6 — Estado "en revisión"

- [ ] T6.1 `lib/contenido.ts`: parsear `en_revision` → `enRevision`.
- [ ] T6.2 `components/estudio/AvisoRevision.tsx`.

## Requisito 7 — Badges consistentes

- [ ] T7.1 `NucleoComunBadge.tsx`, `BookmarkButton.tsx` recoloreados con tokens (ámbar/violeta).

## Requisito 8 — Perfil de lectura extensible

- [ ] T8.1 Control de tamaño de letra en `PreferenciasPanel` (ya cubierto en T2.5), aplicado vía `data-tamano-letra` + `--tamano-base`.

## Requisito 9 — Modo concentración

- [ ] T9.1 `concentracion`/`toggleConcentracion` en `PreferenciasProvider` (ya en T0.4).
- [ ] T9.2 `components/estudio/BotonSalirConcentracion.tsx` + `NavShell` renderiza variante mínima cuando `concentracion === true`.

## Requisito 10 — Progreso de lectura

- [ ] T10.1 `lib/progreso-lectura.ts`: `guardarPosicion`/`leerPosicion` sobre `localStorage`.
- [ ] T10.2 `components/estudio/ProgresoLectura.tsx`: barra + integración de restauración de scroll y aviso "continuar leyendo" en `SeccionesConcepto`.

## Requisito 11 — Trazabilidad de fuentes normativas

- [ ] T11.1 `lib/contenido.ts`: `extraerEnlaceFuente` (tolera dominios sin esquema).
- [ ] T11.2 `components/estudio/FuenteNormativa.tsx` (`<details>`), enlazado desde `AvisoRevision`.

## Requisito 12 — Accesibilidad mínima

- [ ] T12.1 Checklist aplicado transversalmente (foco visible, `aria-label`, `<dialog>` nativo para overlay/panel, `prefers-reduced-motion`, HTML semántico) — verificado componente a componente, sin infraestructura nueva.

## Requisito 13 — Jerarquía visual estable

- [ ] T13.1 Revisión final: ningún badge/aviso supera en peso visual al contenido.

## Páginas a adaptar (consumen lo anterior)

- [ ] TP.1 `app/page.tsx`
- [ ] TP.2 `app/estudio/page.tsx`
- [ ] TP.3 `app/estudio/tema/page.tsx`
- [ ] TP.4 `app/estudio/oposicion/[oposicionId]/page.tsx`
- [ ] TP.5 `app/estudio/tema/[conceptoId]/page.tsx`
- [ ] TP.6 `app/estudio/marcadores/page.tsx`

## Verificación (Fase 5)

- [ ] V1 `npm run lint`, `npm run build` limpios.
- [ ] V2 Recorrido en navegador (dev server): inicio, `/estudio`, oposición, concepto con contenido real (3 nuevos) en claro/oscuro, concepto sin contenido, 3 densidades de nav, selector de tema, panel de tamaño de letra, modo concentración, progreso de lectura + continuar donde lo dejaste.
- [ ] V3 Verificar enganche de contenido nuevo (`content/estudio/constitucion-espanola.md`, `empleo-publico.md`, `procedimiento-administrativo-comun.md`) en `dga-aux-adm`/`ayto-zgz-aux-adm`.
- [ ] V4 Actualizar `ARCHITECTURE.md`.

## Fuera de alcance de v1 (documentado, no bloqueante)

- Indicador de completitud "partial" del Requisito 5.5 — los conceptos reales de hoy son todos `empty` o `complete`; Requisito 5.4 permite implementar solo esos dos valores en v1. No se construye UI para un caso sin datos reales que lo ejerciten; se deja anotado como evolutivo si aparece un concepto parcial de verdad.
