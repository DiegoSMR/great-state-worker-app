# Requirements: Convocatorias

Fase: 1 — Requirements. Estado: borrador.
Última actualización: 2026-09-14

## Resumen

Ofrecer una ficha de convocatoria por oposición en seguimiento, con datos oficiales trazables y estado visible de un vistazo.

## Requisito 1: Ficha de convocatoria con fuentes trazables

**Historia:** Como usuario, quiero ver los datos clave de una convocatoria con su fuente oficial.

**Criterios de aceptación:**
1. CUANDO el usuario consulta una oposición en seguimiento ENTONCES el sistema DEBERÁ mostrar su ficha de convocatoria: organismo, plazas, fechas relevantes, plazo de inscripción, estado y enlaces oficiales.
2. CUANDO un dato de la ficha proviene de una fuente oficial ENTONCES el sistema DEBERÁ enlazarla o referenciarla explícitamente.
3. CUANDO no hay información oficial disponible todavía para un campo ENTONCES el sistema DEBERÁ mostrarlo como "pendiente de confirmar", no un valor inventado o vacío sin explicación.

## Requisito 2: Estado de un vistazo

**Historia:** Como usuario, quiero saber en qué fase está cada convocatoria sin leer toda la ficha.

**Criterios de aceptación:**
1. CUANDO el usuario ve el listado de convocatorias en seguimiento ENTONCES el sistema DEBERÁ mostrar el estado de cada una (no publicada / plazo abierto / plazo cerrado / examen próximo / finalizada) de forma visualmente distinguible.

## Fuera de alcance

- Alertas automáticas.
- Vínculo con progreso de preparación (`017`).
