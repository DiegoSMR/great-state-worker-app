# Requirements: Preparación por Convocatoria

Fase: 1 — Requirements. Estado: borrador.
Última actualización: 2026-09-14

## Resumen

Cruzar el progreso real del usuario con los datos de una convocatoria concreta para responder si llega preparado y cuánto tiempo le queda.

## Requisito 1: Cobertura de temario relevante para una convocatoria

**Historia:** Como usuario, quiero saber qué parte del temario de una convocatoria concreta ya tengo estudiada.

**Criterios de aceptación:**
1. CUANDO el usuario consulta una convocatoria en seguimiento vinculada a una oposición ENTONCES el sistema DEBERÁ calcular y mostrar el porcentaje de conceptos de esa oposición con progreso "estudiado" o superior (ver `004-progreso-estudio`).
2. CUANDO el temario de la oposición aún no está completo en la app (conceptos con "contenido pendiente", ver `001-seccion-estudio`) ENTONCES el sistema DEBERÁ dejarlo claro en el cálculo, para no dar una falsa sensación de cobertura completa.

## Requisito 2: Tiempo restante hasta la fecha relevante

**Historia:** Como usuario, quiero saber cuánto tiempo me queda respecto a una convocatoria concreta.

**Criterios de aceptación:**
1. CUANDO una convocatoria tiene una fecha relevante conocida (plazo de inscripción o examen) ENTONCES el sistema DEBERÁ mostrar los días restantes junto al porcentaje de cobertura.
2. CUANDO no se conoce todavía ninguna fecha relevante ENTONCES el sistema DEBERÁ mostrarlo explícitamente como "fecha aún no publicada", no ocultar el bloque.

## Fuera de alcance

- Proyección predictiva de si el ritmo actual será suficiente.
