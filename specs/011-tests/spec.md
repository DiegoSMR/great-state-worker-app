# Spec: Tests

Estado: borrador
Última actualización: 2026-09-14

## Resumen

Sesiones de preguntas configurables (por oposición, tema, conceptos débiles, falladas, dificultad, número) sobre el banco de preguntas (`010`), con revisión posterior detallada por pregunta.

## Historias de usuario

- Como usuario, quiero configurar un test según lo que quiero practicar (tema, dificultad, falladas).
- Como usuario, quiero revisar cada pregunta después del test con su explicación y fuente.

## Alcance (v1)

- Configuración básica de test: oposición/tema, número de preguntas, incluir falladas o no.
- Ejecución secuencial de preguntas.
- Pantalla de revisión con explicación por pregunta y opción de marcar el concepto para repaso (conecta con `006`).

## Fuera de alcance

- Tiempo límite y condiciones de examen real — `013-simulacros`.
- Estadísticas agregadas de rendimiento — `014-estadisticas`.

## Criterios de aceptación

- [ ] El usuario puede configurar un test por oposición, tema o preguntas falladas antes de empezar.
- [ ] Tras responder cada pregunta, el usuario puede ver si acertó y por qué.
- [ ] Al terminar el test hay una revisión completa con explicación, fuente y concepto relacionado por pregunta.

## Preguntas abiertas

- Ninguna crítica identificada; depende de que `010-banco-de-preguntas` tenga datos suficientes.
