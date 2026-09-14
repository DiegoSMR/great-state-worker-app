# Requirements: Progreso de Estudio

Fase: 1 — Requirements. Estado: borrador.
Última actualización: 2026-09-14

## Resumen

Registrar qué ha visto y qué ha estudiado realmente el usuario, concepto a concepto, sin todavía estimar dominio ni introducir repetición espaciada. Es el dato base que alimentará flashcards (`005`), repaso inteligente (`006`), sesiones (`007`), dashboard (`008`) y planificador (`009`).

## Requisito 1: Registro automático de conceptos vistos

**Historia:** Como usuario, quiero que el sistema registre automáticamente qué conceptos he abierto, para no tener que llevar la cuenta manualmente.

**Criterios de aceptación:**
1. CUANDO el usuario abre la vista de un concepto con contenido real ENTONCES el sistema DEBERÁ registrar una marca de "visto" asociada a ese usuario y ese concepto, con fecha.
2. CUANDO el usuario vuelve a abrir un concepto ya visto ENTONCES el sistema DEBERÁ actualizar la fecha de "última vez visto" sin duplicar el registro.
3. CUANDO el usuario abre un concepto marcado como "contenido pendiente" (ver `001-seccion-estudio`) ENTONCES el sistema NO DEBERÁ registrarlo como visto, porque no hay contenido real que estudiar.

## Requisito 2: Marcado manual de estudiado / necesita repaso

**Historia:** Como usuario, quiero marcar explícitamente que he estudiado un concepto o que necesito repasarlo, para que el estado refleje mi propia valoración, no solo si lo abrí.

**Criterios de aceptación:**
1. CUANDO el usuario está viendo un concepto ENTONCES el sistema DEBERÁ permitir marcarlo como "estudiado" o como "necesita repaso" sin salir de la vista.
2. CUANDO el usuario cambia el estado de un concepto ENTONCES el sistema DEBERÁ sobrescribir el estado anterior — un concepto tiene un único estado de progreso a la vez, no estados acumulados.
3. CUANDO el usuario no ha marcado nunca un concepto ENTONCES el sistema DEBERÁ tratarlo como "no estudiado" aunque tenga marca de "visto".

## Requisito 3: Vista de progreso por oposición/tema y continuar estudiando

**Historia:** Como usuario, quiero ver de un vistazo qué conceptos tengo pendientes dentro de una oposición o tema, y retomar el estudio donde lo dejé.

**Criterios de aceptación:**
1. CUANDO el usuario navega por oposición o por tema ENTONCES el sistema DEBERÁ mostrar, junto a cada concepto, su estado de progreso (no estudiado / visto / estudiado / necesita repaso) con un indicador visual distinto para cada uno.
2. CUANDO el usuario tiene al menos un concepto visto ENTONCES el sistema DEBERÁ ofrecer un acceso "Continuar estudiando" que lleva directamente al último concepto abierto.
3. CUANDO el usuario no ha estudiado nada todavía ENTONCES el sistema NO DEBERÁ mostrar el acceso "Continuar estudiando" — debe mostrar en su lugar una invitación clara a empezar.

## Fuera de alcance

- Estimación automática de dominio.
- Repetición espaciada / priorización algorítmica de repaso.
- Cronometraje de sesiones de estudio.
- Estadísticas agregadas o históricas.
