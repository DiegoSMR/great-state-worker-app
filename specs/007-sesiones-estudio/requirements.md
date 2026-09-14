# Requirements: Sesiones de Estudio

Fase: 1 — Requirements. Estado: borrador.
Última actualización: 2026-09-14

## Resumen

Agrupar las interacciones del usuario (conceptos vistos/estudiados, flashcards repasadas) en sesiones medibles con duración y resultado.

## Requisito 1: Iniciar y cerrar una sesión de estudio

**Historia:** Como usuario, quiero marcar el inicio y el fin de una sesión de estudio, para que quede registrada como una unidad.

**Criterios de aceptación:**
1. CUANDO el usuario inicia una sesión ENTONCES el sistema DEBERÁ registrar la hora de inicio y empezar a asociar a esa sesión los conceptos y flashcards con los que interactúe.
2. CUANDO el usuario termina la sesión ENTONCES el sistema DEBERÁ registrar la hora de fin y calcular la duración.
3. CUANDO el usuario cierra la app o navega fuera sin terminar explícitamente ENTONCES el sistema DEBERÁ cerrar la sesión automáticamente tras un periodo de inactividad razonable.

## Requisito 2: Resumen e historial de sesiones

**Historia:** Como usuario, quiero ver qué hice en cada sesión pasada, para tener una idea de mi ritmo de estudio.

**Criterios de aceptación:**
1. CUANDO una sesión termina ENTONCES el sistema DEBERÁ mostrar un resumen con duración, conceptos estudiados y flashcards repasadas.
2. CUANDO el usuario consulta el historial de sesiones ENTONCES el sistema DEBERÁ listarlas ordenadas por fecha, con acceso al resumen de cada una.

## Fuera de alcance

- Integración con preguntas/tests.
- Planificación de sesiones futuras.
