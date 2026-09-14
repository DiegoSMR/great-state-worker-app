# Spec: Banco de Preguntas

Estado: borrador
Última actualización: 2026-09-14

## Resumen

Base de preguntas de examen asociadas a conceptos concretos del temario, con procedencia trazable. Es el bloque de datos sobre el que se construyen tests (`011`), errores (`012`) y simulacros (`013`); no incluye por sí misma la experiencia de responder.

## Historias de usuario

- Como usuario, quiero que las preguntas estén conectadas al temario, para poder ir del fallo al concepto que debo repasar.
- Como usuario, quiero saber si una pregunta es de un examen real o creada para la app.

## Alcance (v1)

- Modelo de pregunta: enunciado, opciones, respuesta correcta, explicación, concepto relacionado, fuente, dificultad, procedencia.
- Carga inicial manual de preguntas para los conceptos ya redactados en `001-seccion-estudio`.

## Fuera de alcance

- Sesiones de test (`011-tests`) y simulacros (`013-simulacros`) — este bloque es solo el banco de datos y su gestión.

## Criterios de aceptación

- [ ] Cada pregunta está asociada a un concepto existente del temario.
- [ ] Cada pregunta indica su procedencia (oficial de examen real / original de la app / adaptada).
- [ ] Ninguna pregunta reproduce material protegido de academias/editoriales — mismo principio que el contenido de `001-seccion-estudio` (ver `CONSTITUTION.md`).

## Preguntas abiertas

- Origen de las preguntas oficiales reales: qué fuentes de exámenes anteriores son de dominio público y usables.
