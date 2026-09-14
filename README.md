# Great State Worker App

App de estudio personal para preparar oposiciones (funcionariado público en España), pensada para maximizar la probabilidad real de conseguir plaza en Aragón (o en un destino con muy buena conexión con Zaragoza, tipo Madrid/Barcelona vía AVE).

## Estado actual

En fase de planificación — todavía sin código. [`CONTEXT.md`](./CONTEXT.md) recoge los requisitos según se van definiendo, y [`TEMARIOS.md`](./TEMARIOS.md) explica cómo está modelado el contenido del temario (datos filtrables en [`content/temario.yaml`](./content/temario.yaml), no documentos separados por oposición).

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
