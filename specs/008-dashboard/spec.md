# Spec: Dashboard

Estado: borrador
Última actualización: 2026-09-14

## Resumen

Pantalla de inicio que ofrece una visión inmediata del estado de preparación: qué se estudió recientemente, qué queda pendiente, qué conviene repasar y cómo va el progreso — cada elemento debe conducir a una acción, no ser solo informativo.

## Historias de usuario

- Como usuario, quiero ver de un vistazo qué debería hacer hoy al abrir la app.
- Como usuario, quiero que cada elemento del dashboard me lleve directamente a la acción, no solo a un dato.

## Alcance (v1)

- Bloque "Continuar estudiando" (`004`).
- Bloque "Qué repasar hoy" (`006`).
- Progreso resumido de la oposición activa.

## Fuera de alcance

- Estadísticas avanzadas (`014-estadisticas`) — el dashboard reutiliza sus salidas cuando existan, no las reimplementa.
- Recomendaciones explicables complejas (`015-recomendaciones`) — igual, se integran cuando existan.

## Criterios de aceptación

- [ ] El dashboard es la pantalla de inicio tras entrar en la app.
- [ ] Cada bloque del dashboard lleva a una acción concreta.
- [ ] El dashboard funciona con datos parciales (usuario nuevo sin apenas progreso) sin verse roto o vacío sin explicación.

## Preguntas abiertas

- Cuántos bloques debe tener v1 como máximo, para no convertirse en "colección de gráficos sin utilidad" (principio explícito de `PRODUCT-VISION.md`).
