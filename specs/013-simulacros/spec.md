# Spec: Simulacros

Estado: borrador
Última actualización: 2026-09-14

## Resumen

Reproduce condiciones reales de examen (número de preguntas, tiempo, reglas de puntuación/penalización) reutilizando el banco de preguntas (`010`) y el motor de tests (`011`).

## Historias de usuario

- Como usuario, quiero hacer un simulacro con el número de preguntas y tiempo reales del examen al que me presento.
- Como usuario, quiero ver un análisis del simulacro después, no solo la nota.

## Alcance (v1)

- Configuración de simulacro por oposición: número de preguntas, tiempo límite, reglas de puntuación/penalización si existen.
- Ejecución con temporizador visible, sin revisión hasta el final.
- Resultado final con puntuación y análisis pregunta a pregunta (reutiliza la revisión de `011-tests`).

## Fuera de alcance

- Reglas de examen muy específicas por organismo si no están investigadas todavía — se añaden incrementalmente.
- Comparación histórica entre simulacros — `014-estadisticas`.

## Criterios de aceptación

- [ ] El usuario puede configurar un simulacro con las condiciones reales de una oposición concreta.
- [ ] Durante el simulacro hay un temporizador visible y las preguntas no muestran revisión hasta el final.
- [ ] Al terminar, se muestra puntuación final y análisis por pregunta igual que en un test normal.

## Preguntas abiertas

- Reglas exactas de puntuación/penalización por oposición — depende de la investigación de convocatorias (`016`); puede empezar con reglas genéricas configurables.
