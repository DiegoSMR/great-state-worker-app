# Contexto y requisitos — Great State Worker App

Documento vivo. Se actualiza en cada sesión de planificación con Claude a medida que se toman decisiones. No es una spec cerrada.

Última actualización: 2026-09-14

## Visión del producto

App de estudio para preparar oposiciones, de uso personal (Diego), pensada sobre todo para usarse en tablet.

## Decidido

- Funcionalidades núcleo: tests, flashcards, planificador con seguimiento de progreso, temario integrado en la app (no como PDFs/documentos sueltos).
- El temario se organiza por tema, y cada tema se etiqueta con qué oposición(es) lo piden — para poder filtrar/estudiar por oposición (Auxiliar Administrativo, TAI, etc.) o de forma transversal.
- Sin prisa de plazos — no es un "MVP en 2 semanas", es un proyecto paralelo a largo plazo.
- **Usuarios (v1): single-user**, solo para Diego. Sin login/gestión de cuentas en la v1. Pero la arquitectura se diseña pensando en soportar multiusuario más adelante (no hardcodear supuestos de "un único usuario" en el modelo de datos ni en la API — por ejemplo, prever ya un `user_id` aunque de momento sea siempre el mismo).
- **Offline / PWA: no hace falta.** La app puede asumir que siempre hay conexión normal.
- **Orden de trabajo: primero la app como "máquina de aprender" (temario + flashcards), después la parte de exámenes/tests.** El diseño de las preguntas de test se deja para más adelante — no bloquea el trabajo actual.
- **El temario NO se modela como un documento por oposición ni por tema — se modela como datos filtrables.** Hay un catálogo de "conceptos" (unidades reales de contenido, escritas una sola vez) y una tabla de relación que dice, para cada oposición, qué número oficial tiene cada concepto y en qué bloque cae. El temario de una oposición es el resultado de filtrar esa tabla por oposición; el contenido de un tema transversal se obtiene filtrando por concepto. Ver [`TEMARIOS.md`](./TEMARIOS.md) y [`content/temario.yaml`](./content/temario.yaml).
- Se ha recopilado un primer volcado de este modelo con las 7 oposiciones objetivo (~67 conceptos, ~190 filas de relación). Quedan pendientes de verificar: el temario detallado de SALUD Aragón (temas 11-47) y las materias generales de Ejecutivos de Informática DGA (temas 1-15).
- **Arquitectura definitiva: Next.js (TypeScript) en Vercel, sin backend separado; Postgres en Neon vía Drizzle para el estado de usuario; el temario se queda como datos versionados en `content/temario.yaml` (no en base de datos).** Detalle completo, modelo de datos y alternativas consideradas en [`ARCHITECTURE.md`](./ARCHITECTURE.md).

## Abierto / por decidir

- Confirmar Drizzle vs. Prisma como ORM definitivo (recomendado: Drizzle, ver `ARCHITECTURE.md`).
- Diseño pensado para multiusuario futuro: ¿qué mínimo hay que prever ahora en el modelo de datos/API para no tener que reescribir todo cuando llegue?

## Fuera de alcance (de momento)

- Multiusuario real (login, cuentas separadas) — queda para el futuro, pero se tiene en cuenta en el diseño.
- Soporte offline / PWA.
- Diseño de preguntas de test / exámenes.

## Historial de decisiones

- 2026-09-13: Funcionalidades núcleo confirmadas (tests, flashcards, planificador, temario integrado y etiquetado por oposición). Arranque del repo y de este documento de contexto.
- 2026-09-13: v1 será single-user (sin login), pero con la arquitectura pensada para poder añadir multiusuario en el futuro sin reescribir todo. No se necesita soporte offline/PWA — la app puede asumir conexión normal. Stack técnico se deja para una sesión de arquitectura aparte.
- 2026-09-14: Se prioriza construir primero la parte de aprendizaje (temario navegable + flashcards) y se deja para después el diseño de tests/exámenes. Se investiga y recopila el temario real de las 7 oposiciones objetivo.
- 2026-09-14: El temario se modela como datos filtrables (catálogo de conceptos + tabla de relación concepto↔oposición), no como documentos separados por oposición o por tema. Primer volcado de datos en `content/temario.yaml`.
- 2026-09-14: Esqueleto estático de prueba (`index.html`, `temario.html`, `faq.html`) desplegable en Vercel, con filtrado real en el navegador sobre los datos del temario.
- 2026-09-14: Arquitectura definitiva recomendada y documentada en `ARCHITECTURE.md`: Next.js + TypeScript en Vercel, Postgres (Neon) vía Drizzle solo para estado de usuario, temario como datos versionados fuera de la base de datos.
- 2026-09-14: Se adopta Spec-Driven Development como forma de trabajar (`CONSTITUTION.md` + `specs/NNN-feature/spec.md → plan.md → tasks.md`). El esqueleto estático y el primer volcado de `content/temario.yaml` pasan a ser material de referencia, no la base directa de la implementación. Alcance de la v1 reducido a Administración (Ayuntamiento de Zaragoza, Diputación de Zaragoza, DGA, AGE) — el bloque específico de SALUD Aragón y el grupo de Informática quedan fuera hasta una fase posterior. Primera spec real: `specs/001-seccion-estudio/` (material de estudio navegable por oposición o por tema, con sistema de bookmarks). `specs/002-seccion-pruebas/` queda como stub deliberadamente diferido.
- 2026-09-14: `requirements.md` de `specs/001-seccion-estudio/` aprobado. Se resuelven sus dos preguntas abiertas: el contenido real por concepto se redacta manualmente (Diego + Claude) a partir de fuentes primarias, sin pipeline de generación asistida por ahora; los bookmarks marcan el tema completo, no sub-secciones. Se redacta `design.md`: el contenido de estudio vive en `content/estudio/<concepto-id>.md` (markdown versionado en git, no en base de datos), resolviendo el pendiente correspondiente de `ARCHITECTURE.md`. Recordatorio explícito para `specs/002-seccion-pruebas/`: "pruebas" ahí significa exámenes/tests de oposición (modelos de examen, preguntas tipo test), no pruebas automatizadas de software — ya reflejado en esa spec, se deja anotado para que no se confunda en sesiones futuras.
