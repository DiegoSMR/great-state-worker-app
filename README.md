# Great State Worker App

App de estudio personal para preparar oposiciones (funcionariado público en España), pensada para maximizar la probabilidad real de conseguir plaza en Aragón (o en un destino con muy buena conexión con Zaragoza, tipo Madrid/Barcelona vía AVE).

## Estado actual

En fase de planificación, siguiendo Spec-Driven Development — todavía sin código de la app real. Empieza por [`CONSTITUTION.md`](./CONSTITUTION.md) (principios del proyecto y cómo se trabaja aquí), y luego [`specs/`](./specs/) (una carpeta por feature: `requirements.md` → `design.md` → `tasks.md`, cada fase con aprobación explícita antes de avanzar). `CONTEXT.md`, `TEMARIOS.md` y `ARCHITECTURE.md` se mantienen como registro histórico de decisiones y como investigación de referencia (temario real por oposición), pero la fuente de verdad vigente es `CONSTITUTION.md` + `specs/`.

> **Nota:** `index.html`, `temario.html`, `faq.html` y `assets/` son una prueba de concepto desplegable en Vercel hecha antes de adoptar Spec-Driven Development. Quedan como referencia, no como base de la implementación real — se pueden eliminar cuando convenga.

## Visión funcional

- **Aprendizaje primero**: temario navegable integrado en la app (no PDFs sueltos) y flashcards. Los tests/exámenes se diseñan más adelante.
- **Planificador** con seguimiento de progreso.
- El temario se organiza por **tema/concepto**, no por oposición — cada concepto se etiqueta con qué oposición(es) lo piden, para no duplicar contenido entre procesos que comparten materia.

## Oposiciones objetivo (v1)

**Administración (C2)** — temario de Auxiliar Administrativo, común a varios procesos:
- Ayuntamiento de Zaragoza
- Diputación de Zaragoza
- Gobierno de Aragón (DGA)
- Servicio Aragonés de Salud
- Auxiliar Administrativo del Estado (AGE)

**Informática (C1)** — vía paralela, temario propio, mejor sueldo:
- Técnico Auxiliar de Informática del Estado (TAI)
- Ejecutivos de Informática — Gobierno de Aragón

## Trabajando con Claude en este repo

Este proyecto se planifica y desarrolla en colaboración con Claude (Cowork / Claude Code). `CONTEXT.md` es el documento vivo de requisitos — se actualiza en cada sesión de planificación a medida que se toman decisiones.

## Stack

Por definir — ver "Abierto / por decidir" en `CONTEXT.md`.

## Estructura del repo

- `CONTEXT.md` — requisitos y decisiones de producto, documento vivo.
- `TEMARIOS.md` — cómo está modelado el temario (metodología, fuentes, pendientes).
- `content/temario.yaml` — datos: oposiciones, conceptos de contenido y la tabla de relación entre ambos.
