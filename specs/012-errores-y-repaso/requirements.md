# Requirements: Errores y Repaso

Fase: 1 — Requirements. Estado: borrador.
Última actualización: 2026-09-14

## Resumen

Vincular los fallos en preguntas a los conceptos relacionados, detectar debilidades y cerrar el ciclo con comprobación de mejora tras el repaso.

## Requisito 1: Vincular fallos a conceptos y detectar debilidad

**Historia:** Como usuario, quiero que mis fallos en preguntas se traduzcan en una señal de qué concepto necesito repasar.

**Criterios de aceptación:**
1. CUANDO el usuario falla una pregunta ENTONCES el sistema DEBERÁ registrar el fallo asociado al concepto relacionado de esa pregunta.
2. CUANDO un concepto acumula un número mínimo de fallos recientes ENTONCES el sistema DEBERÁ marcarlo como "debilidad detectada" y añadirlo a la cola de repaso de `006-repaso-inteligente` con ese motivo explícito.

## Requisito 2: Comprobar mejora tras repasar

**Historia:** Como usuario, quiero saber si repasar un concepto que fallé realmente mejoró mi resultado.

**Criterios de aceptación:**
1. CUANDO el usuario repasa un concepto marcado como debilidad y después vuelve a practicar preguntas de ese concepto ENTONCES el sistema DEBERÁ permitir comparar el rendimiento antes y después del repaso.
2. CUANDO el rendimiento mejora tras el repaso ENTONCES el sistema DEBERÁ reflejarlo bajando la prioridad de ese concepto en la cola de repaso.

## Fuera de alcance

- Detección de patrones complejos entre conceptos relacionados.
