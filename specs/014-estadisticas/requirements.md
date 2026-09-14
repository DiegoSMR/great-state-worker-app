# Requirements: Estadísticas

Fase: 1 — Requirements. Estado: borrador.
Última actualización: 2026-09-14

## Resumen

Ofrecer un conjunto reducido de métricas accionables por oposición que respondan qué domina el usuario, qué olvida y si está mejorando.

## Requisito 1: Métricas accionables por oposición

**Historia:** Como usuario, quiero ver qué domino y qué estoy olvidando por oposición, no un conteo de horas.

**Criterios de aceptación:**
1. CUANDO el usuario consulta estadísticas de una oposición ENTONCES el sistema DEBERÁ mostrar cobertura del temario (conceptos estudiados/total) y rendimiento en tests por tema.
2. CUANDO un tema tiene rendimiento notablemente peor que la media del usuario ENTONCES el sistema DEBERÁ destacarlo como área débil.

## Requisito 2: Evolución temporal

**Historia:** Como usuario, quiero saber si estoy mejorando, no solo mi estado actual.

**Criterios de aceptación:**
1. CUANDO el usuario consulta la evolución de una métrica clave (ej. % de acierto en tests) ENTONCES el sistema DEBERÁ mostrar su tendencia en el tiempo, no solo el valor actual.

## Fuera de alcance

- Comparación entre oposiciones.
- Métricas de planificación avanzada.
