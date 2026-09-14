# Spec: Flashcards

Estado: borrador
Última actualización: 2026-09-14

## Resumen

Convierte el contenido ya estudiado en recuperación activa mediante flashcards asociadas a conceptos concretos del temario. Es una de las funcionalidades núcleo ya identificadas en la visión de producto: leer no es lo mismo que recordar.

## Historias de usuario

- Como usuario, quiero repasar un concepto con flashcards en vez de releer el texto, para practicar recuperación activa.
- Como usuario, quiero intentar responder antes de ver la solución, para forzar el recuerdo real.
- Como usuario, quiero valorar qué tan bien he recordado cada tarjeta, para que ese dato se use más adelante en repaso inteligente.
- Como usuario, quiero hacer una sesión de repaso con varias tarjetas seguidas de un tema u oposición, no una a una desde cero cada vez.

## Alcance (v1)

- Flashcards manuales asociadas a un concepto (tipo pregunta→respuesta como mínimo; concepto→definición cuando aplique).
- Vista de tarjeta: pregunta primero, respuesta oculta hasta que el usuario decide revelarla.
- Valoración binaria tras revelar ("lo sabía" / "no lo sabía"), sin repetición espaciada todavía.
- Sesión de repaso: seleccionar tarjetas de un tema/oposición y recorrerlas en secuencia, con resumen final.
- Última valoración por tarjeta guardada y consultable.

## Fuera de alcance

- Repetición espaciada (algoritmo tipo SM-2) — evolución de `006-repaso-inteligente`.
- Generación automática de flashcards por IA sin revisión — mencionada en la visión de producto como uso interno futuro, no v1.
- Tipos avanzados de tarjeta (completar hueco, verdadero/falso) — solo si aportan valor después.
- Selección algorítmica de qué tarjetas repasar — depende de progreso + resultados (`006`).

## Criterios de aceptación

- [ ] El usuario puede ver las flashcards asociadas a un concepto concreto.
- [ ] La respuesta permanece oculta hasta que el usuario decide revelarla.
- [ ] Tras revelar, el usuario puede valorar si lo sabía o no.
- [ ] El usuario puede iniciar una sesión de repaso con varias tarjetas de un tema/oposición y ver un resumen al terminar.
- [ ] La última valoración de cada tarjeta queda guardada y es consultable.

## Preguntas abiertas

- Quién crea las flashcards en v1: ¿contenido editorial (Diego+Claude, igual que `001`) o un editor para que el usuario final las cree? — bloquea `design.md`, resuelto ahí a favor de contenido editorial (ver decisión en `design.md`).
