# Spec: Convocatorias

Estado: borrador
Última actualización: 2026-09-14

## Resumen

Radar de convocatorias oficiales (fechas, plazas, organismos, requisitos, estado, enlaces) usando fuentes primarias, apoyado en el agente `investigador-convocatorias` ya existente en el proyecto.

## Historias de usuario

- Como usuario, quiero consultar el estado de las convocatorias que me interesan sin buscar manualmente en BOE/BOA.
- Como usuario, quiero que se me avise cuando cambie algo relevante de una convocatoria que sigo.

## Alcance (v1)

- Ficha de convocatoria por oposición en seguimiento: fechas, plazas, plazo de inscripción, estado, enlaces oficiales.
- Actualización manual/asistida a través del agente `investigador-convocatorias`, no scraping automático en v1.

## Fuera de alcance

- Alertas automáticas push/email — evolución posterior.
- Vínculo con progreso de preparación — `017-preparacion-convocatoria`.

## Criterios de aceptación

- [ ] Cada oposición en seguimiento tiene una ficha de convocatoria con datos y enlaces oficiales.
- [ ] La fuente de cada dato es trazable (enlace oficial o referencia).
- [ ] El usuario puede ver el estado de la convocatoria de un vistazo (no publicada / plazo abierto / plazo cerrado / examen próximo / finalizada).

## Preguntas abiertas

- Frecuencia y mecanismo de actualización en v1 (manual on-demand vs. proceso periódico) — puede empezar puramente manual.
