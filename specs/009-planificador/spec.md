# Spec: Planificador

Estado: borrador
Última actualización: 2026-09-14

## Resumen

Transforma objetivos de preparación en un plan ejecutable de sesiones, y se adapta cuando la realidad no coincide con lo previsto — no debería limitarse a marcar como "incumplido" lo que no se estudió.

## Historias de usuario

- Como usuario, quiero fijar un objetivo (ej. "preparar esta oposición para tal fecha") y que se traduzca en un plan de sesiones.
- Como usuario, quiero que si no estudio un día, el plan se reorganice en vez de marcarlo simplemente como incumplido.

## Alcance (v1)

- Objetivo básico por oposición (fecha límite orientativa, disponibilidad semanal aproximada).
- Calendario simple con sesiones previstas, vinculado a `007-sesiones-estudio`.
- Reprogramación manual cuando se falla un día.

## Fuera de alcance

- Reprogramación automática basada en rendimiento — evolución posterior, junto a `015-recomendaciones`.
- Vínculo con fechas reales de convocatoria — `016-convocatorias` / `017-preparacion-convocatoria`.

## Criterios de aceptación

- [ ] El usuario puede definir un objetivo simple (oposición + fecha límite orientativa).
- [ ] El sistema propone sesiones de estudio en un calendario a partir del objetivo.
- [ ] Si una sesión prevista no se cumple, el usuario puede reorganizarla sin que el plan se rompa visualmente.

## Preguntas abiertas

- Cómo de automática debe ser la generación del plan en v1 (¿reglas simples tipo "N sesiones/semana", o algo más elaborado?) — pendiente de `design.md`.
