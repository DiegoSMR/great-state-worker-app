# Requirements: Dashboard

Fase: 1 — Requirements. Estado: borrador.
Última actualización: 2026-09-14

## Resumen

Pantalla inicial que responde qué hacer ahora, combinando progreso, repaso pendiente y estado general, con cada bloque conduciendo a una acción directa.

## Requisito 1: Vista inicial accionable

**Historia:** Como usuario, quiero que al abrir la app se me muestre qué hacer ahora, no una lista de menús.

**Criterios de aceptación:**
1. CUANDO el usuario entra en la aplicación ENTONCES el sistema DEBERÁ mostrar el dashboard como pantalla inicial, con al menos: acceso a "continuar estudiando", acceso a "qué repasar hoy" y progreso resumido de la oposición activa.
2. CUANDO el usuario selecciona un elemento del dashboard ENTONCES el sistema DEBERÁ llevarlo directamente a la acción correspondiente, no a un listado intermedio innecesario.

## Requisito 2: Estado inicial sin datos

**Historia:** Como usuario nuevo, quiero que el dashboard tenga sentido aunque todavía no haya estudiado nada.

**Criterios de aceptación:**
1. CUANDO el usuario no tiene progreso registrado ENTONCES el sistema DEBERÁ mostrar un estado inicial que invite a empezar a estudiar, en vez de bloques vacíos sin contexto.
2. CUANDO el usuario tiene varias oposiciones en preparación ENTONCES el sistema DEBERÁ dejar claro para cuál se muestra el resumen de progreso, con opción de cambiarla.

## Fuera de alcance

- Estadísticas avanzadas.
- Motor de recomendaciones explicables.
