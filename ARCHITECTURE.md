# Arquitectura

Documento vivo. Recoge la arquitectura técnica recomendada para la versión definitiva de la app (no el esqueleto estático de prueba), y por qué se ha elegido así.

Última actualización: 2026-09-15

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

## Decidido: dónde vive la preferencia de interfaz (sistema de diseño, `specs/003-sistema-de-diseno`)

Tema, densidad de navegación y tamaño de letra son **preferencias de dispositivo/navegador, no estado de usuario** — no hay login (principio 6 de `CONSTITUTION.md`), así que "sincronizar entre dispositivos" todavía no tiene un usuario real al que atribuírselo.

- **Persistencia: una única cookie `gsw_prefs`** (`httpOnly`, `sameSite=lax`, un año de vida), no `localStorage` ni una tabla en Postgres. Vive en `lib/preferencias.ts` (tipo `Preferencias`, `parsearPreferencias` con validación defensiva campo a campo) y se escribe desde el único Server Action `guardarPreferencias` (`app/_actions/preferencias.ts`).
- **Por qué cookie y no `localStorage`:** una cookie viaja con la petición HTTP, así que `app/layout.tsx` (Server Component) puede leerla con `cookies()` **antes** de renderizar el HTML y escribir `data-theme`/`data-tamano-letra` directamente en `<html>` — sin script de arranque bloqueante ni parpadeo de tema al cargar. `localStorage` solo es legible tras hidratar en el cliente.
- **Coste asumido:** leer `cookies()` en el layout raíz convierte todas las rutas en dinámicas (`ƒ`, sin generación estática) — antes de esta spec, páginas como `/estudio/tema` sí podían pre-generarse. Aceptado conscientemente: la app es de un solo usuario con tráfico mínimo, y si el volumen lo justificara en el futuro se puede reintroducir generación estática parcial (PPR) sin cambiar el modelo de datos, solo la estrategia de render.
- **El progreso de lectura (posición de scroll por concepto) es la excepción: vive en `localStorage`**, no en la cookie (`lib/progreso-lectura.ts`, clave `gsw_progreso:<conceptoId>`). El número de conceptos crece con el temario (potencialmente cientos) — una cookie acumulando una entrada por concepto rompería su límite práctico de ~4KB y viajaría entera en cada request aunque la ruta no la necesite. No tiene el problema de parpadeo que sí tenía el tema: un salto de scroll instantáneo tras montar es aceptable.
- **Modo concentración es estado de sesión puro** (`PreferenciasProvider`, no persistido) — se reinicia siempre a `false` al cargar una página nueva, deliberadamente: es una acción del momento ("ahora quiero concentrarme"), no una preferencia de "cómo se ve la app para mí".
- **Camino de migración a multiusuario real:** cuando exista login (NextAuth/Auth.js), se añadiría una tabla `preferencia_interfaz(usuario_id, tema, nav_densidad, tamano_letra, actualizado_en)` con PK `usuario_id` — mismo patrón que `bookmark` (`usuario_id` desde el primer día). La cookie no desaparecería necesariamente: seguiría sirviendo de default para visitantes no autenticados, pero la fuente de verdad pasaría a la tabla. `lib/preferencias.ts` (`parsearPreferencias`/`guardarPreferencias`) es la única frontera entre el tipo `Preferencias` y su mecanismo de persistencia, así que ese cambio no debería tocar ningún componente de UI.

Detalle completo de las 13 decisiones de esta spec (tokens de color, `NavShell` y sus tres variantes de densidad, tabs+scrollspy, estados especiales, accesibilidad) en `specs/003-sistema-de-diseno/design.md`.

### Extensión (2026-09-14): tercer tema "papel" y modo de texto "manuscrito"

Aplicación directa de los dos puntos de extensibilidad que ya exigían `requirements.md` (Requisito 3.4: tema como string, no booleano; Requisito 8.4: `readingSettings` como objeto extensible) — no reabre `requirements.md` ni el modelo de persistencia (sigue siendo la misma cookie `gsw_prefs`).

- `Tema` pasa de `"claro" | "oscuro"` a `"claro" | "oscuro" | "papel"`. `ReadingSettings` (el objeto `lectura` de `Preferencias`) gana `estiloTexto: "digital" | "manuscrito"` y `intensidadManuscrito: "ligera" | "media" | "intensa"` (solo relevante cuando `estiloTexto === "manuscrito"`). `PreferenciasPatch` (nuevo tipo en `lib/preferencias.ts`) sustituye a `Partial<Preferencias>` como forma de los parches que aceptan `guardarPreferencias`/`persistir`, porque `lectura` ahora tiene varios campos y un cambio de uno solo no debe obligar a repetir los demás.
- **Tipografías del modo manuscrito (Caveat para encabezados, Kalam para cuerpo) autoalojadas vía `next/font/google`** en `app/layout.tsx` — mismo patrón que Geist, nunca `<link>` a `fonts.googleapis.com` en runtime (verificado en el CSS de producción: los `@font-face` generados apuntan a `.woff2` locales, cero referencias a `fonts.googleapis.com`).
- Toda la lógica de tamaño/color/interlineado del modo manuscrito y del patrón de líneas de "papel" vive en `app/globals.css` como CSS puro (custom properties condicionadas por `[data-estilo-texto]`/`[data-intensidad-manuscrito]`/`[data-theme="papel"]`), no en componentes — sigue el principio transversal de la spec (ningún color/tamaño suelto en un componente).
- **Hallazgo incidental corregido en la misma revisión:** el bloque `--tw-prose-*` que `globals.css` ya definía en `:root` (para que `@tailwindcss/typography` pintara el contenido Markdown con los tokens de la app) nunca llegaba a aplicarse — el plugin redeclara esas mismas variables directamente sobre `.prose` con su propia paleta por defecto, y una declaración puesta directamente sobre un elemento gana siempre a un valor heredado de un ancestro. En `data-theme="oscuro"` esto hacía el contenido de estudio (`<blockquote>` de "Texto oficial" incluido) casi ilegible. Corregido redeclarando el mismo bloque directamente sobre `.prose`. Detalle y ratios en `specs/003-sistema-de-diseno/notas-de-diseno.md` §15/§16.

## Decidido: texto enriquecido embebido en el contenido de estudio (`notas-de-diseno.md` §14)

`components/estudio/Markdown.tsx` renderizaba con `react-markdown` + `remark-gfm` sin soporte de HTML embebido — `<u>`/`<mark class="ink-...">` escritos a mano en `content/estudio/*.md` se limpiaban antes de llegar al DOM. Se añaden dos dependencias al pipeline:

- **`rehype-raw`**: convierte el HTML crudo embebido en el markdown en nodos reales del árbol, en vez de descartarlo.
- **`rehype-sanitize`**, con un esquema propio (`esquemaTextoEnriquecido` en el propio componente) que parte del `defaultSchema` de la librería (ya cubre los elementos normales de markdown/GFM) y añade `u` y `mark`, restringiendo el atributo `class` de `mark` a las 6 clases `ink-*` de §14. No es una medida de seguridad (`content/estudio/` solo lo escriben nuestros propios agentes, sin superficie de XSS real) — es para que un typo de un agente (una clase mal escrita, una etiqueta fuera de la lista) no cuele HTML/clases arbitrarias en silencio; con el esquema, lo que no está en la lista cerrada simplemente no se renderiza con esas propiedades.

Los 6 pares de color que usan las clases `ink-*` reutilizan los tokens ya existentes de la paleta (`--nucleo-*`, `--bookmark-*`, `--revision-*`) más los 3 nuevos de §1 (`--ejemplo-*`, `--excepcion-*`, `--atencion-*`) — ningún color nuevo se introduce solo para esto.

## Decidido: trazabilidad por dato individual (`specs/018-perfil-oposicion`)

`content/estudio/*.md` (frontmatter `fuentes:`) y `Oposicion.fuente` de `content/temario.yaml` atribuyen una sola fuente a **todo un fichero o fila** — válido para un documento largo con una procedencia, pero insuficiente para un perfil de oposición, que necesita muchos datos sueltos y cortos (requisitos de acceso, retribuciones, participación, FAQ) cada uno con su propio estado/fuente/fecha, y donde una fracción alta va a quedar sin verificar desde el primer día (no como excepción, como norma — ver `specs/018-perfil-oposicion/investigacion-datos.md`).

- **`lib/dato-oficial.ts`**: tipo genérico `DatoOficial<T>` (`{ estado: "confirmado"; valor: T; fuente: string; fechaConsulta: string } | { estado: "pendiente_confirmar"; nota?: string }`) y `Atribucion` (igual pero sin `valor` propio, para atribuir fuente a contenido que ya existe por sí mismo, como la respuesta de una FAQ). Pensado como patrón reutilizable desde el principio, no solo para esta spec — es el candidato natural para `specs/016-convocatorias` cuando se aborde, que necesita el mismo criterio "pendiente de confirmar, nunca inventado". El criterio se cumple a nivel de tipo, no solo de UI: es imposible construir un dato con `valor` sin `fuente`/`fechaConsulta`, porque el tipo unión no lo permite.
- **`content/perfil-oposicion/<oposicionId>.yaml`** (uno por oposición) + **`content/perfil-oposicion/faq-comunes.yaml`** (preguntas transversales, deduplicadas por construcción — viven en un fichero aparte en vez de un campo `alcance` por pregunta, para que sea estructuralmente imposible copiar una pregunta común dentro de las específicas de una oposición): mismo patrón de lectura y caché en memoria que `content/temario.yaml`/`content/estudio/*.md` (`lib/perfil-oposicion.ts`, `readFileSync` + `parse` de `yaml`, sin librería nueva). `getPerfilOposicion()` devuelve `null` sin lanzar excepción si el fichero de una oposición no existe todavía — mismo criterio defensivo que `getContenidoConcepto()` — porque es esperable que `preparador-opos` redacte antes unas oposiciones que otras (ver más abajo, DPZ).
- La comparativa de temario (`getResumenNucleoComun`, `getComparativaTemario` en `lib/temario.ts`) no introduce ningún fichero de datos nuevo — se deriva por completo de la tabla de relación ya existente en `content/temario.yaml`.

Detalle completo del esquema (`PerfilOposicion`, `FilaRetribucion`, `ConvocatoriaParticipacion`, `PreguntaFaq`) y las decisiones de UI (`DatoPendiente`, tabla retributiva agrupada, sección `/estudio/faqs`, vista `/estudio/comparativa-temario`) en `specs/018-perfil-oposicion/design.md`. Verificación de contenido real y estado de huecos por oposición en `specs/018-perfil-oposicion/tasks.md` — DPZ queda con la mayoría de sus datos `pendiente_confirmar` por un bloqueo de acceso a `dpz.es` (error de certificado SSL), no por un límite del propio diseño.
