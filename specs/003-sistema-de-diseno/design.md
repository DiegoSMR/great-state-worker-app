# Design: Sistema de diseño (legibilidad, navegación y temas)

Fase: 2 — Design. Estado: aprobado para implementación (revisión 2 — cubre los Requisitos 9-13 añadidos por `requirements.md` revisión 2, aprobados por Diego el 2026-09-14).
Última actualización: 2026-09-14

## Visión general

Esta spec no añade una sección de contenido nueva — reescribe la base visual y de navegación de toda la app sobre la arquitectura ya existente (Next.js App Router + TypeScript + Tailwind v4 en Vercel). Las decisiones de `notas-de-diseno.md` (paleta, tipografía, navegación, estados) ya están aprobadas por Diego; este documento las traduce a mecanismos técnicos concretos: cómo se representan los tokens de color en CSS, cómo se persisten tema/navegación/lectura sin flash de contenido sin estilo, y cómo se estructuran los componentes nuevos (navegación persistente, tabs/scrollspy, estados especiales).

Principio transversal de esta spec: **ningún color se escribe suelto en un componente.** Todo color pasa por un token nombrado (custom property CSS), nunca un hex ni una clase `amber-100`/`neutral-600` de Tailwind directamente — es lo que permite que el Requisito 1 (contraste correcto en ambos temas) y el futuro tercer tema (Requisito 3.4) no requieran tocar componente por componente.

## Decisiones clave

### Decisión: Tokens de color — CSS custom properties + atributo `data-theme` en `<html>`, sin depender de `prefers-color-scheme` como fuente de verdad

- **Opción elegida:** los 5 tokens base + 3 pares de estado de `notas-de-diseno.md` (sección 1, con ratios de contraste ya verificados con la fórmula WCAG real) se definen como custom properties CSS sin prefijo de tema (`--bg-primario`, `--bg-secundario`, `--borde`, `--texto-primario`, `--texto-secundario`, `--nucleo-bg`/`--nucleo-texto`, `--bookmark-bg`/`--bookmark-texto`, `--revision-bg`/`--revision-texto`), redefinidas por completo bajo dos selectores: `:root[data-theme="claro"]` (y `:root` a secas, como default) y `:root[data-theme="oscuro"]`. Un bloque `@theme inline` (ya usado en el proyecto para `--color-background`) las vuelve a exponer como `--color-*` para que Tailwind v4 genere automáticamente las utilidades (`bg-bg-primario`, `text-texto-secundario`, `border-borde`, `bg-nucleo-bg`, `text-revision-texto`, etc.) — ningún componente escribe un valor hex.
- **Primera visita (sin cookie todavía):** no se fuerza ningún `data-theme`. Un bloque `@media (prefers-color-scheme: dark)` con selector `:root:not([data-theme])` aplica los valores oscuros solo mientras no exista una elección explícita — satisface el Requisito 3.1 ("mostrar un tema por defecto sin configurar nada") sin convertir `prefers-color-scheme` en la fuente de verdad: en cuanto el usuario elige, se escribe `data-theme` y ese selector dejar de aplicar (mayor especificidad del atributo).
- **Alternativas consideradas:**
  - Clase `.dark` en `<html>` (patrón de Tailwind/`next-themes`). Se descarta porque es binaria por convención — forzaría a renombrar todo el mecanismo el día que se añada un tercer tema (Requisito 3.4); un atributo `data-theme="<id>"` con valor arbitrario no tiene ese límite.
  - Mantener el cambio de tema solo en `--background`/`--foreground` del `body` (estado actual). Es la causa raíz del bug de contraste — descartado, es literalmente lo que esta spec corrige.
- **Satisface:** Requisito 1 (completo), Requisito 3.4.

### Decisión: Persistencia de tema, densidad de navegación y configuración de lectura — una única cookie, no Postgres en v1

- **Opción elegida:** una cookie `gsw_prefs`, `httpOnly`, `sameSite=lax`, `path=/`, `max-age` de un año, con un único valor JSON:
  ```ts
  type Preferencias = {
    tema: "claro" | "oscuro";
    navDensidad: "hamburguesa" | "iconos" | "visible" | null; // null = sin elección manual, usar default por breakpoint
    lectura: { tamanoLetra: "pequeno" | "mediano" | "grande" };
  };
  ```
  Vive en `lib/preferencias.ts` (tipos, valores por defecto, `parsearPreferencias(cookieValue): Preferencias` con validación defensiva de cada campo — un valor corrupto o de una versión futura del esquema cae al default en vez de romper el render). La escritura pasa por un Server Action único, `guardarPreferencias(patch: Partial<Preferencias>)` en `app/_actions/preferencias.ts` (fusiona sobre el valor actual y hace `cookies().set(...)`).
  Se elige **una sola cookie con las tres preferencias**, no tres cookies sueltas, porque `notas-de-diseno.md` (sección 8) ya señala que comparten naturaleza ("elecciones del usuario sobre cómo se ve/comporta la app para él") y viven en el mismo panel — una sola lectura server-side basta para resolver los tres.
- **Por qué cookie y no `localStorage`:** una cookie viaja con la petición HTTP y el Server Component raíz (`app/layout.tsx`) puede leerla con `cookies()` de `next/headers` **antes** de renderizar el HTML — el `data-theme`/`data-tamano-letra` correctos ya están en el primer HTML enviado, sin script bloqueante en `<head>` ni parpadeo. `localStorage` solo es legible en el cliente, después de hidratar, y habría obligado a un script de arranque (patrón `next-themes`) para evitar el flash — más piezas móviles para el mismo resultado, y una librería nueva que el stack no tiene adoptada.
- **Por qué no Postgres en v1:** son preferencias de dispositivo/navegador (principio 6 de `CONSTITUTION.md` distingue esto de estado de usuario real), no datos que deban sincronizarse entre dispositivos todavía — no hay login, así que "sincronizar entre dispositivos" no tiene un usuario al que atribuírselo de forma fiable. Meterlas en Postgres ahora añadiría una tabla y un roundtrip de red a algo que hoy solo necesita estar disponible en el próximo request del mismo navegador.
- **Camino de migración a Postgres (para cuando exista multiusuario real):** cuando `NextAuth`/`Auth.js` entre en juego (ver `ARCHITECTURE.md`), se añadiría una tabla `preferencia_interfaz(usuario_id, tema, nav_densidad, tamano_letra, actualizado_en)` con PK `usuario_id` — mismo patrón que `bookmark` (`usuario_id` desde el primer día, nunca añadido a posteriori). La cookie no desaparecería necesariamente: seguiría sirviendo de default para visitantes no autenticados o como caché de lectura rápida, pero la fuente de verdad pasaría a la tabla, leída en el Server Component raíz igual que ahora se lee la cookie. `lib/preferencias.ts` ya aísla el tipo `Preferencias` de su mecanismo de persistencia (`parsearPreferencias`/`guardarPreferencias` son la única frontera), así que ese cambio no debería tocar ningún componente de UI, solo esas dos funciones.
- **Alternativas consideradas:** tabla Postgres desde ya (se descarta por lo anterior — estado de dispositivo, no de usuario, y este proyecto es single-user hoy); tres cookies separadas (se descarta por fragmentar una lectura que siempre se hace junta).
- **Satisface:** Requisito 2.6, Requisito 3.3, Requisito 8.3 (persistencia); Requisito 3.4 y 8.4 (forma extensible del dato).

### Decisión: Anti-flash — lectura de la cookie en el Server Component raíz, sin script bloqueante ni `localStorage`

- **Opción elegida:** `app/layout.tsx` pasa a ser (sigue siendo) un Server Component; añade `const preferencias = parsearPreferencias((await cookies()).get("gsw_prefs")?.value)` y renderiza `<html data-theme={preferencias.tema} data-tamano-letra={preferencias.lectura.tamanoLetra}>` — si no hay cookie, **no se escribe `data-theme`** (deja que decida `prefers-color-scheme`, ver decisión anterior) pero sí se escribe `data-tamano-letra="mediano"` (el tamaño de letra no tiene equivalente en `prefers-*`, así que su default siempre es explícito). Un `PreferenciasProvider` (Client Component, Context) envuelve `{children}` dentro de `<body>`, inicializado con ese mismo valor server-side — el cliente nunca tiene que "adivinar" el estado inicial, lo recibe ya resuelto como prop.
- **Coste asumido y documentado:** usar `cookies()` en el layout raíz convierte **todas** las rutas en renderizado dinámico por petición (Next.js no puede pre-generar estáticamente una página cuyo layout depende de datos de la petición). Antes de esta spec, páginas como `/estudio/tema` o `/estudio/oposicion/[id]` podían generarse estáticamente; `/estudio/marcadores` ya era `force-dynamic` explícito por depender de Postgres. Se acepta este coste porque: (a) es una app de un solo usuario con tráfico mínimo — el ahorro de generación estática no es un problema real de rendimiento en Vercel serverless; (b) la alternativa (script de arranque bloqueante + `localStorage`) añade complejidad y una dependencia de comportamiento client-only que el propio encargo de esta spec pide evitar explícitamente ("cookie para que el Server Component pueda leerlo sin flash"). Si en el futuro el volumen de tráfico lo justifica, se puede reintroducir generación estática parcial (PPR) sin cambiar el modelo de datos — solo la estrategia de render.
- **Alternativas consideradas:** script inline bloqueante en `<head>` que lee `localStorage`/cookie desde el cliente antes del primer paint (patrón `next-themes`). Descartado por lo anterior — es el patrón correcto cuando la persistencia es `localStorage` (no hay otra forma de evitar el flash), pero es trabajo redundante cuando ya se ha elegido cookie.
- **Satisface:** Requisito 1.3, Requisito 3.1–3.3, Requisito 8.2–8.3.

### Decisión: Aplicación instantánea de cambios (temas y lectura) sin recargar página

- **Opción elegida:** `PreferenciasProvider` expone `setTema`, `setNavDensidad`, `setTamanoLetra`. Cada uno: (1) actualiza el estado React del contexto de inmediato: (2) en un `useEffect` que observa `tema`/`tamanoLetra`, hace `document.documentElement.setAttribute("data-theme"|"data-tamano-letra", valor)` — actualización visual instantánea vía CSS, sin esperar respuesta de red; (3) llama al Server Action `guardarPreferencias` en segundo plano (sin bloquear la UI — `startTransition`, sin `router.refresh()`) solo para persistir la cookie de cara al próximo request. La densidad de navegación (`navDensidad`) no necesita el paso (2): el propio componente `Nav` (cliente, sección siguiente) es consumidor del contexto y re-renderiza con las clases correctas al cambiar el estado — no depende de un atributo global porque solo afecta a un componente, no a tokens CSS transversales.
- **Satisface:** Requisito 2.5, Requisito 3.2, Requisito 8.2.

### Decisión: Escala tipográfica y ancho de columna — tokens `rem`/`ch`, sin tipografía serif nueva en v1

- **Opción elegida:** se adoptan tal cual los valores de `notas-de-diseno.md` sección 2 (`--tamano-base: 1.0625rem` en nivel "mediano", `line-height: 1.65`, columna `65ch`/`72ch` para texto oficial, escala de encabezados `1.75/1.375/1.125rem`). El tamaño de letra se resuelve con `--tamano-base` redefinido bajo `:root[data-tamano-letra="pequeno"|"grande"]` (ver más abajo), consumido por una clase utilitaria `.contenido-lectura` aplicada solo a los contenedores de prosa (no a la navegación ni a metadatos de UI, que mantienen su tamaño fijo). El ancho de columna se implementa como dos clases, `.medida-lectura` (65ch, material adaptado/resumen) y `.medida-lectura-oficial` (72ch, texto oficial), que sustituyen el `max-w-3xl` actual.
- **Sobre la tipografía serif propuesta como pregunta abierta:** se decide **no** añadir una segunda familia tipográfica en v1. Se mantiene Geist Sans (ya cargada, sin coste adicional) en toda la app, incluido el texto oficial. La diferenciación de "Texto oficial" (Requisito 4.3) se resuelve solo con caja/fondo/borde (ver decisión de tabs más abajo), que ya es suficiente para el criterio de aceptación sin depender de reconocer una tipografía distinta. Motivo: cargar una segunda fuente web añade una petición de red y riesgo de salto de layout (CLS) mientras carga, a cambio de una mejora de legibilidad marginal frente a lo que ya logra el tratamiento de caja — no está justificado para v1. Queda anotado como candidato futuro si, una vez construido, Diego percibe que el texto oficial necesita más distinción.
- **Alternativas consideradas:** unidades fijas (`px`) para la columna de lectura — descartado, ya lo señala `notas-de-diseno.md`: `ch` es lo que mantiene estable el número de caracteres por línea al cambiar el tamaño de letra (Requisito 8, nota de interacción explícita en notas-de-diseno sección 5).
- **Satisface:** Requisito 1 (tipografía no compromete contraste), Requisito 8.1, 8.5.

### Decisión: Estructura del componente de navegación persistente — un `NavShell` servidor + tres variantes, densidad resuelta sin JavaScript de breakpoint

- **Opción elegida:** `components/nav/NavShell.tsx` (Server Component) recibe `preferencias` desde el layout y calcula, **en el servidor**, las clases Tailwind de visibilidad de cada una de las tres variantes en función de `navDensidad`:
  ```ts
  function clasesVariante(variante: Densidad, override: Densidad | null): string {
    if (override) return override === variante ? "flex" : "hidden";
    // sin elección manual: default mobile-first por breakpoint (Requisito 2.4)
    return { hamburguesa: "flex md:hidden", iconos: "hidden md:flex lg:hidden", visible: "hidden lg:flex" }[variante];
  }
  ```
  Esto resuelve el Requisito 2.4 (default razonable por breakpoint: móvil→hamburguesa, tablet→iconos, escritorio→visible) **sin ningún hook de `matchMedia`** — es CSS puro evaluado por el navegador en el primer paint, así que no hay parpadeo ni salto de layout ni cuando no hay preferencia guardada ni cuando sí la hay (el servidor ya sabe cuál mostrar). Cuando el usuario cambia de modo manualmente, `NavShell` dev deja de ser el único responsable: el contexto de preferencias (cliente) mantiene el estado y re-renderiza las tres variantes con las clases recalculadas en el cliente con la misma función pura — mismo cálculo, mismo resultado, sin duplicar lógica (la función vive en `lib/nav-densidad.ts`, importada por el Server Component inicial y por el Client Component que reacciona a cambios).
  Las tres variantes comparten la lista de entradas (`lib/nav-items.ts`: Estudio, Marcadores — con comentario explícito de que Pruebas/Flashcards/Planificador se añaden aquí sin tocar `NavShell` cuando existan, ver `notas-de-diseno.md` sección 8) y el cálculo de sección activa (`usePathname()`):
  - `NavHamburguesa` (Client Component): botón de icono fijo + overlay (`position: fixed`, capa sobre el contenido) que se abre/cierra con estado local `useState`; único de los tres con estado propio de interacción (abierto/cerrado).
  - `NavIconos`: rail fijo lateral, solo iconos, `aria-label` por entrada (accesibilidad mínima aunque no sea el foco de esta spec).
  - `NavVisible`: rail fijo lateral expandido, icono + etiqueta de texto.
  Los tres marcan la entrada activa con los tokens de color (`bg-bg-secundario` + `text-texto-primario` en la entrada activa, `text-texto-secundario` en el resto) — satisface Requisito 2.7.
- **Selector de tema y panel de lectura:** viven como una entrada más dentro de las tres variantes (icono "Apariencia"), que abre `PreferenciasPanel` (Client Component, `<dialog>` o overlay simple) — accesible en un toque/clic adicional desde cualquier modo de densidad y cualquier tamaño de pantalla, resolviendo la pregunta abierta de `spec.md`.
- **Alternativas consideradas:** un único componente con `matchMedia` + estado React para decidir la variante activa. Descartado por el flash/salto inicial inevitable (el cliente no sabe el breakpoint hasta montar) y porque duplica en JS un cálculo que Tailwind ya resuelve en CSS de forma gratuita.
- **Satisface:** Requisito 2 completo.

### Decisión: Tabs + scrollspy para las tres partes del contenido de un concepto

- **Opción elegida:** `components/estudio/SeccionesConcepto.tsx` (Client Component) envuelve la vista de concepto. Renderiza una barra de pestañas sticky (`position: sticky; top: 0`, con el nav global por encima en z-index) con enlaces `<a href="#texto-oficial">`, `<a href="#material-adaptado">`, `<a href="#resumen">` — **anclas reales**, no `onClick` con `scrollIntoView`: funcionan incluso antes de que hidrate React (progressive enhancement, coherente con la construcción mobile-first del Requisito 2.1), y `scroll-behavior: smooth` en CSS les da el desplazamiento suave sin JS. Dentro de "Resumen", un segundo nivel de anclas (`#esquema`, `#resumen-extenso`) resuelve el Requisito 4.4.
  El resaltado de "dónde estoy" (scrollspy, Requisito 4.1) si usa JS: un `IntersectionObserver` sobre las tres secciones (`<section id="texto-oficial">`, etc.) que marca la pestaña correspondiente como activa cuando su sección cruza un umbral central del viewport — degrada con gracia: sin JS, las anclas siguen funcionando para navegar (Requisito 4.2), solo se pierde el resaltado automático al hacer scroll libre.
  El tratamiento visual distinguible sin depender del encabezado (Requisito 4.3) se resuelve con las cajas descritas en `notas-de-diseno.md` sección 6, usando los tokens ya definidos: Texto oficial = `bg-bg-secundario` + borde sólido (`border-borde`); Material adaptado = sin caja; Resumen = barra lateral izquierda de acento neutro (`border-l-4 border-borde`), con Esquema en formato más compacto que Resumen extenso.
- **Alternativas consideradas:** tres rutas/páginas separadas por sección. Descartado — el propio Requisito 4.2 pide moverse "sin recargar", y trocear en rutas distintas complicaría compartir la cabecera (badges, oposiciones) sin duplicar código.
- **Satisface:** Requisito 4 completo.

### Decisión: Estado "en revisión" — nuevo campo de frontmatter `en_revision`, sin tocar el modelo de datos del temario

- **Opción elegida:** se añade un campo opcional `en_revision: true` (booleano, ausente o `false` = no en revisión) al frontmatter YAML de `content/estudio/<concepto-id>.md`, junto a `fuentes:` — mismo fichero, mismo mecanismo de lectura ya existente (`lib/contenido.ts` con `gray-matter`). `verificador-vigencia-normativa` (fuera del alcance de esta spec activarlo, pero es quien lo marcaría en el futuro) escribiría este campo cuando detecte una fuente potencialmente desactualizada; `getContenidoConcepto` expone `enRevision: boolean` en `ContenidoConcepto`. Este es el cambio de frontmatter que corresponde a `lead-developer` decidir según el encargo (`CONSTITUTION.md`: "cualquier cambio de formato o frontmatter... pasa por ti").
- **Alternativas consideradas:** tabla Postgres `concepto_revision(concepto_id, motivo, marcado_en)`. Se descarta para v1 por la misma razón que el resto del contenido no vive en base de datos (`ARCHITECTURE.md`): es metadato del propio contenido, versionado junto a él, editado por agentes que ya escriben en `content/estudio/`. Si en el futuro se necesita guardar *cuándo* o *por qué* (pregunta abierta de `spec.md`, no resuelta), un campo `en_revision_desde: <fecha>` en el mismo frontmatter basta sin tabla nueva.
- **Componente:** `components/estudio/AvisoRevision.tsx` — banner no bloqueante, tokens `bg-revision-bg`/`text-revision-texto`, borde sólido (nunca discontinuo — ese lenguaje queda reservado para "sin escribir"), icono ⓘ, texto fijo tomado literalmente de `notas-de-diseno.md` sección 7. Se renderiza junto a "Texto oficial", nunca oculta contenido.
- **Satisface:** Requisito 6 completo.

### Decisión: Estado "sin escribir" — mismo componente ya existente, retocado con tokens

- **Opción elegida:** se conserva el componente/lenguaje visual ya validado (caja con borde discontinuo) — solo se migra de clases fijas (`border-neutral-300 bg-neutral-50`) a tokens (`border-borde` + variante discontinua vía `border-dashed`, `bg-bg-secundario`, `text-texto-secundario`). No se fusiona con "en revisión": son dos componentes distintos (`EstadoPendiente.tsx` ya existe inline en la página, se extrae a componente; `AvisoRevision.tsx` es nuevo) para que no compartan ni accidentalmente un token de color si en el futuro cambian por separado.
- **Satisface:** Requisito 5 completo.

### Decisión: Badges (núcleo común, bookmark) — mismos componentes, recoloreados con tokens

- **Opción elegida:** `NucleoComunBadge.tsx` pasa de `bg-amber-100 text-amber-800` a `bg-nucleo-bg text-nucleo-texto`. `BookmarkButton.tsx` pasa de ámbar a los tokens `bg-bookmark-bg`/`text-bookmark-texto` en estado marcado (cambio de color ámbar→violeta ya decidido y justificado en `notas-de-diseno.md` sección 1, para no compartir color con núcleo común) y a `border-borde text-texto-secundario` en estado sin marcar; el glifo (★ relleno / ☆ contorno) se mantiene como segunda señal no dependiente del color, ya presente en el código actual.
- **Satisface:** Requisito 7 completo.

### Decisión: Catálogo de estados especiales como receta, no como lista cerrada

- Los cuatro componentes de estado (`NucleoComunBadge`, `BookmarkButton`, `EstadoPendiente`, `AvisoRevision`) comparten un mismo patrón de props documentado en un comentario en `components/estudio/` (fondo/texto por token, icono opcional, texto corto) pero **no** se fuerza una abstracción común (`<Badge variant=.../>`) en esta iteración — con solo 4 casos, una capa de abstracción genérica añadiría indirección sin beneficio real todavía (YAGNI, principio del encargo de `lead-developer`). Si aparece un quinto estado (p. ej. "flashcard pendiente" del planificador futuro), es el momento natural de extraer el componente genérico, no antes.

### Decisión: Requisito 2 ablandado — la materialización concreta (hamburguesa/iconos/visible) no cambia, solo su estatus en `requirements.md`

- **Opción elegida:** ninguna implementación cambia. `requirements.md` ya no exige literalmente "hamburguesa/iconos/visible" como solución de interfaz, sino tres niveles de densidad abstractos (`collapsed`/`compact`/`expanded`). La decisión técnica de este documento (`NavHamburguesa`/`NavIconos`/`NavVisible`, sección "Estructura del componente de navegación persistente" arriba) sigue siendo la materialización elegida — simplemente se documenta explícitamente el mapeo `collapsed → hamburguesa`, `compact → iconos`, `expanded → visible`, para que quede claro que satisface el requisito abstracto sin ser la única forma posible de hacerlo.
- **Satisface:** Requisito 2.3 (versión revisión 2).

### Decisión: Modo concentración — estado global en `PreferenciasProvider`, no una ruta ni un layout separado

- **Opción elegida:** se añade `concentracion: boolean` (no persistente entre sesiones — se reinicia siempre a `false` al cargar una página nueva, es un estado de sesión de lectura, no una preferencia) al contexto de `PreferenciasProvider`, con `toggleConcentracion()`. Cuando `concentracion === true`:
  - `NavShell` (cualquiera que sea el nivel de densidad elegido por el usuario) renderiza una variante reducida: un único botón fijo (icono "salir de concentración", esquina superior) reemplaza las tres variantes normales — no se calcula con `clasesVariante`, es un `if (concentracion) return <BotonSalirConcentracion />` antes de esa lógica.
  - `SeccionesConcepto` (tabs + scrollspy) seguía renderizándose igual — el Requisito 9.1 solo pide reducir la navegación **global**, la navegación local del concepto se mantiene porque sigue siendo necesaria para orientarse dentro del contenido que se está leyendo.
  - Metadatos de cabecera no esenciales (oposiciones asociadas, badges de núcleo común) se ocultan con una clase condicional; el título del concepto se mantiene visible pero en un tratamiento más discreto (satisface Requisito 9.2 — conservar contexto).
  - El botón de salir es el único control de navegación visible — pulsarlo hace `toggleConcentracion()` y no navega a ningún sitio (satisface Requisito 9.3).
- **Activación:** un icono "Concentración" nuevo en las tres variantes de `Nav` (junto a "Apariencia"), y también accesible con una tecla rápida opcional (p. ej. `f`) como mejora, no como requisito.
- **Por qué estado de sesión y no preferencia persistente:** activar concentración es una acción del momento ("ahora quiero centrarme"), no una preferencia de "cómo se ve la app para mí" como tema/densidad/tamaño de letra — persistirlo forzaría a Diego a salir manualmente del modo la próxima vez que abra la app aunque ya no esté en sesión de lectura. Se descarta guardarlo en `gsw_prefs`.
- **Alternativas consideradas:** una ruta/layout `/concentracion` separado. Descartado — obligaría a duplicar la página de concepto en dos layouts distintos por una diferencia puramente de qué chrome se muestra.
- **Satisface:** Requisito 9 completo.

### Decisión: Progreso de lectura — `localStorage` por concepto (no cookie, no Postgres), restaurado tras hidratar

- **Opción elegida:** `lib/progreso-lectura.ts` (Client-only) expone `guardarPosicion(conceptoId, scrollY)` (debounced ~500ms en `scroll`) y `leerPosicion(conceptoId): number | null`, usando `localStorage` con clave `gsw_progreso:<conceptoId>`, valor `{ scrollY, actualizadoEn }`. `SeccionesConcepto` (Client Component ya existente) llama a `leerPosicion` en un `useEffect` al montar y hace `window.scrollTo({ top, behavior: "instant" })` — antes de que el usuario perciba el primer paint completo, para minimizar el salto visual; si no hay valor guardado, no hace nada (queda en la posición natural, arriba).
- **Por qué `localStorage` y no la cookie `gsw_prefs` ya existente:** el número de conceptos crece con el temario (potencialmente cientos) — una sola cookie acumulando una entrada por concepto rompería el límite práctico de ~4KB por cookie y viajaría entera en cada petición HTTP aunque la mayoría de rutas no la necesiten. `localStorage` no tiene ese límite práctico a esta escala, no viaja con cada request, y esto no tiene el problema de "flash" que sí tenía el tema (Requisito 1.3): un salto de scroll instantáneo tras montar es aceptable, mientras que un parpadeo de color no lo era.
- **Por qué no Postgres:** mismo razonamiento que el resto de preferencias de interfaz (ver decisión de persistencia más arriba) — es estado de dispositivo/navegador, se re-evalúa si migra a multiusuario real.
- **Indicador visual (Requisito 10.2):** `components/estudio/ProgresoLectura.tsx` (Client Component), una barra fina (`height: 3px`) `position: sticky` justo debajo de la barra de tabs de `SeccionesConcepto` (no del viewport completo — para no competir con `NavShell`), ancho proporcional a `scrollY actual / (scrollHeight - clientHeight)` del contenedor de contenido, recalculado en el mismo listener de scroll que ya usa `guardarPosicion` (un único listener, dos efectos). Color `border-borde` (token neutro) — nunca uno de los colores de estado (ámbar/violeta/azul), para no confundirse con núcleo común, bookmark o revisión (Requisito 13).
- **Aviso "Continuando desde donde lo dejaste":** un texto pequeño bajo la cabecera del concepto, visible solo si `leerPosicion` devolvió un valor al montar, con una animación de desvanecido a los 4 segundos o al primer `scroll` manual del usuario (lo que ocurra antes) — respeta `prefers-reduced-motion` (Requisito 12.5): sin ella, desaparece con `opacity` de golpe en vez de transición.
- **Alternativas consideradas:** guardar el progreso como porcentaje del documento en vez de píxeles de scroll — descartado, píxeles es más simple y suficientemente preciso para "restaurar la posición", sin depender de recalcular porcentajes si el contenido cambia de tamaño entre visitas (p. ej. tras editar el `.md`).
- **Satisface:** Requisito 10 completo.

### Decisión: Trazabilidad normativa — extracción ligera de enlace desde el string de `fuentes:`, sin cambiar el frontmatter

- **Opción elegida:** `lib/contenido.ts` añade `extraerEnlaceFuente(fuente: string): string | null`, una función pura que busca con una regex simple (`/https?:\/\/\S+/`) una URL dentro del string ya existente de cada entrada de `fuentes:` (p. ej. `"Ley 31/1995... (texto consolidado, boe.es/buscar/act.php?id=..., consultado 2026-09-14)"` — nótese que hoy faltaría el esquema `https://` en varios ejemplos existentes; se decide que `lead-developer`/`preparador-opos` normalicen las fuentes nuevas para incluirlo, y que las existentes se traten como texto plano sin enlace hasta normalizarse, sin bloquear esta spec por eso). Si se encuentra URL, se renderiza como `<a href>` real; si no, el string se muestra tal cual, sin enlace.
- **Componente:** `components/estudio/FuenteNormativa.tsx` (Server Component, no necesita interactividad más que un `<details>` nativo) — un `<details>`/`<summary>` con etiqueta "Fuente" junto al encabezado de "Texto oficial", que al expandirse lista cada entrada de `fuentes:` del concepto con el tratamiento de enlace anterior. Se renderiza colapsado por defecto (Requisito 11.3 — no debe dominar la pantalla). Si el concepto tiene `enRevision: true` (Requisito 6), `AvisoRevision` incluye un enlace `#fuente-normativa` que expande y hace scroll a este mismo componente en vez de duplicar la lista de fuentes en el propio aviso (Requisito 11.2).
- **Alternativas consideradas:** estructurar `fuentes:` en campos separados (`norma`, `articulo`, `url`) en el frontmatter. Descartado para v1 por el propio Requisito 11.4 — no se cambia el formato de almacenamiento en esta spec; si en el futuro hace falta enlazar/filtrar por norma de forma más fiable que una regex, es una migración de contenido que puede hacerse después sin tocar este componente más que en su fuente de datos.
- **Satisface:** Requisito 11 completo.

### Decisión: Accesibilidad mínima — checklist aplicado a los componentes ya diseñados, sin componentes nuevos dedicados

- **Opción elegida:** no se crea infraestructura nueva de accesibilidad — se aplica como checklist de implementación sobre los componentes ya definidos en este documento, verificado en la revisión de cada PR de `lead-developer`:
  - `NavHamburguesa`/`NavIconos`/`NavVisible`: `aria-label` en cada entrada cuando solo hay icono; `:focus-visible` con contorno de 2px usando `--borde` con mayor contraste; overlay de `NavHamburguesa` atrapa el foco (`inert` en el resto del documento mientras está abierto) y se cierra con `Escape`.
  - `PreferenciasPanel` (selector de tema + tamaño de letra + futuro): usa `<fieldset>`/`<legend>` o `role="radiogroup"` con `aria-checked`, nunca `div` a medida sin rol.
  - `SeccionesConcepto`: anclas reales `<a href="#...">` (ya decidido arriba, es progressive enhancement); `:focus-visible` visible al tabular entre pestañas.
  - `BotonSalirConcentracion`, `BookmarkButton`: elementos `<button>` reales (ya son botones hoy, se mantiene).
  - `ProgresoLectura`: `aria-hidden="true"` — es puramente informativo/visual, no aporta valor añadido a un lector de pantalla sobre lo que ya transmite el propio scroll.
  - Cualquier transición (overlay de `NavHamburguesa`, scroll suave de anclas, desvanecido del aviso de continuar leyendo) envuelta en `@media (prefers-reduced-motion: no-preference)`; con `reduce`, cambio instantáneo sin transición.
- **Satisface:** Requisito 12 completo.

### Decisión: Jerarquía visual estable — principio de revisión, no un componente

- **Opción elegida:** no añade código nuevo — se deja como criterio de revisión aplicado a todo lo anterior: ningún badge/aviso (`NucleoComunBadge`, `BookmarkButton`, `AvisoRevision`, `EstadoPendiente`, `ProgresoLectura`, aviso de "continuar leyendo") usa un tamaño de fuente mayor que el cuerpo de texto, un `z-index` que lo superponga al contenido de forma bloqueante, ni un color más saturado que los tokens de estado ya definidos en `notas-de-diseno.md` sección 1. `lead-developer` verifica este criterio como parte de la revisión de cada componente de estado, no como un test automatizado.
- **Satisface:** Requisito 13 completo.

## Componentes afectados

- `app/globals.css` — **reescrito**: tokens de color (claro/oscuro + 3 estados), `@theme inline` extendido, tokens tipográficos (`--tamano-base` por nivel), clases `.medida-lectura`/`.medida-lectura-oficial`/`.contenido-lectura`.
- `app/layout.tsx` — **modificado**: lee `gsw_prefs` vía `cookies()`, renderiza `data-theme`/`data-tamano-letra` en `<html>`, envuelve `children` en `PreferenciasProvider` y `NavShell`.
- `lib/preferencias.ts` — **nuevo**: tipos `Preferencias`, defaults, `parsearPreferencias`.
- `app/_actions/preferencias.ts` — **nuevo**: Server Action `guardarPreferencias`.
- `components/preferencias/PreferenciasProvider.tsx` — **nuevo**: Context Client Component.
- `components/preferencias/PreferenciasPanel.tsx` — **nuevo**: selector de tema + tamaño de letra.
- `lib/nav-densidad.ts` — **nuevo**: función pura `clasesVariante`, compartida servidor/cliente.
- `lib/nav-items.ts` — **nuevo**: catálogo de entradas de navegación.
- `components/nav/NavShell.tsx`, `NavHamburguesa.tsx`, `NavIconos.tsx`, `NavVisible.tsx` — **nuevos**.
- `components/estudio/SeccionesConcepto.tsx` — **nuevo**: tabs + scrollspy + cajas por sección.
- `components/estudio/EstadoPendiente.tsx` — **nuevo** (extraído de `app/estudio/tema/[conceptoId]/page.tsx`).
- `components/estudio/AvisoRevision.tsx` — **nuevo**.
- `lib/contenido.ts` — **modificado**: parsea `en_revision` del frontmatter, expone `enRevision`.
- `app/estudio/_components/NucleoComunBadge.tsx`, `BookmarkButton.tsx` — **modificados**: tokens en vez de clases fijas de Tailwind.
- `app/estudio/tema/[conceptoId]/page.tsx`, `app/estudio/page.tsx`, `app/estudio/tema/page.tsx`, `app/estudio/oposicion/[oposicionId]/page.tsx`, `app/estudio/marcadores/page.tsx`, `app/page.tsx` — **modificados**: quitan enlaces "← volver" sueltos (los sustituye `NavShell`), adoptan `.medida-lectura`/tokens en vez de `max-w-3xl`/grises fijos.
- `ARCHITECTURE.md` — **modificado**: nueva sección documentando dónde vive la preferencia de interfaz (cookie, no Postgres) y el camino de migración.
- `components/preferencias/PreferenciasProvider.tsx` — **modificado**: añade `concentracion` (estado de sesión, no persistente) y `toggleConcentracion`.
- `components/nav/NavShell.tsx` — **modificado**: renderiza el botón único de salir de concentración cuando `concentracion === true`, antes de la lógica de `clasesVariante`.
- `components/estudio/BotonSalirConcentracion.tsx` — **nuevo**.
- `lib/progreso-lectura.ts` — **nuevo**: `guardarPosicion`/`leerPosicion` sobre `localStorage`, con debounce.
- `components/estudio/ProgresoLectura.tsx` — **nuevo**: barra de progreso sticky + aviso "Continuando desde donde lo dejaste".
- `components/estudio/SeccionesConcepto.tsx` — **modificado**: restaura `scrollY` guardado al montar, delega el cálculo de progreso a `ProgresoLectura`.
- `lib/contenido.ts` — **modificado** (además de `enRevision`): añade `extraerEnlaceFuente`, expone `fuentes: string[]` ya presente en `ContenidoConcepto`.
- `components/estudio/FuenteNormativa.tsx` — **nuevo**: `<details>` con las fuentes del concepto y enlace real cuando la regex lo detecta.
- `components/estudio/AvisoRevision.tsx` — **modificado**: añade enlace `#fuente-normativa` hacia `FuenteNormativa` cuando el concepto tiene fuentes.

## Flujo de datos / interacción

1. Request entra → `app/layout.tsx` (Server Component) lee la cookie `gsw_prefs`, la parsea con default seguro, renderiza `<html data-theme=... data-tamano-letra=...>` y pasa `preferencias` a `NavShell` (servidor, calcula clases de densidad) y a `PreferenciasProvider` (cliente, estado inicial ya resuelto).
2. El usuario abre el panel de preferencias (icono en cualquiera de las tres variantes de `Nav`) y cambia tema/densidad/tamaño de letra → el contexto actualiza estado React al instante, refleja el cambio visualmente (atributo en `<html>` para tema/letra, re-render de `NavShell`-cliente para densidad) y dispara `guardarPreferencias` en segundo plano.
3. `guardarPreferencias` fusiona el patch sobre el valor actual de la cookie y hace `cookies().set("gsw_prefs", JSON.stringify(nuevo), {...})` — no hace `revalidatePath`, no hay razón para volver a pedir HTML al servidor solo por esto.
4. Próxima visita/pestaña nueva → vuelve al paso 1 con la cookie ya actualizada — sin flash, sin depender del cliente.
5. Dentro de `/estudio/tema/[conceptoId]`, `getContenidoConcepto` añade `enRevision` al objeto ya devuelto; la página renderiza `AvisoRevision` si es `true`, o `EstadoPendiente` si el fichero no existe — ambos antes que `SeccionesConcepto`, que solo se monta si hay contenido real.
6. `SeccionesConcepto` monta → lee `localStorage["gsw_progreso:<conceptoId>"]` → si existe, hace `scrollTo` inmediato y muestra el aviso de "continuar leyendo" (se desvanece solo); en cada evento de scroll (debounced), `ProgresoLectura` recalcula el ancho de la barra y `lib/progreso-lectura.ts` persiste la nueva posición — ninguno de los dos pasos toca el servidor.
7. El usuario activa "Concentración" desde `Nav` → `PreferenciasProvider.toggleConcentracion()` → `NavShell` re-renderiza a su variante mínima; no hay escritura de cookie ni Server Action, es estado de sesión puro que se pierde al recargar la página (intencional).
8. `getContenidoConcepto` expone también `fuentes: string[]` (ya existente en el frontmatter) → la página de concepto renderiza `FuenteNormativa` con esas fuentes, aplicando `extraerEnlaceFuente` a cada una en el servidor.

## Riesgos y mitigaciones

- **Todas las rutas pasan a dinámicas por leer `cookies()` en el layout raíz.** Ver "coste asumido y documentado" arriba — aceptado conscientemente, no es un descubrimiento tardío.
- **Tres variantes de navegación (`NavHamburguesa`/`Iconos`/`Visible`) triplican algo de JSX.** Mitigado compartiendo `lib/nav-items.ts` (única fuente de las entradas) y `lib/nav-densidad.ts` (único cálculo de clases) — lo que se triplica es solo el layout visual de cada variante, no los datos ni la lógica de qué está activo.
- **Cambiar `max-w-3xl` por `.medida-lectura` (65ch) puede alterar visualmente páginas que hoy no son "contenido de lectura larga" (p. ej. `/estudio/marcadores`, un listado).** Mitigación: `.medida-lectura` se aplica solo a los contenedores de prosa real (contenido de concepto); los listados mantienen un ancho de página general más generoso (se define en la implementación, no es literalmente el mismo valor para todo).
- **Añadir `en_revision` al frontmatter sin que ningún agente lo esté escribiendo todavía** deja el campo sin uso real hasta que `verificador-vigencia-normativa` lo active. Aceptado — es exactamente el patrón "dejar el terreno preparado sin implementar el evolutivo completo" que pide el encargo; se puede probar manualmente marcando `en_revision: true` en un `.md` de ejemplo durante la verificación de esta spec.
- **`extraerEnlaceFuente` depende de que el string de `fuentes:` contenga una URL con esquema (`https://`).** Varias fuentes ya escritas hoy (ver `content/estudio/*.md`) escriben el dominio sin `https://` (p. ej. `boe.es/buscar/...`). Mitigación: la regex se escribe para tolerar también dominios sin esquema conocidos (`boe.es`, `boa.aragon.es`) como caso especial, y si no detecta nada, se muestra el texto plano sin enlace — nunca rompe el render. Normalizar las fuentes existentes para incluir el esquema es una mejora de contenido, no bloqueante para esta spec.
- **El progreso de lectura en `localStorage` no viaja entre dispositivos.** Aceptado conscientemente — mismo razonamiento que el resto de preferencias de interfaz (ver decisión de persistencia): es estado de dispositivo/navegador hasta que exista multiusuario real.
- **El estado de `concentracion` no persiste entre sesiones por diseño** (ver decisión correspondiente) — si Diego esperara que la app recuerde que estaba en modo concentración al recargar, esto no lo hace; es una elección deliberada, no una limitación descubierta tarde.

## Preguntas abiertas para Diego

- Ninguna bloqueante para empezar a implementar. Se marcaron como decisiones ya tomadas en este documento la tipografía serif (no se añade en v1), la persistencia general (cookie, no Postgres), la persistencia del progreso de lectura (`localStorage`, no cookie) y la no persistencia del modo concentración (estado de sesión) — todas eran "decisión de Fase 2" en `spec.md`/`requirements.md`, no preguntas para Diego. Si al verlo implementado Diego prefiere otra dirección en cualquiera de ellas, es un ajuste de iteración, no una repetición de fase.
