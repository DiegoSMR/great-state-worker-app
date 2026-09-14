# Arquitectura

Documento vivo. Recoge la arquitectura técnica recomendada para la versión definitiva de la app (no el esqueleto estático de prueba), y por qué se ha elegido así.

Última actualización: 2026-09-14

## Resumen

Una única aplicación Next.js (TypeScript) desplegada en Vercel, sin backend separado ni microservicios. Base de datos Postgres serverless en Neon. El contenido del temario se mantiene como datos versionados en el repo (`content/temario.yaml`), separado del estado de usuario, que vive en base de datos.

## Por qué esta arquitectura

- **Un solo proyecto, no frontend+backend separados.** Para un proyecto de un solo desarrollador y (de momento) un solo usuario, mantener dos servicios desplegados por separado añade complejidad de despliegue y de CORS/autenticación entre ellos sin ningún beneficio real. Next.js cubre páginas (React) y API (rutas de API o Server Actions) en el mismo proyecto.
- **Vercel** porque ya es donde se iba a desplegar el esqueleto estático — Next.js es la opción que mejor encaja ahí sin configuración adicional.
- **Postgres (Neon) y no SQLite**: Vercel es serverless, sin disco persistente entre invocaciones — SQLite no sirve para el estado de usuario. Neon da Postgres serverless con capa gratuita más que suficiente para un solo usuario, e integra de forma nativa con Vercel.
- **TypeScript** porque el dominio (oposiciones, conceptos, temario, progreso) tiene bastante estructura relacional y el tipado evita desajustes entre los datos y la UI.
- **Sin autenticación real todavía**: la tabla `usuarios` existe desde ya, pero con una sola fila fija. Añadir login más adelante (NextAuth/Auth.js u otro) no debería requerir rediseñar el esquema, solo activar autenticación real sobre `usuario_id`.
- **Sin PWA/offline, sin app nativa, sin backend separado**: decisiones ya tomadas en `CONTEXT.md`, coherentes con mantener el alcance manejable para un proyecto personal a largo plazo.

## Separación contenido vs. estado de usuario

Esta es la decisión de diseño más importante:

- **Contenido** (`content/temario.yaml`: oposiciones, conceptos, tabla de relación oposición↔concepto) — versionado en git, editado entre Claude y Diego, **no vive en base de datos**. Se lee en el servidor (Next.js puede importar el YAML directamente en un Server Component) y se sirve como props a la UI.
- **Estado de usuario** (progreso, repaso de flashcards, intentos de test, planificador) — vive en Postgres, referenciando los `concepto_id` del YAML por string, sin necesidad de que el contenido esté duplicado en una tabla de base de datos.

Esto evita tener que sincronizar una tabla de base de datos cada vez que se amplía o corrige el temario, y mantiene el contenido reproducible solo con `git pull`.

**Excepción: las preguntas de test.** A diferencia del temario, el banco de preguntas si conviene que viva en base de datos (`pregunta`), porque es contenido que va a crecer y editarse con frecuencia — tiene un ciclo de vida distinto al catálogo de temario, que es relativamente estable.

## Modelo de datos (borrador)

```
usuarios
  id, nombre                                   -- una sola fila fija en v1

progreso_concepto
  usuario_id, concepto_id, estado, actualizado_en
                                                 -- estado: no_estudiado | en_progreso | dominado
                                                 -- concepto_id referencia el id del YAML, no una FK real

flashcard_review
  usuario_id, concepto_id, ease_factor, intervalo, proxima_revision
                                                 -- repetición espaciada estilo SM-2 (Anki)

plan_estudio
  usuario_id, concepto_id, fecha_objetivo, estado

pregunta
  id, concepto_id, enunciado, opciones, respuesta_correcta, explicacion

intento_test
  usuario_id, pregunta_id, respuesta, correcto, fecha
```

## Stack recomendado

| Capa | Elección | Alternativa considerada |
|---|---|---|
| Framework | Next.js (App Router) + TypeScript | SPA React/Vite + API Node aparte — descartado por complejidad de dos despliegues |
| Hosting | Vercel | — (ya decidido antes, para el esqueleto estático) |
| Base de datos | Postgres en Neon | Supabase (válida alternativa, más funciones incluidas de las que hacen falta ahora) |
| ORM | Drizzle | Prisma (alternativa razonable, mejor tooling visual con Prisma Studio, algo más pesado en frío en serverless) |
| Autenticación | Ninguna todavía; tabla `usuarios` preparada | NextAuth/Auth.js cuando haga falta multiusuario |
| Contenido del temario | `content/temario.yaml`, versionado en git | Migrar a base de datos — no descartado a futuro si crece mucho |
| Offline / PWA | No | — |

## Camino de migración desde el esqueleto estático

El esqueleto estático (`index.html`, `temario.html`, `faq.html`, `assets/temario-data.js`) fue una prueba de concepto rápida para Vercel. Se sustituye por:

- `app/page.tsx` ← `index.html`
- `app/temario/page.tsx` ← `temario.html` (la lógica de filtrado en JS se traduce a un componente React con estado local)
- `app/faq/page.tsx` ← `faq.html`
- `content/temario.yaml` se reutiliza tal cual, sin cambios.

No se pierde trabajo: la estructura de datos y la lógica de filtrado ya están validadas.

## Pendiente

- Confirmar Drizzle vs. Prisma como ORM definitivo.
- Diseñar el esquema exacto de `pregunta` cuando se aborde la parte de tests/exámenes de oposición (deliberadamente pospuesto — ver `CONTEXT.md` y `specs/002-seccion-pruebas/`).

## Decidido: contenido de las lecciones

El contenido de estudio por concepto vive en `content/estudio/<concepto-id>.md` (markdown versionado en git, un fichero por concepto), no en base de datos — mismo criterio que `content/temario.yaml`. Detalle y alternativas consideradas en `specs/001-seccion-estudio/design.md`.
