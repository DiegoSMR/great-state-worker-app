# Spec: Sesiones de Estudio

Estado: borrador
Última actualización: 2026-09-14

## Resumen

Convierte acciones aisladas (leer, flashcards) en sesiones medibles con duración y resultado, sentando la base para que el planificador (`009`) y el dashboard (`008`) puedan responder qué tipo de estudio funciona mejor.

## Historias de usuario

- Como usuario, quiero iniciar una sesión de estudio, para estructurar mi tiempo.
- Como usuario, quiero ver un resumen al terminar la sesión.
- Como usuario, quiero consultar mis sesiones pasadas.

## Alcance (v1)

- Sesión = contenedor con inicio/fin, conceptos vistos/estudiados y flashcards repasadas dentro de esa ventana.
- Cierre automático tras inactividad, para no dejar sesiones abiertas indefinidamente.
- Resumen al terminar e historial simple consultable.

## Fuera de alcance

- Objetivos de sesión predefinidos y elaborados — eso corresponde al planificador (`009-planificador`).
- Integración con preguntas/tests — todavía no existen (`010`/`011`).

## Criterios de aceptación

- [ ] El usuario puede iniciar y terminar explícitamente una sesión de estudio.
- [ ] Al terminar, se muestra un resumen (duración, conceptos vistos/estudiados, flashcards repasadas).
- [ ] Las sesiones quedan guardadas y son consultables en un historial simple.

## Preguntas abiertas

- Si el estudio informal (sin "iniciar sesión" explícito) también debe generar datos aprovechables, o solo cuenta lo que ocurre dentro de una sesión formal.
