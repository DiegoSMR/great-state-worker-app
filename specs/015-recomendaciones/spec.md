# Spec: Recomendaciones

Estado: borrador
Última actualización: 2026-09-14

## Resumen

Capa transversal de recomendaciones explicables que combina progreso, repaso, errores y planificación en sugerencias concretas de acción. La app empieza a comportarse como un preparador auxiliar, sin convertirse en una "IA mágica" que decide sin explicar por qué.

## Historias de usuario

- Como usuario, quiero que la app me diga qué hacer ahora, con el motivo, en vez de solo mostrarme datos.

## Alcance (v1)

- Reutiliza las señales ya existentes de `004`, `006`, `009` y `012` para generar 1-3 recomendaciones priorizadas en el dashboard (`008`), cada una con motivo y acción directa.
- Reglas explicables sobre datos deterministas, sin modelo de IA generativa.

## Fuera de alcance

- Recomendaciones basadas en IA generativa/LLM — la visión de producto es explícita: no debe existir "IA mágica" sin explicación; cualquier IA llega después de que las reglas deterministas cubran lo esencial.

## Criterios de aceptación

- [ ] El dashboard muestra al menos una recomendación explicable generada a partir de datos reales del usuario.
- [ ] Cada recomendación indica el motivo concreto y una acción directa.
- [ ] Ninguna recomendación se genera sin datos suficientes que la respalden.

## Preguntas abiertas

- Prioridad relativa entre recomendaciones cuando compiten varias señales — mantener reglas simples en v1.
