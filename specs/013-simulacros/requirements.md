# Requirements: Simulacros

Fase: 1 — Requirements. Estado: borrador.
Última actualización: 2026-09-14

## Resumen

Reproducir las condiciones reales de examen de una oposición reutilizando el banco de preguntas y el motor de tests, con análisis posterior integrado.

## Requisito 1: Configuración y ejecución con condiciones de examen real

**Historia:** Como usuario, quiero simular el examen real de mi oposición, con su número de preguntas y tiempo.

**Criterios de aceptación:**
1. CUANDO el usuario configura un simulacro para una oposición concreta ENTONCES el sistema DEBERÁ aplicar el número de preguntas y el tiempo límite configurados para esa oposición, o valores por defecto si aún no se han investigado.
2. CUANDO el simulacro está en curso ENTONCES el sistema DEBERÁ mostrar un temporizador visible y NO DEBERÁ mostrar si una respuesta es correcta hasta el final.
3. CUANDO se agota el tiempo ENTONCES el sistema DEBERÁ finalizar el simulacro automáticamente y calcular el resultado con las respuestas dadas hasta ese momento.

## Requisito 2: Resultado y análisis posterior

**Historia:** Como usuario, quiero un análisis del simulacro, no solo la nota final.

**Criterios de aceptación:**
1. CUANDO el simulacro termina ENTONCES el sistema DEBERÁ mostrar la puntuación final aplicando las reglas de penalización configuradas, si existen.
2. CUANDO el usuario revisa el resultado ENTONCES el sistema DEBERÁ ofrecer la misma revisión pregunta a pregunta que un test normal (`011`), integrada con errores (`012`).

## Fuera de alcance

- Reglas de examen muy específicas no investigadas todavía.
- Comparación histórica entre simulacros.
