# Requirements: Repaso Inteligente

Fase: 1 — Requirements. Estado: borrador.
Última actualización: 2026-09-14

## Resumen

Combinar progreso (`004`) y resultados de flashcards (`005`) en una cola de repaso priorizada y explicable, sin introducir todavía repetición espaciada real.

## Requisito 1: Cola de repaso priorizada y explicable

**Historia:** Como usuario, quiero una lista de qué repasar hoy con el motivo de cada recomendación, para confiar en ella y entenderla.

**Criterios de aceptación:**
1. CUANDO el usuario abre "Qué repasar hoy" ENTONCES el sistema DEBERÁ mostrar una lista de conceptos ordenada por prioridad de repaso.
2. CUANDO se muestra un concepto en la cola ENTONCES el sistema DEBERÁ mostrar junto a él el motivo concreto de la recomendación (tiempo desde el último repaso, fallos recientes en flashcards, o estado "necesita repaso" marcado manualmente en `004`).
3. CUANDO no hay conceptos que necesiten repaso ENTONCES el sistema DEBERÁ mostrar un estado vacío claro, no una lista vacía sin contexto.

## Requisito 2: Acción directa desde la recomendación

**Historia:** Como usuario, quiero pasar de ver la recomendación a repasar el concepto en un clic.

**Criterios de aceptación:**
1. CUANDO el usuario selecciona un concepto de la cola ENTONCES el sistema DEBERÁ ofrecer acceso directo tanto al contenido del concepto como a sus flashcards, si existen.
2. CUANDO el usuario repasa un concepto desde la cola ENTONCES el sistema DEBERÁ actualizar su prioridad de repaso en consecuencia.

## Fuera de alcance

- Repetición espaciada real (algoritmo tipo SM-2).
- Integración con resultados de tests.
