# Tasks: Filtro del catálogo de temas por oposición

Fase: 3 — Tasks. Estado: borrador, pendiente de aprobación de Diego.
Última actualización: 2026-09-15

Generadas a partir de "Componentes afectados" de `design.md` (aprobado). Un commit por Requisito completado, según `CONSTITUTION.md`. Rama `019-filtro-catalogo-por-oposicion`, creada desde `development` al empezar la Fase 4.

## Requisito 1 — Filtrar el catálogo por oposición

- [ ] T1.1 `components/estudio/FiltroOposicion.tsx` (nuevo, `"use client"`): `<select>` con opción "Todas" + una por cada oposición en alcance (`o.nombre`); lee el valor actual vía `useSearchParams`; al cambiar, navega con `router.push` actualizando o quitando el query param `oposicion`.
  - Satisface: Requisito 1 (1, 2, 3)
- [ ] T1.2 `app/estudio/tema/page.tsx`: convertir a función `async` que recibe `searchParams: Promise<{ oposicion?: string }>`; valida el valor contra `OPOSICIONES_EN_ALCANCE_V1` (id inválido o ausente → se trata como "todas"); filtra `getConceptosEnAlcance()` a los conceptos donde `getOposicionesDeConcepto(concepto.id)` incluye esa oposición; el contador "N conceptos" refleja la lista ya filtrada; renderiza `<FiltroOposicion>` pasándole la oposición seleccionada actual.
  - Satisface: Requisito 1 (1, 2, 3, 4)

## Verificación (Fase 5)

- [ ] V1 `npm run lint` y `npm run build` limpios.
- [ ] V2 Recorrido en navegador (dev server): `/estudio/tema` sin filtro, con cada una de las 4 oposiciones, vuelta a "todas"; comprobar que el botón "atrás" tras entrar en un tema conserva el filtro aplicado; claro/oscuro/papel; ancho tablet.
- [ ] V3 Repaso criterio a criterio del Requisito 1 de `requirements.md` con evidencia concreta.
