# Requirements: Filtro del catálogo de temas por oposición

Fase: 1 — Requirements. Estado: borrador, pendiente de aprobación de Diego.
Última actualización: 2026-09-15

## Resumen

El catálogo de temas (`app/estudio/tema/page.tsx`) lista hoy todos los conceptos en alcance (`getConceptosEnAlcance()`) sin ninguna forma de acotarlos. Diego quiere poder filtrar esa lista por oposición, para ver solo los conceptos que le corresponden a la que está preparando en cada momento, sin tener que revisar el catálogo completo ni pasar por "Por oposición" (que muestra la numeración oficial, no el catálogo de conceptos sin duplicados).

## Requisito 1: Filtrar el catálogo por oposición

**Historia:** Como usuario, quiero filtrar el catálogo de temas por oposición, para ver solo los conceptos que le corresponden a la oposición que estoy preparando en cada momento.

**Criterios de aceptación:**
1. CUANDO el usuario abre el catálogo de temas ENTONCES el sistema DEBERÁ ofrecer un selector con las oposiciones en alcance (`OPOSICIONES_EN_ALCANCE_V1`) más una opción "todas".
2. CUANDO el usuario selecciona una oposición concreta ENTONCES el sistema DEBERÁ mostrar solo los conceptos que tienen al menos una fila de relación con esa oposición (mismo criterio que `getOposicionesDeConcepto`), y el contador "N conceptos" DEBERÁ reflejar el número ya filtrado.
3. CUANDO el usuario selecciona "todas" (o no ha elegido ninguna todavía) ENTONCES el sistema DEBERÁ mostrar el catálogo completo, igual que hoy.
4. CUANDO el usuario aplica un filtro, entra en un tema y vuelve atrás con el navegador ENTONCES el sistema DEBERÁ conservar el filtro que tenía aplicado, para no perder el contexto de qué oposición estaba mirando.

## Fuera de alcance

- Búsqueda por texto libre sobre el título del concepto (Diego confirma que, de momento, filtrar por oposición es suficiente).
- Filtro por núcleo común / específico.
- Persistir el filtro como preferencia entre sesiones o dispositivos (vive en la URL de la visita, no en la cookie `gsw_prefs` ni en `localStorage`).
