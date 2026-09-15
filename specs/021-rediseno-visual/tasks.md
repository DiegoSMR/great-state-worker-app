# Tasks: Rediseño visual (acento, elevación, marca, tipografía)

Fase: 3 — Tasks. Estado: borrador, pendiente de aprobación de Diego.
Última actualización: 2026-09-15

Generadas a partir de "Componentes afectados" de `design.md` (aprobado). Un commit por Requisito completado (más uno para la base técnica), según `CONSTITUTION.md`. Rama `021-rediseno-visual`, creada desde `development` al empezar la Fase 4.

## Base técnica (sin Requisito propio)

- [ ] T0.1 `app/globals.css`: nuevos tokens `--acento-fuerte` (claro/papel `#1E3A5F`, oscuro `#5C91D6`) y `--sombra-tarjeta` (claro/papel 2 capas de opacidad baja, oscuro con opacidad más alta para seguir siendo perceptible), clase `.sombra-sutil`.
  - Satisface: base de Requisito 1 y 2.

## Requisito 1 — Acento de interacción

- [ ] T1.1 `components/estudio/SeccionesConcepto.tsx`: la pestaña activa usa `--acento-fuerte` (`border-b-2`) en vez de `border-texto-primario`.
  - Satisface: Requisito 1 (1, 3).
- [ ] T1.2 `components/nav/NavIconos.tsx`, `NavVisible.tsx`, `NavHamburguesa.tsx`: la entrada de navegación activa usa `--acento-fuerte` en vez de solo `bg-bg-secundario`.
  - Satisface: Requisito 1 (1, 3).

## Requisito 2 — Elevación sutil

- [ ] T2.1 `app/estudio/tema/page.tsx`, `app/estudio/page.tsx`: clase `.sombra-sutil` en las tarjetas de catálogo/listado.
  - Satisface: Requisito 2 (1, 2).
- [ ] T2.2 `components/preferencias/PreferenciasPanel.tsx`: clase `.sombra-sutil` en el panel.
  - Satisface: Requisito 2 (1, 2).
- [ ] T2.3 `<dialog>` de navegación móvil (`NavHamburguesa.tsx`): clase `.sombra-sutil`.
  - Satisface: Requisito 2 (1, 2).

## Requisito 3 — Wordmark propio

- [ ] T3.1 `components/nav/Wordmark.tsx` (nuevo): inicial "G" en peso grueso con `--acento-fuerte`, mismo tamaño/radio que los iconos del rail.
  - Satisface: Requisito 3 (1, 2).
- [ ] T3.2 `NavIconos.tsx`, `NavVisible.tsx`, `NavHamburguesa.tsx`: sustituir el texto placeholder "GSW" por `<Wordmark />`.
  - Satisface: Requisito 3 (1, 2).

## Requisito 4 — Jerarquía tipográfica por peso

- [ ] T4.1 `components/estudio/Markdown.tsx`: `prose-h1:font-bold prose-h2:font-semibold prose-h3:font-medium`, sustituyendo el `prose-headings:font-semibold` uniforme actual.
  - Satisface: Requisito 4 (1, 2).
- [ ] T4.2 `app/estudio/**` (incluido `SeccionesConcepto.tsx`): unificar los h1/h2/h3 sueltos fuera de markdown al criterio de la tabla (h1 `font-bold`, h2 `font-semibold`, h3 `font-medium`).
  - Satisface: Requisito 4 (1, 2).
- [ ] T4.3 `specs/003-sistema-de-diseno/notas-de-diseno.md`: adenda documentando la activación de `--acento-fuerte`/`--sombra-tarjeta` y la escala de peso tipográfica (mismo criterio que la adenda ya existente del tema "papel").
  - Satisface: trazabilidad de la decisión (no un criterio de UI en sí).

## Verificación (Fase 5)

- [ ] V1 `npm run lint` y `npm run build` limpios.
- [ ] V2 Recorrido visual (dev server) en `/estudio`, `/estudio/tema`, un concepto con contenido (incluyendo uno en revisión normativa, para comprobar que `--acento-fuerte` no se confunde con el aviso de revisión), el panel de preferencias y el diálogo de navegación móvil — claro/oscuro/papel, ancho tablet y desktop.
- [ ] V3 Repaso criterio a criterio de los 4 Requisitos de `requirements.md` con evidencia concreta (capturas).
