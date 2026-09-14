# Requirements: Planificador

Fase: 1 — Requirements. Estado: borrador.
Última actualización: 2026-09-14

## Resumen

Convertir un objetivo de preparación en un calendario de sesiones concretas, capaz de reorganizarse cuando el usuario no cumple lo previsto.

## Requisito 1: Objetivo y calendario de sesiones previstas

**Historia:** Como usuario, quiero fijar un objetivo de preparación y ver un calendario de sesiones que lo concreten.

**Criterios de aceptación:**
1. CUANDO el usuario define un objetivo (oposición + fecha límite orientativa + disponibilidad semanal aproximada) ENTONCES el sistema DEBERÁ generar un calendario inicial de sesiones previstas.
2. CUANDO el usuario consulta el calendario ENTONCES el sistema DEBERÁ distinguir visualmente sesiones previstas, realizadas y pendientes.

## Requisito 2: Reorganización cuando no se cumple el plan

**Historia:** Como usuario, quiero que si no estudio un día previsto, el plan se adapte en vez de acumular incumplimientos.

**Criterios de aceptación:**
1. CUANDO una sesión prevista no se realiza en su fecha ENTONCES el sistema DEBERÁ ofrecer reorganizarla (moverla, dividirla o descartarla explícitamente) en vez de dejarla marcada solo como "incumplida".
2. CUANDO el usuario reorganiza el plan ENTONCES el sistema DEBERÁ mantener coherente el objetivo original, sin perder de vista la fecha límite.

## Fuera de alcance

- Reprogramación automática basada en rendimiento.
- Vínculo con fechas reales de convocatoria.
