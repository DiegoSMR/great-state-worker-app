# Investigación: referencias visuales para el look and feel de la app

Investigación de `disenador-maquetador` (2026-09-15), a petición de Diego: "de la nuestra no está muy conseguido" el aspecto visual de la app. Este documento no es una spec ni una decisión de diseño — es la base factual (qué hacen bien otras apps de estudio/productividad, y en qué se nota concretamente que la nuestra se queda corta) para que Diego decida si abre una spec nueva de rediseño visual y con qué alcance. No se ha tocado ningún componente ni fichero de código.

Alcance de la investigación: apps de estudio/productividad citadas por Diego (Anki, Quizlet, Notion, RemNote, Obsidian, Duolingo, Brilliant.org, Readwise Reader, Todoist, Linear) más una búsqueda de apps españolas de oposiciones con diseño destacable. Fuente de "lo que ya existe en el repo": `specs/003-sistema-de-diseno/design.md`, `notas-de-diseno.md`, `app/globals.css`, y los componentes reales de `app/estudio/`, `components/estudio/`, `components/nav/` (leídos antes de investigar nada fuera, según el encargo).

---

## 1. Qué hace bien cada referencia (patrones concretos y accionables)

### Anki / AnkiDroid (tema Material)

- El rediseño Material de AnkiDroid movió todos los controles de repaso a la parte inferior de la pantalla y **redujo deliberadamente la saturación de los botones de calificación** (Otra vez/Difícil/Bien/Fácil) tras feedback de que el rojo "Otra vez" competía visualmente con el contenido de la tarjeta — el color se reserva para la *acción* (calificar), nunca para el contenido que se está estudiando.
- La tarjeta en sí (donde vive el contenido real) se mantiene deliberadamente neutra — el sistema de temas de Anki es enorme (miles de temas de comunidad en AnkiWeb/GitHub) pero casi todos comparten un mismo principio: fondo neutro, tipografía sin adornos, foco absoluto en el texto que se repasa.
- **Lección aplicable:** el color debe señalizar *interacción y estado*, no decorar el contenido. Nuestro texto de estudio ya sigue este principio (§14 de `notas-de-diseno.md`, resaltados `ink-*` con intención semántica) — es coherente con Anki, no hay que cambiar nada aquí.

Fuentes: [Material Design Update 2018 · Issue #5126, ankidroid/Anki-Android](https://github.com/ankidroid/Anki-Android/issues/5126), [Add ability to customize colors · Issue #3757](https://github.com/ankidroid/Anki-Android/issues/3757).

### Notion

- **Escala de espaciado estricta**: 4/8/12/16/20/24/32/40/48/64px para todo margen/padding — nunca un valor suelto fuera de esa progresión.
- **Radios de esquina consistentes por tipo de elemento**: 8–12px en tarjetas, 4px en botones/inputs — dos niveles, no uno improvisado por componente.
- **Elevación con sombra multicapa de opacidad muy baja** (4 capas, de 1px a 18px de blur) en vez de solo bordes — es lo que hace que una tarjeta de Notion "flote" ligeramente sobre el fondo sin llegar a un efecto skeuomorphic pesado.
- **Bordes de 1px en `rgba(0,0,0,0.1)`** ("susurros") que aportan estructura sin peso visual — combinados con la sombra, no en vez de ella.
- Las vistas de base de datos en cuadrícula/galería colapsan a una sola columna por debajo de 840px de ancho — un único breakpoint de colapso, no una cascada de layouts distintos.
- Tipografía con compresión progresiva de `letter-spacing` en tamaños grandes (títulos más apretados, cuerpo normal) para dar densidad a los encabezados sin perder legibilidad en el cuerpo.

Fuentes: [Notion Design Tokens, Typography & CSS Variables — DesignMD](https://designmd.cc/benchmarks/notion), [Notion design system — palette, typography & tokens — OpenDesign](https://open-design.ai/plugins/design-system-notion/).

### RemNote

- Integra notas + PDF + flashcards en una sola vista, con un contador de repasos pendientes como badge visible en el propio ítem de navegación de la barra lateral — el número "vive" en la navegación, no hay que entrar a verlo.
- **Advertencia útil, no solo patrón a copiar:** el feedback de usuarios reales es que la interfaz "se siente demasiado abarrotada" cuando todo (notas, PDFs, flashcards, propiedades) es visible a la vez, y que preferirían algo "más parecido a Quizlet" — una interfaz separada y limpia para el modo de repaso frente al modo de edición/consulta.
- **Lección aplicable:** el contador-badge en un ítem de navegación es un patrón barato y de alto valor para cuando existan Pruebas/Flashcards (conceptos pendientes de repasar hoy, tests sin hacer) — pero la propia crítica a RemNote es un argumento a favor de que `SeccionesConcepto` siga siendo una vista de lectura limpia, separada de cualquier futura vista de "modo repaso", en vez de fusionarlas.

Fuentes: [Modern Flashcard App UI UX Design 2025 — Medium](https://medium.com/@prajapatisuketu/modern-flashcard-app-ui-ux-design-2025-4545294a17b4), [Flashcard Basics — RemNote Help Center](https://help.remnote.com/en/articles/8663109-flashcard-basics).

### Linear

- Tipografía en un único rango de pesos variable (Inter Variable 300→590) usado *como herramienta de jerarquía* — cuerpo ligero, un peso "de firma" (510) para texto interactivo, semibold (590) solo para énfasis puntual. La jerarquía no depende solo del tamaño.
- **Densidad consistente**: filas de lista, de tabla y de formulario comparten el mismo ritmo vertical (32px o 40px) en toda la app — pocas densidades, aplicadas siempre igual, nunca una tercera medida improvisada.
- Paleta mayormente neutra **con un único acento de marca** (a menudo violeta) usado como puntuación — para el elemento seleccionado, el enlace, el botón primario — nunca repartido en varios colores decorativos.
- Principio explícito de "linearidad": minimizar el número de decisiones visuales simultáneas — una sola dirección de lectura, una secuencia ordenada de secciones, para reducir carga cognitiva.

Fuentes: [Linear design: the SaaS design trend — LogRocket](https://blog.logrocket.com/ux-design/linear-design/), [Design System Analysis: Linear — getdesign.md](https://getdesign.md/linear.app/design-md).

### Duolingo

- **Un color, un significado, sin excepciones**: verde = correcto, rojo = error/vidas, naranja = racha, amarillo = XP, morado = ligas. Nunca dos conceptos comparten color ni un color se reutiliza fuera de su significado fijo.
- Los números de progreso (racha, XP, porcentaje) se tratan como **tipografía de exhibición** — grandes, en negrita, primer plano visual — no como texto pequeño al margen. El progreso del usuario es contenido de primera clase, no metadato secundario.
- Botones "chunky" con un borde inferior más oscuro (efecto "labio") que se colapsa al pulsar — microinteracción táctil que da sensación de peso físico al control principal.
- **Lección aplicable con matiz:** el tono lúdico/infantil no encaja con esta app (contenido legal denso, un solo usuario adulto preparando una plaza) — no se recomienda importar el estilo visual. Pero el principio de "un color = un significado fijo" ya lo cumplimos (§1 de `notas-de-diseno.md`, cada estado con su par propio) y el de "el progreso es contenido de primera clase" es justo lo que hoy nos falta (ver §2 más abajo).

Fuentes: [Duolingo: Gamification as Design Language — Blake Crosley](https://blakecrosley.com/guides/design/duolingo), [Duolingo UX Breakdown — 925 Studios](https://www.925studios.co/blog/duolingo-design-breakdown).

### Brilliant.org

- Combina UI + ilustración + motion con un "Level Gameboard" que visualiza el progreso del alumno a través de un mapa de lecciones, no solo una barra o un porcentaje.
- Ilustración propia consistente (estilo "PIX", geométrico) y animaciones de celebración al completar una lección.
- **Lección aplicable con matiz:** el mismo caso que Duolingo — la ilustración/personaje/celebración no es el registro de esta app. Lo rescatable en abstracto es la idea de un **mapa visual de cobertura del temario** (qué se ha estudiado, qué falta, agrupado espacialmente) en vez de solo una lista — aplicable a `/estudio/tema` o a una futura vista de progreso, sin el envoltorio lúdico.

Fuentes: [Brilliant.org x ustwo](https://ustwo.com/work/brilliant/), [How Brilliant.org motivates learners with Rive animations](https://rive.app/blog/how-brilliant-org-motivates-learners-with-rive-animations).

### Readwise Reader

- Una única vista de lectura consistente (misma tipografía, mismo sistema de resaltado, mismos atajos) independientemente del tipo de contenido (artículo, PDF, newsletter, transcripción) — el usuario no tiene que reaprender la interfaz según el formato.
- Colores de resaltado "cálidos" que imitan un rotulador físico real (amarillo suave `#FBDA83`, coral `#E4938E`, azul `#8DBBFF`) en vez de colores planos saturados de UI — busca la asociación "esto es un rotulador sobre papel", no "esto es una etiqueta de sistema".
- Control total del usuario sobre fuente, tamaño, espaciado y tema — sin imponer un "estilo correcto" de lectura, exactamente el mismo principio que ya tiene nuestro panel de preferencias de lectura (§5 de `notas-de-diseno.md`).
- **Validación cruzada, no solo inspiración:** el sistema de resaltado `ink-*` que ya diseñamos en §14 de `notas-de-diseno.md` (seis colores con fondo suave, `box-decoration-break: clone`, sin depender solo de color en badges de estado) sigue casi el mismo criterio que Readwise ya valida en producción — es una señal de que esa decisión ya tomada es sólida, no un candidato a revisar.

Fuentes: [Designing Readwise's read-it-later app — Lazer Technologies](https://www.lazertechnologies.com/case-studies/readwise), [Readwise Reader: Cosmic Branding — Blake Crosley](https://blakecrosley.com/guides/design/readwise-reader).

### Todoist

- Paleta con **un acento de marca único** (rojo `#e34432`, usado en estados de pulsación/CTA) más **cuatro "tintas de baldosa" pastel** (melocotón, menta, mantequilla, cielo) reservadas para categorizar proyectos/etiquetas a simple vista — un acento funcional + un pequeño set de tintes de categorización, no una paleta arcoíris.
- Radios de esquina anclados en 8px, escala de espaciado de 4 a 64px, tipografía de exhibición (Graphik) distinta de la de cuerpo (Inter) — mismo patrón de "dos familias, un rol cada una" que ya tenemos decidido para el modo manuscrito (Caveat/Kalam) pero que no existe en el modo digital normal.
- Listas de texto con jerarquía natural (tamaño/peso) más puntos de color para prioridad — la lista sigue siendo una lista, el color es un acento discreto sobre ella, no un rediseño completo del ítem.

Fuentes: [Todoist Design System — shadcn.io](https://www.shadcn.io/design/todoist), [What Todoist Does Well — Medium/NYC Design](https://medium.com/nyc-design/what-todoist-does-well-and-what-could-be-made-better-a-ui-ux-critique-94b18ce111b0).

### Obsidian (tema Minimal)

- El tema más usado de la comunidad se llama literalmente "Minimal" y su filosofía es **ocultar todo lo que no se está usando activamente**: scrollbars, tooltips, barra de estado, nombre de carpeta raíz — el menú aparece solo al pasar el ratón por una esquina.
- Paneles laterales que fusionan metadatos relacionados en una sola vista (outline + propiedades) en vez de repartirlos en pestañas separadas, para que el contexto se vea de un vistazo sin cambiar de panel.
- **Lección aplicable:** confirma que la dirección ya tomada por nuestro sistema (NavShell con tres densidades, modo concentración que reduce el chrome a un botón) va en la línea correcta — Obsidian lleva ese principio más lejos (chrome casi invisible hasta que se necesita) de lo que hace hoy nuestro modo "iconos" o "visible" por defecto.

Fuentes: [Minimalism UI — Obsidian community plugin](https://community.obsidian.md/plugins/minimalism-ui), [Minimal theme for Obsidian — GitHub](https://github.com/toiq/obsidian-minimal).

### Apps españolas de oposiciones (OpositaTest, iOpositores/iOpositer, InnoTest, Testeando)

Búsqueda con resultado honesto: **no se ha encontrado ningún análisis o teardown visual de estas apps** — todas las fuentes disponibles (blogs de academias, comparativas SEO, reseñas de tienda de apps) hablan de contenido (volumen de preguntas, actualización a convocatorias recientes, historial de fallos, filtros, notificaciones de seguimiento de progreso) y nunca de diseño visual como diferenciador. Esto en sí mismo es un dato: en este nicho, la vara de calidad visual percibida por los usuarios es baja y no es donde compiten estas apps — no hay patrones de pulido visual que valga la pena "importar" de aquí. Lo único rescatable son ideas *estructurales* mencionadas de pasada (historial de fallos filtrable, notificaciones de seguimiento de progreso) como candidatos funcionales a futuro, no como referencia de estética.

Fuentes: [OpositaTest Opiniones 2026 — Oposiciones Hoy](https://oposicioneshoy.es/opositatest-opiniones/), [OPOSITER — 5 aplicaciones para estudiar oposiciones](https://www.opositer.edu.es/blog/5-aplicaciones-para-estudiar-oposiciones/).

### Quizlet

Búsqueda sin resultado útil: las consultas devolvieron mayoritariamente sets de flashcards *sobre* UI/UX (contenido generado por usuarios de Quizlet estudiando diseño), no documentación ni análisis del propio producto. No se incluye ningún patrón de Quizlet en las recomendaciones de más abajo por falta de fuente verificable — se deja constancia de la búsqueda en vez de rellenar el hueco con memoria no verificada, siguiendo el mismo criterio que ya usa este proyecto en `specs/018-perfil-oposicion/investigacion-datos.md` ("un hueco documentado es un resultado válido").

---

## 2. Dónde se nota que el diseño actual "no está muy conseguido" (comparación honesta)

Cada punto está anclado a un fichero/componente real, no a una impresión general.

### 2.1. Cero color de acento — todo lo interactivo se ve igual que todo lo estático

`app/globals.css` define 5 tokens neutros + 9 pares de estado semántico (núcleo/bookmark/revisión/ejemplo/excepción/atención), pero **ningún token de acento de marca/interacción**. Consecuencia visible en el código real:

- La pestaña activa de `SeccionesConcepto.tsx` se marca con `border-b-2 border-texto-primario` — el mismo color que usa el texto normal del cuerpo.
- La entrada de navegación activa en `NavIconos.tsx` se marca solo con `bg-bg-secundario` — el mismo fondo que ya usan las cajas de "Texto oficial" y los paneles.
- No hay ningún elemento en toda la app (según lo leído en `app/estudio/**`, `components/nav/**`, `components/estudio/**`) que use un color *distinto* de los tokens neutros/de estado para decir "esto es interactivo" o "esto es la marca".

Linear, Todoist y Notion coinciden en un mismo patrón que nosotros no tenemos: un acento único, reservado, aplicado siempre a los mismos roles (seleccionado, interactivo primario, marca). Lo llamativo es que **la propia `notas-de-diseno.md` (§8, "Candidatos de tokens diferidos") ya identificó esto** al evaluar y descartar `Primary`/`Secondary` del documento de paleta de Diego por no llegar a 4.5:1 — pero de los tres candidatos, `Primary dark` (`#1E3A5F`, "Academic Navy") **sí pasa** con margen amplio (11:1 contra `bg-primario`) y hoy no se usa en ningún sitio. Es una decisión ya tomada y verificada que simplemente no se ha aplicado todavía — no hay que reabrir la investigación de contraste, solo decidir dónde aplicarlo.

### 2.2. El catálogo de temas es justo el ejemplo que anticipaba el encargo

`app/estudio/tema/page.tsx` (líneas 16–28): una `<ul>` de `<li>` con `rounded-md border border-borde px-4 py-3` idéntico para los ~N conceptos del catálogo, sin agrupar por bloque/materia, sin encabezados de sección, con la única señal de "núcleo común" un badge amarillo al final de la fila. Un concepto de núcleo común y uno específico de una sola oposición se ven visualmente idénticos salvo por ese badge pequeño a la derecha — no hay peso, tamaño ni agrupación que comunique "esto es más rentable estudiarlo primero" de un vistazo, que es justo lo que el propio contenido de la página (`{concepto.titulo}`) querría transmitir.

Comparación concreta: Notion agrupa vistas de base de datos por propiedad con encabezados de grupo (potencialmente sticky, mismo patrón sticky que ya usamos en `SeccionesConcepto`); Todoist usa tintas de categoría discretas para que un proyecto se reconozca por color antes de leer su nombre. Aquí no existe ningún mecanismo de agrupación visual — es una lista plana con apariencia de formulario, no de catálogo curado.

### 2.3. `/estudio` (home de la sección) trata dos modelos mentales distintos con el mismo peso visual

`app/estudio/page.tsx`: "Por oposición" y "Por tema" son dos formas de entrar al mismo contenido con propósitos distintos (una sigue la numeración oficial de un proceso, la otra evita repetir lo compartido) pero se renderizan como dos columnas gemelas con el mismo `<h2>`, el mismo párrafo descriptivo y el mismo estilo de tarjeta — no hay jerarquía que sugiera cuál usar primero ni qué las diferencia visualmente más allá del texto.

### 2.4. Cero elevación — todo se diferencia solo con `border`, nunca con sombra

Una búsqueda en `app/globals.css` confirma que no existe ninguna declaración `box-shadow` fuera del `::backdrop` de los `<dialog>`. Cada superficie —tarjeta de catálogo, panel de preferencias, caja de "Texto oficial", el propio `<dialog>` de navegación móvil— se distingue del fondo únicamente por un `border-borde` de 1px o un cambio de `bg-secundario`. Notion (sombra multicapa de opacidad baja) y, en menor medida, cualquier sistema de "tarjeta" moderno usan elevación sutil precisamente para dar sensación de profundidad/capas sin depender solo del borde. El resultado actual, sin ninguna sombra en todo el sistema, es plano de una forma que se nota — más cerca de un formulario HTML estilizado que de una app con jerarquía espacial.

### 2.5. Jerarquía tipográfica solo por tamaño, nunca por peso

`notas-de-diseno.md` §2 fija `h1: 1.75rem / h2: 1.375rem / h3: 1.125rem`, **todos con el mismo `font-weight: 600`** (confirmado también en el h1 de `app/estudio/tema/[conceptoId]/page.tsx`, `text-2xl font-semibold`, y en los h2 de `SeccionesConcepto.tsx`, `text-lg font-medium` — de hecho ni siquiera comparten el mismo peso entre sí de forma sistemática, 600 en un sitio y 500 en otro). Notion y Linear varían el peso deliberadamente como parte de la escala (Notion: 500/600 según nivel con compresión de `letter-spacing` en tamaños grandes; Linear: rango completo 300–590 de Inter Variable). Aquí el título de una página se distingue del cuerpo solo por ser "un poco más grande", nunca por sentirse tipográficamente como un titular.

### 2.6. Icono/wordmark de marca: placeholder literal, no un mark real

`components/nav/NavIconos.tsx` línea 30: el logo/enlace a inicio es un `<Link>` con el texto literal `GSW` sin ningún tratamiento tipográfico especial (mismo `rounded-md p-2` que cualquier otro botón del rail). Es, textualmente, un placeholder de tres letras — no aporta identidad de marca ni ancla visual, y es lo primero que se ve en cualquier densidad de navegación con rail (que es el default en tablet, el dispositivo principal). Contraste con cualquiera de las referencias: todas tienen un mark reconocible en la esquina superior, por simple que sea.

### 2.7. Set de iconos propio, consistente pero poco distintivo — riesgo real porque tablet usa el modo "solo iconos" por defecto

`components/nav/iconos.tsx` define un set de iconos SVG propios, coherente en trazo (stroke 1.6, sin relleno) — correcto como principio, pero visualmente poco diferenciado entre sí: `IconoInformacion` e `IconoPregunta` son ambos un círculo con un punto inferior, diferenciados solo por un trazo interior pequeño (línea recta vs. forma de interrogación). En el modo de densidad **"iconos"**, que es el default explícito para tablet según `notas-de-diseno.md` §3 ("Hay espacio de sobra... pero las etiquetas de texto completas no son imprescindibles"), estos son los únicos elementos visibles para identificar cada sección — si dos iconos se confunden a un vistazo rápido en el dispositivo que Diego más usa, el coste de esa ambigüedad es más alto aquí que en cualquier otro breakpoint.

### 2.8. El progreso del usuario existe como dato pero no como imagen

El sistema ya tiene datos reales de progreso: `lib/progreso-lectura.ts` (posición de scroll por concepto), la tabla `bookmark` (marcadores), `esNucleoComun`/`getConceptosEnAlcance` (cobertura del temario). Ninguno de estos datos se visualiza nunca como conjunto — no hay ningún punto en la app donde Diego vea "cuánto llevo", "qué me falta del núcleo común" o "cuántos conceptos tengo marcados" de un vistazo. `ProgresoLectura.tsx` (la barra sticky) es deliberadamente mínima y solo vive dentro de un concepto ya abierto (correcto para su propósito, ver `notas-de-diseno.md` §10 — "no hay checkmark de completado, no hay porcentaje de dominio"), pero eso es distinto de no tener *ningún* resumen agregado en ningún sitio. Duolingo, Brilliant y Todoist coinciden en tratar el progreso agregado como contenido visual de primera clase; aquí ni siquiera existe la pantalla donde podría vivir.

### 2.9. Lo que ya está conseguido y no hay que tocar

Para que la lista anterior no se lea como "todo está mal" — comparado con las referencias, estas decisiones ya tomadas están a la altura y no son la causa del problema que señala Diego:

- El sistema de tokens de color en sí (`app/globals.css`, tres temas, contraste WCAG verificado par por par) es más riguroso que lo que la mayoría de estas referencias documentan públicamente.
- El patrón de tabs + scrollspy + tratamiento de caja diferenciado por sección (`SeccionesConcepto.tsx`) resuelve exactamente el problema que RemNote resuelve mal (todo junto y abarrotado) y que Readwise resuelve bien (consistencia entre tipos de contenido).
- El sistema de resaltado de contenido `ink-*` (§14) sigue el mismo criterio que valida Readwise en producción.
- Los estados "sin escribir" / "en revisión" (borde discontinuo vs. sólido, banner nunca bloqueante) son más cuidadosos que el tratamiento que suelen dar apps comerciales a sus estados vacíos.
- El principio de reducir el chrome en modo concentración va en la misma dirección que el tema Minimal de Obsidian, con margen para llevarlo más lejos si hiciera falta, pero no está mal encaminado.

El problema que señala Diego no es la base (tokens, temas, estructura de navegación) — es la superficie: ausencia de acento, ausencia de elevación, agrupación visual plana en listas de contenido, jerarquía tipográfica por tamaño únicamente, y una marca sin identidad propia.

---

## 3. Dirección de rediseño propuesta — priorizada por impacto/esfuerzo, tablet-first

Ninguna de estas propuestas sustituye el sistema de diseño existente — todas se construyen encima de los tokens y decisiones ya aprobadas en `specs/003-sistema-de-diseno/`. El orden es deliberado: primero lo que cambia más percepción visual con menos riesgo estructural.

| # | Propuesta | Esfuerzo | Por qué primero/después |
|---|---|---|---|
| **P1** | Activar `--acento-fuerte` (`#1E3A5F`/`#D590A5` dark — reutilizar el mismo valor y método ya usado para `--acento-titulo` del modo manuscrito, que es literalmente el mismo color) como token de interacción, aplicado a: pestaña activa de `SeccionesConcepto`, entrada de nav activa, foco/hover de elementos interactivos clave. | Muy bajo — un token ya verificado en contraste (§8 de `notas-de-diseno.md`), aplicado en ~4-5 sitios puntuales, sin tocar estructura de ningún componente. | Máximo impacto visual (es la diferencia entre "se ve como un formulario" y "se ve como una app") al mínimo esfuerzo posible — y es una decisión que la propia spec ya dejó lista para activar. |
| **P2** | Añadir elevación sutil (`box-shadow` de 1-2 capas, opacidad baja, patrón Notion) a tarjetas de catálogo, panel de preferencias y `<dialog>`. | Bajo — CSS puro sobre clases ya existentes, cero cambios de lógica. | Se apoya en los mismos tokens de color, no compite con P1, y es puramente aditivo — no hay riesgo de romper nada ya construido. |
| **P3** | Diseñar un wordmark/mark mínimo para sustituir el placeholder `GSW` de `NavIconos`/`NavVisible`/`NavHamburguesa` — puede ser tan simple como una inicial tratada tipográficamente con el nuevo acento de P1. | Bajo — un componente pequeño, sin lógica nueva. | Cierra la sensación de "placeholder sin terminar" que es la más visible de las tres variantes de navegación, y depende de tener ya el acento de P1 definido. |
| **P4** | Reescalar la jerarquía tipográfica de encabezados con variación de *peso* además de tamaño (p. ej. h1 más pesado que h2/h3, unificar el criterio entre páginas — hoy varía entre `font-semibold`/`font-medium` sin patrón documentado) y evaluar compresión de `letter-spacing` en tamaños grandes. | Bajo-medio — toca varias páginas (`app/estudio/**`) pero es un cambio de clases Tailwind, no de estructura. | Refuerza P1/P2 dándole a los títulos peso propio; conviene hacerlo una vez decidido el acento (un h1 más pesado se beneficia de poder usar el acento en algún elemento cercano). |
| **P5** | Agrupar el catálogo de temas (`app/estudio/tema/page.tsx`) por bloque/materia con encabezados de grupo (reutilizando el patrón sticky ya construido en `SeccionesConcepto`), y diferenciar núcleo común por algo más que un badge al final de la fila (peso de fila, o el acento de P1 en el borde izquierdo). | Medio — requiere que `lib/temario.ts` exponga una agrupación por bloque si no existe ya; es un cambio real de estructura de la página, no solo estilo. | Depende de tener P1 disponible para el tratamiento de núcleo común; es el cambio más "de producto" de la lista, así que va después de los puramente visuales. |
| **P6** | Redibujar los 2-3 iconos del set (`components/nav/iconos.tsx`) que hoy son más ambiguos entre sí (`IconoInformacion`/`IconoPregunta`) con más carácter propio — sin añadir una librería de iconos nueva, mismo criterio de "sin dependencias nuevas" que ya sigue el proyecto. | Medio — son SVGs a mano, iterar el trazo lleva tiempo de diseño aunque no de arquitectura. | Es una mejora real pero de riesgo bajo y beneficio acotado al modo "iconos" — no bloquea nada de lo anterior, puede ir en paralelo o después. |
| **P7** (opcional, más largo plazo) | Una superficie visual de progreso agregado (cobertura del temario, marcadores, quizá una futura racha de estudio) en `/estudio` o en el panel de navegación, a partir de datos que ya existen (`bookmark`, `progreso-lectura`, `esNucleoComun`). | Alto — no es solo CSS, requiere agregación de datos y decidir dónde vive esa vista; probablemente merece su propia spec en vez de colarse en un rediseño visual. | Es la única propuesta que no es "solo maquetación" — se deja explícitamente para el final y como candidato a spec propia, no a ejecutar dentro de un rediseño puramente visual. |

**Qué se propone NO reabrir:** la paleta de color base (Academic Blue/Focused Night, ya verificada y con trabajo de contraste invertido en ella), el modelo de tres densidades de navegación, el patrón de tabs+scrollspy de `SeccionesConcepto`, y los cuatro estados especiales (núcleo común, bookmark, sin escribir, en revisión). Son las partes de `specs/003-sistema-de-diseno/` que ya están a la altura de las referencias investigadas — el rediseño que hace falta es de superficie (acento, elevación, jerarquía tipográfica, agrupación visual, identidad de marca), no de arquitectura.
