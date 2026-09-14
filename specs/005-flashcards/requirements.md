# Requirements: Flashcards

Fase: 1 — Requirements. Estado: borrador.
Última actualización: 2026-09-14

## Resumen

Ofrecer recuperación activa sobre el contenido ya estudiado mediante flashcards asociadas a conceptos, con valoración simple del recuerdo que alimentará el repaso inteligente (`006`).

## Requisito 1: Flashcards asociadas a un concepto

**Historia:** Como usuario, quiero ver las flashcards de un concepto, para practicar recuperación activa sobre lo que ya he leído.

**Criterios de aceptación:**
1. CUANDO un concepto tiene flashcards asociadas ENTONCES el sistema DEBERÁ mostrar un acceso a "Practicar con flashcards" desde la vista del concepto.
2. CUANDO un concepto no tiene flashcards todavía ENTONCES el sistema DEBERÁ mostrarlo con un estado claro de "sin flashcards" en vez de ocultar el acceso o mostrar un error.
3. CUANDO se muestra una flashcard ENTONCES el sistema DEBERÁ indicar a qué concepto pertenece y permitir volver a la vista de ese concepto.

## Requisito 2: Responder antes de revelar

**Historia:** Como usuario, quiero intentar recordar la respuesta antes de verla, para que la práctica sea recuperación activa y no relectura.

**Criterios de aceptación:**
1. CUANDO se muestra una flashcard ENTONCES el sistema DEBERÁ ocultar la respuesta por defecto y mostrar solo la pregunta/enunciado.
2. CUANDO el usuario decide revelar la respuesta ENTONCES el sistema DEBERÁ mostrarla junto con una forma de valorar el recuerdo ("lo sabía" / "no lo sabía").
3. CUANDO el usuario valora la tarjeta ENTONCES el sistema DEBERÁ guardar esa valoración asociada a usuario+tarjeta con fecha, y avanzar a la siguiente tarjeta de la sesión.

## Requisito 3: Sesión de repaso con varias tarjetas

**Historia:** Como usuario, quiero repasar varias flashcards seguidas de un tema/oposición, para aprovechar bien una sesión de estudio.

**Criterios de aceptación:**
1. CUANDO el usuario inicia una sesión de repaso desde una oposición o tema ENTONCES el sistema DEBERÁ presentar las flashcards de esos conceptos en secuencia, una a la vez.
2. CUANDO el usuario termina todas las tarjetas de la sesión ENTONCES el sistema DEBERÁ mostrar un resumen simple (cuántas sabía / cuántas no).
3. CUANDO el usuario abandona la sesión antes de terminar ENTONCES el sistema DEBERÁ conservar las valoraciones ya hechas hasta ese punto, sin perder el progreso parcial.

## Fuera de alcance

- Repetición espaciada.
- Generación automática de flashcards por IA sin revisión.
- Tipos avanzados de tarjeta (completar hueco, verdadero/falso).
- Selección algorítmica de qué tarjetas repasar.
