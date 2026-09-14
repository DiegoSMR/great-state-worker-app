# Requirements: Tests

Fase: 1 — Requirements. Estado: borrador.
Última actualización: 2026-09-14

## Resumen

Permitir sesiones de preguntas configurables sobre el banco de preguntas, con revisión posterior detallada que conecta cada fallo con su concepto.

## Requisito 1: Configuración del test

**Historia:** Como usuario, quiero elegir qué tipo de test hacer antes de empezar.

**Criterios de aceptación:**
1. CUANDO el usuario inicia un test ENTONCES el sistema DEBERÁ permitir filtrar las preguntas por oposición, tema, o "preguntas falladas anteriormente".
2. CUANDO el usuario configura el número de preguntas ENTONCES el sistema DEBERÁ generar el test con ese número, sin repetir preguntas dentro de la misma sesión.
3. CUANDO no hay preguntas suficientes para la configuración elegida ENTONCES el sistema DEBERÁ avisarlo claramente antes de empezar, no a mitad del test.

## Requisito 2: Revisión posterior detallada

**Historia:** Como usuario, quiero entender por qué acerté o fallé cada pregunta, no solo mi puntuación final.

**Criterios de aceptación:**
1. CUANDO el usuario termina el test ENTONCES el sistema DEBERÁ mostrar cada pregunta con la respuesta elegida, la correcta, la explicación y el concepto relacionado.
2. CUANDO el usuario revisa una pregunta fallada ENTONCES el sistema DEBERÁ ofrecer la opción de marcar el concepto relacionado para repaso (ver `006-repaso-inteligente`).

## Fuera de alcance

- Tiempo límite y condiciones de examen real.
- Estadísticas agregadas.
