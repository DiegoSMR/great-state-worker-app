# Tasks: Sección de Estudio

Fase: 3 — Tasks. Estado: borrador, pendiente de confirmación de Diego.
Última actualización: 2026-09-14

Nota: como es la primera spec que se implementa, las tareas 1-3 sientan también la base técnica del proyecto (`ARCHITECTURE.md`), no solo esta feature — el esqueleto estático actual (`index.html`, `temario.html`, `faq.html`, `study.html`) queda como referencia, no se sigue construyendo sobre él.

## Base técnica del proyecto

- [x] 1. Inicializar el proyecto Next.js (App Router + TypeScript) en la raíz del repo.
  - Detalle: `create-next-app` con TS y App Router. Verificar que `npm run dev` arranca con una página inicial. El esqueleto estático (`index.html`, `temario.html`, `faq.html`, `study.html`, `assets/`) se deja como referencia sin borrar todavía.
  - Satisface: base para todos los requisitos.
- [ ] 2. Configurar Postgres (Neon) + Drizzle ORM.
  - Detalle: instalar `drizzle-orm` + `drizzle-kit`, crear `db/schema.ts` con la tabla `usuarios` (una sola fila fija, ver `ARCHITECTURE.md`), variable de entorno `DATABASE_URL`, y comando de migración funcionando contra una base Neon real.
  - Satisface: base para Requisito 4.
- [x] 3. Loader de `content/temario.yaml` en el servidor.
  - Detalle: `lib/temario.ts` con funciones: temas de una oposición ordenados por numeración oficial, catálogo de conceptos sin duplicados, y filas de relación de un concepto concreto (qué oposiciones lo piden y con qué numeración). Cubrir con algún caso de prueba manual usando datos reales del YAML.
  - Satisface: base para Requisitos 1, 2 y 3.

## Requisito 1 — Navegación por oposición o por tema

- [ ] 4. Página `/estudio` con selector "por oposición" / "por tema".
  - Satisface: Requisito 1, criterio 1.
- [ ] 5. Página `/estudio/oposicion/[oposicionId]` — lista los temas de esa oposición en su numeración oficial, usando el loader de la tarea 3.
  - Satisface: Requisito 1, criterio 2.
- [ ] 6. Página `/estudio/tema` (listado transversal por concepto) — catálogo de conceptos sin repetir los compartidos entre oposiciones.
  - Satisface: Requisito 1, criterio 3.

## Requisito 2 — Contenido de estudio real por tema

- [ ] 7. Loader de contenido de un concepto.
  - Detalle: `lib/contenido.ts` lee `content/estudio/<concepto-id>.md`, parsea el frontmatter `fuentes:` y las tres secciones (`## Texto oficial`, `## Material adaptado`, `## Resumen` con `### Esquema` y `### Resumen extenso`). Si el fichero no existe, debe devolver un estado "sin contenido" explícito, nunca lanzar un error sin capturar.
  - Satisface: Requisito 2, criterio 1 (estructura del dato) y criterio 3 (base del estado "pendiente").
- [ ] 8. Página `/estudio/tema/[conceptoId]` — vista de un concepto con: título, oposiciones que lo piden con su numeración oficial, indicador de núcleo común (tarea 11), y las tres secciones de contenido claramente diferenciadas.
  - Satisface: Requisito 2, criterio 1.
- [ ] 9. Estado "contenido pendiente" en la vista de tema, para cuando el loader de la tarea 7 no encuentra fichero.
  - Detalle: mensaje explícito y visualmente distinto de un tema con contenido real — nunca una sección en blanco ni un error de render. Ver criterio de diseño del agente `disenador-maquetador`.
  - Satisface: Requisito 2, criterio 3.
- [ ] 10. Redactar 2-3 conceptos reales de núcleo común en `content/estudio/` con los agentes `scrapeador-fuentes-primarias` + `preparador-opos`, para validar el formato de extremo a extremo antes de cerrar la spec.
  - Detalle: elegir conceptos que compartan varias de las oposiciones en alcance (Ayuntamiento de Zaragoza, Diputación de Zaragoza, DGA, AGE) — mayor apalancamiento. Confirmar manualmente que ninguna de las tres secciones reproduce texto de editoriales de oposiciones.
  - Satisface: Requisito 2, criterio 1 y criterio 2 (verificación práctica del principio 3 de `CONSTITUTION.md`).

## Requisito 3 — Identificación del núcleo común

- [ ] 11. Helper `esNucleoComun(conceptoId)` — true si 2 o más oposiciones en alcance piden ese concepto (calculado sobre el resultado de la tarea 3, no almacenado).
  - Satisface: Requisito 3, criterio 1.
- [ ] 12. Indicador visual de núcleo común (con qué oposiciones se comparte) en la vista de tema y en los listados de las tareas 5 y 6.
  - Satisface: Requisito 3, criterio 1.

## Requisito 4 — Sistema de bookmarks

- [ ] 13. Tabla `bookmark(usuario_id, concepto_id, creado_en)` en `db/schema.ts`, clave primaria compuesta, + migración aplicada.
  - Satisface: Requisito 4 (modelo de datos).
- [ ] 14. Server Action `toggleBookmark(conceptoId)` — upsert si no existe, delete si ya existe.
  - Satisface: Requisito 4, criterio 1.
- [ ] 15. Botón de marcar/desmarcar en `/estudio/tema/[conceptoId]`, conectado a la tarea 14, sin recargar la página.
  - Satisface: Requisito 4, criterio 1.
- [ ] 16. Página `/estudio/marcadores` — lista todos los bookmarks del usuario con acceso directo a cada tema.
  - Satisface: Requisito 4, criterio 2.
- [ ] 17. Desmarcar un tema desde `/estudio/marcadores` lo quita de la lista inmediatamente.
  - Satisface: Requisito 4, criterio 3.

## Cierre de la spec

- [ ] 18. Verificación final (Fase 5 de `CONSTITUTION.md`): repasar `requirements.md` criterio a criterio con evidencia concreta de que se cumple, antes de dar la spec por cerrada.
  - Satisface: verificación de todos los requisitos.
