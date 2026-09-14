# Spec: Repaso Inteligente

Estado: borrador
Última actualización: 2026-09-14

## Resumen

Decide qué merece ser repasado, combinando el progreso (`004`) y los resultados de flashcards (`005`) en una cola de repaso priorizada y explicable. Es el primer paso hacia repetición espaciada, pero no la introduce todavía.

## Historias de usuario

- Como usuario, quiero que la app me diga qué debería repasar hoy, para no depender de mi memoria de qué llevo descuidando.
- Como usuario, quiero entender por qué se me recomienda repasar un concepto concreto.

## Alcance (v1)

- Cola de repaso basada en reglas simples y explicables: tiempo desde el último visto/estudiado, valoraciones "no lo sabía" recientes en flashcards, y estado manual "necesita repaso" de `004`.
- Cada elemento de la cola indica su motivo.
- Acceso directo desde la cola al contenido y a las flashcards del concepto.

## Fuera de alcance

- Algoritmo de repetición espaciada (SM-2 o similar) — evolución posterior, cuando haya datos suficientes.
- Integración con resultados de tests — llega con la etapa de evaluación (`012-errores-y-repaso`).

## Criterios de aceptación

- [ ] Existe una vista "Qué repasar hoy" con una lista priorizada de conceptos.
- [ ] Cada recomendación indica el motivo concreto.
- [ ] El usuario puede ir directo del listado a estudiar/repasar ese concepto.
- [ ] Repasar un concepto desde la cola actualiza su prioridad (sale de la cola o baja de prioridad).

## Preguntas abiertas

- Fórmula exacta de priorización v1 — debe mantenerse simple y explicable antes de complicarse; se decide en `design.md` cuando se aborde esta spec.
