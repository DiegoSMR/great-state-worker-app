# Requirements: Recomendaciones

Fase: 1 — Requirements. Estado: borrador.
Última actualización: 2026-09-14

## Resumen

Generar recomendaciones explicables, basadas en reglas deterministas sobre datos reales del usuario, integradas en el dashboard.

## Requisito 1: Recomendaciones explicables basadas en datos reales

**Historia:** Como usuario, quiero recomendaciones con motivo claro, no una caja negra.

**Criterios de aceptación:**
1. CUANDO el sistema genera una recomendación ENTONCES DEBERÁ incluir siempre el motivo concreto (dato o evento que la origina) y una acción directa ejecutable desde ahí.
2. CUANDO no hay datos suficientes para una recomendación fundamentada ENTONCES el sistema NO DEBERÁ inventar una recomendación genérica; DEBERÁ omitirla.

## Requisito 2: Integración con el dashboard

**Historia:** Como usuario, quiero ver mis recomendaciones donde ya reviso mi estado general.

**Criterios de aceptación:**
1. CUANDO existen recomendaciones activas ENTONCES el sistema DEBERÁ mostrarlas en el dashboard (`008`) ordenadas por prioridad, limitando el número mostrado para no saturar la vista.

## Fuera de alcance

- Recomendaciones basadas en IA generativa/LLM.
