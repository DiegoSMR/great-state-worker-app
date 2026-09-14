# Spec: Preparación por Convocatoria

Estado: borrador
Última actualización: 2026-09-14

## Resumen

Vincula una convocatoria concreta (`016`) con el temario y el progreso real del usuario (`004`) para responder "¿llego preparado?" — algo mucho más útil que un simple calendario.

## Historias de usuario

- Como usuario, quiero saber qué porcentaje del contenido relevante para una convocatoria concreta ya tengo estudiado.
- Como usuario, quiero saber cuánto tiempo queda y si mi ritmo actual es suficiente.

## Alcance (v1)

- Cálculo simple de cobertura: % de conceptos del temario de esa oposición con progreso "estudiado" o mejor (`004-progreso-estudio`), mostrado junto a la ficha de convocatoria (`016`).
- Mensaje tipo "quedan X días y tienes estudiado el Y% del contenido relevante".

## Fuera de alcance

- Proyección predictiva de si "llegará a tiempo" con el ritmo actual — requiere datos históricos suficientes de `009-planificador`/`014-estadisticas`, evolución posterior.

## Criterios de aceptación

- [ ] La ficha de una convocatoria en seguimiento muestra el % de temario relevante ya estudiado.
- [ ] Se muestra el número de días restantes hasta la fecha relevante de esa convocatoria (inscripción o examen, según cuál aplique).
- [ ] El cálculo se basa en datos reales de progreso (`004`), no en estimaciones sin fundamento.

## Preguntas abiertas

- Qué fecha usar como referencia cuando aún no se conoce la fecha de examen (¿plazo de inscripción como proxy?).
