# Tasks: Anotaciones personales de lectura

Fase: 3 — Tasks. Estado: borrador, pendiente de aprobación de Diego.
Última actualización: 2026-09-15

Generadas a partir de "Componentes afectados" y "Flujo de datos" de `design.md` (aprobado). Un commit por Requisito completado (más uno para la base técnica sin Requisito propio), según `CONSTITUTION.md`. Rama `020-anotaciones-personales-lectura`, creada desde `development` al empezar la Fase 4.

## Base técnica (sin Requisito propio)

- [ ] T0.1 `lib/anotaciones-lectura.ts`: tipo `AnotacionGuardada` (`{ html: string; hashOriginal: string; actualizadoEn: number }`); `calcularHash(texto: string)` (checksum simple, sin dependencia nueva); `guardarAnotacion`/`leerAnotacion`/`borrarAnotacion` (clave `gsw_anotaciones:<conceptoId>:<seccionId>`, mismo patrón `try/catch` defensivo que `lib/progreso-lectura.ts`); `sanitizarHtml(html: string)` (allowlist de tags/atributos: los ya permitidos por `esquemaTextoEnriquecido` de `Markdown.tsx` + `u` + `mark.anotacion-resaltado`).
  - Satisface: base de Requisito 2 (1, 2, 3, 4); base de Requisito 1.2 (sanitización del formato aplicado).
- [ ] T0.2 `app/globals.css`: nuevo par de tokens `--anotacion-fondo` (+ variantes oscuro/papel), mismo patrón que `--ejemplo-*`/`--excepcion-*`/`--atencion-*` (`specs/003-sistema-de-diseno` §14); clase `.anotacion-resaltado`.
  - Satisface: Requisito 1.2 (color de resaltado propio, distinto de los `ink-*` de autoría).

## Requisito 1 — Modo edición de anotaciones

- [ ] T1.1 `components/estudio/BarraFormato.tsx` (nuevo, `"use client"`): botones Negrita/Subrayado/Resaltar/Quitar formato; opera sobre `window.getSelection()`/`Range`, envuelve la selección en `<strong>`/`<u>`/`<mark class="anotacion-resaltado">` o la desenvuelve.
  - Satisface: Requisito 1.2.
- [ ] T1.2 `components/estudio/SeccionesConcepto.tsx`: nuevo estado `modoEdicion` (`useState`), botón toggle en la barra sticky ya existente (junto a `<ProgresoLectura />`); cuando `modoEdicion` es `true`, las 4 `div.contenido-lectura` pasan a `contentEditable` y se muestra `<BarraFormato>`; cuando es `false`, vuelven a solo lectura.
  - Satisface: Requisito 1 (1, 2, 3).

## Requisito 2 — Persistencia local, no compartida

- [ ] T2.1 `components/estudio/SeccionesConcepto.tsx`: al montar, guarda en un `ref` el HTML original de cada sección (antes de aplicar cualquier anotación); en un efecto (mismo patrón que la restauración de scroll ya existente), por cada sección: lee `localStorage` vía `lib/anotaciones-lectura.ts`, calcula el hash del `textContent` actual y lo compara con `hashOriginal` — si coincide, la deja disponible como versión anotada; si no coincide, borra esa entrada de `localStorage`.
  - Satisface: Requisito 2 (2, 3, 4 — el aislamiento por dispositivo es consecuencia directa de usar `localStorage`).
- [ ] T2.2 `components/estudio/SeccionesConcepto.tsx`: al perder el foco una sección editable (o con debounce mientras se escribe, mismo criterio de ~500ms que el guardado de posición de scroll), sanitiza su HTML actual (`lib/anotaciones-lectura.ts`), calcula su hash y lo guarda en `localStorage`.
  - Satisface: Requisito 2.1.

## Requisito 3 — Alternar entre vista con anotaciones y vista limpia

- [ ] T3.1 `components/estudio/SeccionesConcepto.tsx`: nuevo estado `mostrarAnotaciones` (`useState`, por defecto `true`); checkbox/switch en la barra sticky; alterna, por sección, entre el `ref` del HTML original (vista limpia) y el HTML anotado restaurado en T2.1 (vista con anotaciones), sin volver a pedir datos al servidor.
  - Satisface: Requisito 3 (1, 2, 3, 4).
- [ ] T3.2 `components/estudio/SeccionesConcepto.tsx`: activar `modoEdicion` fuerza `mostrarAnotaciones` a `true`.
  - Satisface: Requisito 3.5.

## Verificación (Fase 5)

- [ ] V1 `npm run lint` y `npm run build` limpios.
- [ ] V2 Recorrido en navegador (dev server), con énfasis en tablet (riesgo de `contentEditable` en touch señalado en `design.md`): activar modo edición, aplicar negrita/subrayado/resaltado, desactivar modo edición, recargar la página y comprobar que persiste; alternar el checkbox con/sin anotaciones sin perder lo guardado; editar a mano un `content/estudio/*.md` de prueba y comprobar que la anotación de esa sección se descarta sin romper el resto; claro/oscuro/papel.
- [ ] V3 Repaso criterio a criterio de los 3 Requisitos de `requirements.md` con evidencia concreta.
