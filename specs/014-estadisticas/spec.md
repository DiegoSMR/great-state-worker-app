# Spec: Estadísticas

Estado: borrador
Última actualización: 2026-09-14

## Resumen

Métricas que responden preguntas útiles sobre el aprendizaje (qué domino, qué olvido, dónde fallo más, si estoy mejorando), no un simple contador de "horas estudiadas".

## Historias de usuario

- Como usuario, quiero saber qué temas domino y cuáles estoy olvidando.
- Como usuario, quiero saber si estoy mejorando con el tiempo.

## Alcance (v1)

- Conjunto reducido de métricas realmente accionables por oposición: cobertura del temario, rendimiento en tests por tema, conceptos con más fallos.
- Evolución temporal básica de al menos una métrica clave.

## Fuera de alcance

- Métricas de planificación avanzada (sesiones previstas vs. realizadas queda en `009-planificador` hasta agregarse aquí).
- Comparación entre oposiciones — backlog, sección de funcionalidades posteriores de `PRODUCT-VISION.md`.

## Criterios de aceptación

- [ ] Existe una vista de estadísticas por oposición con cobertura del temario y rendimiento en tests.
- [ ] Cada métrica mostrada responde a una pregunta útil identificada en `PRODUCT-VISION.md`, no es decorativa.
- [ ] El usuario puede ver evolución temporal básica (mejora/empeora) de al menos una métrica clave.

## Preguntas abiertas

- Qué métricas concretas entran en el "conjunto reducido" de v1 — depende de qué datos ya existan de `004`/`006`/`011`/`012`.
