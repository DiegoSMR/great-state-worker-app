# Design: Sección de Estudio

Fase: 2 — Design. Estado: aprobado.
Última actualización: 2026-09-14

## Visión general

La sección de Estudio se construye sobre la arquitectura ya definida en `ARCHITECTURE.md`: Next.js (App Router) + TypeScript en Vercel, con el catálogo de temario (`content/temario.yaml`) como datos versionados en git, y Postgres (Neon, vía Drizzle) reservado exclusivamente para estado de usuario. Esta spec añade dos piezas nuevas sobre esa base: (1) el contenido de estudio real por concepto, que hasta ahora no existía (solo el catálogo de qué hay que estudiar), y (2) la primera tabla de estado de usuario, `bookmark`.

## Decisiones clave

### Decisión: Almacenamiento del contenido de estudio — markdown versionado en git, no base de datos

- **Opción elegida:** un fichero markdown por concepto en `content/estudio/<concepto-id>.md`, con frontmatter mínimo (`fuentes:` lista de fuentes primarias usadas). El `concepto-id` coincide con el usado en `content/temario.yaml`, así que no hace falta ninguna FK real — se cruzan por string, igual que ya hace `progreso_concepto` en `ARCHITECTURE.md`.
- **Alternativas consideradas:** guardar el contenido en una tabla `contenido_concepto` en Postgres. Se descarta porque (a) el contenido se escribe manualmente entre Diego y Claude — un fichero markdown es más cómodo de editar y revisar en diff que una fila de base de datos; (b) mantiene la misma filosofía que ya justifica `content/temario.yaml`: contenido = datos versionados en git, reproducible con `git pull`, sin necesidad de migraciones para un cambio de texto; (c) resuelve el pendiente abierto en `ARCHITECTURE.md` ("Decidir si el contenido de las lecciones vive en `content/` o en base de datos") en la misma línea que el resto del temario.
- **Satisface:** Requisito 2.

### Decisión: Formato del contenido — tres secciones, la tercera con dos niveles de condensación

- **Opción elegida:** cada `.md` de `content/estudio/` tiene tres secciones fijas, en este orden:
  1. `## Texto oficial` — fragmento transcrito literal de la fuente primaria citada en el frontmatter `fuentes:`. Es la base verificable, no se toca ni se parafrasea.
  2. `## Material adaptado` — desarrollo del tema redactado desde cero por `preparador-opos` a partir del texto oficial: la explicación completa, organizada de forma pedagógica, pensada para la primera pasada de estudio de ese concepto (no es un resumen, es la base de estudio en sí).
  3. `## Resumen` — material de repaso, con dos partes dentro de la misma sección:
     - `### Esquema` — una ficha de aproximadamente una página, formato tabla/esquema condensado para repaso rápido. El formato concreto (tabla, lista jerárquica, mapa conceptual en texto, etc.) lo decide `preparador-opos` según qué se ajuste mejor al contenido de ese concepto — no hay un único formato de esquema forzado para todos los conceptos.
     - `### Resumen extenso` — un resumen en prosa, más largo que el esquema pero más corto que el material adaptado — el punto intermedio para repasar sin releer el desarrollo completo.

  Las cuatro piezas (texto oficial, material adaptado, esquema, resumen extenso) se guardan siempre en el mismo fichero, no en ficheros separados — mantiene el modelo simple (un fichero por concepto) decidido arriba. La UI que las distingue visualmente se deja para una iteración posterior de diseño (placeholder vale por ahora); lo que no se aplaza es que el dato estructurado ya diferencie las cuatro piezas desde el primer fichero.
- **Alternativas consideradas:**
  - Guardar solo el resumen, sin texto oficial transcrito ni material adaptado. Se descarta porque, si el resumen no queda bien trazado a su fuente exacta, es más fácil que se cuele una paráfrasis demasiado cercana a un manual de academia sin darse cuenta — tener el texto oficial al lado hace la fuente verificable en todo momento (principio 3 de `CONSTITUTION.md`).
  - Un único "resumen" sin separar esquema de resumen extenso. Se descarta porque sirven a momentos de estudio distintos (repaso rápido de última hora vs. repaso con algo más de tiempo) y mezclarlos obliga a elegir un formato de compromiso que no sirve bien a ninguno de los dos casos.
  - Ficheros separados por pieza (`<id>.oficial.md`, `<id>.adaptado.md`, etc.). Se descarta por ahora — más ficheros que gestionar sin un beneficio claro mientras todo se edita a mano; se puede revisar si el fichero único se vuelve incómodo de trabajar.
- **Satisface:** Requisito 2.

### Flujo de autoría de contenido (agentes)

El contenido de cada concepto se escribe con dos agentes especializados definidos en `.claude/agents/`: `scrapeador-fuentes-primarias` localiza y transcribe el texto oficial (nunca de academias — restricción dura del propio agente), y `preparador-opos` lo usa para redactar el resumen original y decide qué conceptos priorizar primero (núcleo común del grupo Administración). Ver también `investigador-convocatorias` (datos de convocatorias, no contenido de estudio) y `disenador-maquetador` (UI/maquetación) como agentes de apoyo al resto de la spec.

### Decisión: Navegación por oposición y por tema — dos rutas sobre el mismo dato filtrado

- **Opción elegida:** `/estudio` ofrece el selector de modo. `/estudio/oposicion/[oposicionId]` filtra `temario.yaml` por oposición y lista los temas en su numeración oficial. `/estudio/tema/[conceptoId]` es la vista de un concepto individual, accesible tanto navegando "por oposición" como "por tema" — no hay contenido duplicado entre ambos modos, solo dos caminos de navegación distintos hacia la misma vista de concepto.
- **Alternativas consideradas:** generar contenido o rutas distintas por oposición. Se descarta porque contradice el principio 4 de `CONSTITUTION.md` (el temario es un catálogo filtrable, no documentos separados).
- **Satisface:** Requisito 1.

### Decisión: Núcleo común — calculado, no almacenado

- **Opción elegida:** un concepto es "núcleo común" si aparece en la tabla de relación oposición↔concepto de `temario.yaml` para 2 o más de las oposiciones en alcance. Se calcula en build/server, no se guarda como campo aparte — evita que el dato se desincronice si cambia el alcance de oposiciones.
- **Alternativas consideradas:** marcar `nucleo_comun: true/false` a mano en el YAML por concepto. Se descarta porque es un dato derivado y guardarlo a mano invita a que quede desactualizado.
- **Satisface:** Requisito 3.

### Decisión: Bookmarks — tabla `bookmark` en Postgres, granularidad de tema completo

- **Opción elegida:** tabla nueva `bookmark(usuario_id, concepto_id, creado_en)`, clave primaria compuesta `(usuario_id, concepto_id)`. Marcar es un upsert, desmarcar es un delete. `concepto_id` referencia el id del YAML como string, sin FK real (mismo patrón que `progreso_concepto`). Con `usuarios` de una sola fila fija en v1, el modelo ya queda listo para multiusuario sin cambios de esquema (principio 6 de `CONSTITUTION.md`).
- **Alternativas consideradas:** guardar los bookmarks en `localStorage` del navegador. Se descarta porque no sobrevive a cambiar de dispositivo/navegador (la app está pensada sobre todo para tablet, pero debe ser consistente si Diego la abre desde otro sitio) y porque ya existe la pieza de Postgres para este tipo de estado.
- **Satisface:** Requisito 4.

## Componentes afectados

- `content/estudio/<concepto-id>.md` — **nuevo**. Contenido de estudio real, uno por concepto, se va rellenando de forma incremental (no hace falta tenerlos todos para empezar a construir la sección).
- `content/temario.yaml` — reutilizado tal cual, sin cambios de esquema.
- `db/schema.ts` (Drizzle) — **nuevo**: tabla `bookmark`.
- `app/estudio/page.tsx` — **nuevo**: selector "por oposición" / "por tema".
- `app/estudio/oposicion/[oposicionId]/page.tsx` — **nuevo**: listado de temas de una oposición.
- `app/estudio/tema/page.tsx` (listado transversal) y `app/estudio/tema/[conceptoId]/page.tsx` (vista de concepto) — **nuevo**.
- `app/estudio/marcadores/page.tsx` — **nuevo**: vista "Mis marcadores".
- Server Action `toggleBookmark(conceptoId)` — **nuevo**, en el mismo árbol de `app/estudio/`.

## Flujo de datos / interacción

1. El usuario entra en `/estudio` y elige modo de navegación.
2. Al abrir un tema (`/estudio/tema/[conceptoId]`), el Server Component: (a) lee `temario.yaml` para la metadata (título, oposiciones que lo piden con numeración oficial, si es núcleo común — calculado); (b) lee `content/estudio/[conceptoId].md` para el contenido; (c) consulta `bookmark` en Postgres filtrando por `usuario_id` fijo y `conceptoId` para saber si ya está marcado.
3. El botón de marcar/desmarcar invoca el Server Action `toggleBookmark`, que hace upsert o delete en `bookmark` y revalida la vista.
4. `/estudio/marcadores` consulta todos los `bookmark` del usuario, cruza cada `concepto_id` contra `temario.yaml` para mostrar título y enlace, y lista.

## Riesgos y mitigaciones

- **Cuello de botella en la redacción de contenido manual.** Escribir cada concepto a mano es lento y puede frenar ver la sección funcionando. Mitigación: no bloquear la construcción de la UI a tener todo el contenido — se puede navegar y probar con 2-3 conceptos núcleo común escritos primero (mayor apalancamiento: valen para varias oposiciones a la vez), y el resto se rellena de forma incremental con los agentes `scrapeador-fuentes-primarias` + `preparador-opos` (ver propuesta de tarea recursiva, fuera de esta spec).
- **Confusión entre fuente primaria y material redactado dentro de un mismo fichero markdown.** Resuelto como decisión de diseño, no solo como mitigación: cada `.md` separa `## Texto oficial`, `## Material adaptado` y `## Resumen` (esquema + resumen extenso) como secciones fijas (ver "Decisión: Formato del contenido" arriba), y el frontmatter `fuentes:` deja trazable de dónde sale el texto oficial (principio 3 de `CONSTITUTION.md`).
- **Falta de contenido para un concepto todavía no escrito.** Promovido a criterio de aceptación formal — ver Requisito 2, criterio 3 de `requirements.md`. La vista de tema debe mostrar un estado explícito de "contenido pendiente", no una página en blanco o rota; queda como tarea obligatoria en `tasks.md`, no opcional.
