# Requirements: Banco de Preguntas

Fase: 1 — Requirements. Estado: borrador.
Última actualización: 2026-09-14

## Resumen

Disponer de preguntas de examen conectadas al temario y con procedencia trazable, base de datos para tests, errores y simulacros.

## Requisito 1: Modelo de pregunta conectado al temario

**Historia:** Como usuario, quiero que cada pregunta esté vinculada a un concepto concreto, para poder navegar del fallo al contenido relacionado.

**Criterios de aceptación:**
1. CUANDO se crea una pregunta ENTONCES el sistema DEBERÁ requerir su asociación a un concepto existente del temario.
2. CUANDO se muestra una pregunta ENTONCES el sistema DEBERÁ incluir enunciado, opciones, respuesta correcta, explicación y fuente cuando exista.
3. CUANDO se muestra una pregunta ENTONCES el sistema DEBERÁ indicar su procedencia (oficial de examen real, original de la app, o adaptada) de forma visible.

## Requisito 2: Trazabilidad y origen legal del contenido

**Historia:** Como usuario, quiero confiar en que las preguntas no infringen derechos de terceros.

**Criterios de aceptación:**
1. CUANDO se incorpora una pregunta al banco ENTONCES el sistema NO DEBERÁ admitir preguntas copiadas literalmente de material con copyright de academias/editoriales.
2. CUANDO una pregunta proviene de un examen oficial real ENTONCES el sistema DEBERÁ registrar el año/convocatoria de procedencia.

## Fuera de alcance

- Sesiones de test.
- Simulacros.
