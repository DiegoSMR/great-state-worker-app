# Spec: Errores y Repaso

Estado: borrador
Última actualización: 2026-09-14

## Resumen

Convierte los errores en conocimiento: cierra el ciclo pregunta fallada → concepto relacionado → debilidad detectada → repaso recomendado → nueva pregunta → comprobar mejora. Puede ser una de las funcionalidades con más valor de toda la aplicación.

## Historias de usuario

- Como usuario, quiero que un fallo repetido en un área se traduzca en una recomendación de repaso concreta.
- Como usuario, quiero comprobar si he mejorado tras repasar lo que fallé.

## Alcance (v1)

- Detección simple de patrones (ej. 2+ fallos en el mismo concepto en una ventana de tiempo) que alimenta la cola de repaso de `006-repaso-inteligente`.
- Ciclo cerrado manual: el usuario decide repasar y luego volver a practicar; sin automatización total todavía.

## Fuera de alcance

- Detección de patrones complejos entre conceptos relacionados — evolución futura, junto a `015-recomendaciones`.

## Criterios de aceptación

- [ ] Un fallo en una pregunta queda vinculado al concepto relacionado.
- [ ] Cuando un concepto acumula varios fallos recientes, aparece en la cola de repaso con ese motivo.
- [ ] El usuario puede ver si ha mejorado comparando fallos antes/después de repasar un concepto.

## Preguntas abiertas

- Umbral exacto de "varios fallos recientes" para v1 — mantenerlo simple y ajustable, no un algoritmo elaborado desde el principio.
