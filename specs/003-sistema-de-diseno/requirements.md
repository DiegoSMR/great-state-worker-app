# Requirements: Sistema de diseño (legibilidad, navegación y temas)

Fase: 1 — Requirements. Estado: **aprobado** (revisión 2 — incorpora `MEJORAS.md` y alineación con `PRODUCT-VISION.md`; decisiones aprobadas por Diego el 2026-09-14).
Última actualización: 2026-09-14

## Resumen

Diego usa la app sobre todo en tablet para leer contenido legal/normativo denso durante sesiones largas. Hoy la app es dolorosa a la vista (contraste roto entre el tema oscuro del sistema operativo y colores de texto fijos pensados para fondo claro), no tiene navegación persistente en ningún tamaño de pantalla, y no ofrece control real sobre el tema visual ni sobre cómo se ve el texto. Esta feature transversal resuelve esos problemas y, además, sienta las bases de interacción (perfil de lectura extensible, modelo de estados de contenido, navegación local) sobre las que crecerán las fases posteriores del producto (`PRODUCT-VISION.md`: progreso de estudio, flashcards, repaso, planificación) sin que esta spec tenga que construir esas fases.

La aplicación no debe sentirse como una web que contiene apuntes. Debe sentirse como una **herramienta de estudio diseñada para leer, comprender, repasar y volver rápidamente a información normativa**.

## Objetivo de experiencia: tres actividades de estudio

El sistema de diseño debe optimizar tres actividades distintas. No todas requieren funcionalidad completa en `003` (ver qué queda para v1 en cada requisito), pero las tres deben formar parte del objetivo de diseño desde ahora, para no diseñar componentes que luego haya que rehacer:

- **Primera pasada — comprender:** tipografía cómoda, ancho de línea controlado, interlineado generoso, jerarquía clara, navegación disponible sin invadir el contenido.
- **Repaso — recuperar:** esquema y resumen extenso fácilmente accesibles, salto directo a una sección, lectura más compacta si el usuario lo pide.
- **Consulta rápida — localizar:** índice del concepto, indicadores claros de dónde está el usuario, enlaces a fuentes normativas, vuelta exacta al punto donde estaba leyendo.

## Requisito 1: Contraste y legibilidad

**Historia:** Como usuario, quiero que el texto tenga siempre contraste suficiente frente a su fondo, en cualquier tema, para poder leer contenido denso durante sesiones largas sin fatiga ni dolor de ojos.

**Criterios de aceptación:**
1. CUANDO se muestra texto de cuerpo (párrafos, listas, metadatos) sobre su fondo, en tema claro o en tema oscuro, ENTONCES el sistema DEBERÁ mantener una relación de contraste de al menos 4.5:1 (WCAG AA para texto normal).
2. CUANDO se muestra texto grande (títulos, encabezados de sección) sobre su fondo, en tema claro o en tema oscuro, ENTONCES el sistema DEBERÁ mantener una relación de contraste de al menos 3:1 (WCAG AA para texto grande).
3. CUANDO el usuario cambia de tema (claro/oscuro) ENTONCES el sistema DEBERÁ actualizar de forma coherente todos los colores de texto, fondo y borde de la pantalla visible — nunca DEBERÁ quedar un color de un tema mezclado con el fondo del otro.
4. CUANDO se diseña cualquier color de texto secundario o metadato ENTONCES el sistema NO DEBERÁ reutilizar el mismo valor de gris para ambos temas invirtiendo solo el fondo — cada tema DEBERÁ tener su propia escala de grises calibrada para su propio fondo.
5. CUANDO se definen los colores de estados interactivos (hover, focus, active, controles deshabilitados, enlaces, selección, indicadores de progreso, mensajes temporales, superficies anidadas, bordes que transmiten información) ENTONCES el sistema DEBERÁ verificar su contraste igual que el texto de cuerpo — no basta con validar solo el par texto/fondo estático.

## Requisito 2: Navegación global responsive por niveles de densidad

**Historia:** Como usuario, quiero un sistema de navegación persistente cuya base funcione bien en cualquier pantalla pequeña y que reciba su mayor pulido en tablet y escritorio (mi uso real), y quiero poder elegir cuánto espacio ocupa ese menú en cualquier tamaño de pantalla, para moverme por la app sin depender de enlaces "volver" sueltos y sin que la navegación me robe espacio de lectura cuando no lo necesito.

**Criterios de aceptación:**
1. CUANDO se construye el sistema de navegación ENTONCES el sistema DEBERÁ definirse primero para el breakpoint móvil (metodología mobile-first / progressive enhancement) y extenderse hacia tablet y escritorio a partir de esa base — nunca al revés.
2. CUANDO el usuario abre la app en tablet o en escritorio (los tamaños de uso real prioritario de Diego, ver `CONTEXT.md`) ENTONCES el sistema DEBERÁ recibir en esos tamaños el mayor nivel de pulido visual y de interacción, una vez que la base móvil funciona correctamente.
3. CUANDO el usuario abre la app en cualquier tamaño de pantalla ENTONCES el sistema DEBERÁ ofrecer un menú de navegación con tres **niveles de densidad** seleccionables: `collapsed` (oculto tras icono, se abre como overlay sobre el contenido), `compact` (rail visible, prioriza iconos sobre etiquetas) y `expanded` (visible con máxima claridad de cada entrada, iconos con etiqueta de texto). **Cambio respecto a la v1 de este documento:** se deja de exigir explícitamente "hamburguesa / iconos / visible" como solución de interfaz obligatoria — eso es una propuesta concreta que vive en `notas-de-diseno.md` y que `design.md` puede materializar como hamburguesa/rail/sidebar o de otra forma, siempre que resuelva los tres niveles de densidad. Ver "Decisiones pendientes de aprobación" al final de este documento.
4. CUANDO el usuario no ha elegido manualmente un nivel de densidad ENTONCES el sistema DEBERÁ aplicar un nivel por defecto razonable según el tamaño de pantalla (propuesta concreta en `notas-de-diseno.md`).
5. CUANDO el usuario cambia manualmente el nivel de densidad del menú ENTONCES el sistema DEBERÁ aplicar ese nivel de inmediato, en cualquier tamaño de pantalla, independientemente de cuál sea el default de ese breakpoint.
6. CUANDO el usuario ha elegido manualmente un nivel de densidad ENTONCES el sistema DEBERÁ recordar esa elección entre sesiones, con el mismo criterio de persistencia que la preferencia de tema (Requisito 3).
7. CUANDO el usuario navega entre pantallas usando el menú de navegación, en cualquiera de sus tres niveles de densidad ENTONCES el sistema DEBERÁ indicar en qué sección se encuentra actualmente.
8. CUANDO se diseña la lista de entradas del menú ENTONCES el sistema DEBERÁ maquetarse asumiendo que crecerá de 2 a 4-5 entradas (Estudio, Pruebas, Flashcards, Planificador, Marcadores — ver `PRODUCT-VISION.md` §4) sin rediseñar el componente, solo añadiendo filas.

## Requisito 3: Selector de tema explícito y extensible

**Historia:** Como usuario, quiero elegir explícitamente el tema visual de la app (no depender de la preferencia del sistema operativo), que mi elección se recuerde, y que el sistema esté preparado para más temas en el futuro.

**Criterios de aceptación:**
1. CUANDO el usuario accede a la app por primera vez ENTONCES el sistema DEBERÁ mostrar un tema por defecto sin requerir que el usuario lo configure, pero DEBERÁ dejar visible y accesible un control para cambiarlo explícitamente.
2. CUANDO el usuario selecciona un tema desde el control de selección ENTONCES el sistema DEBERÁ aplicar ese tema de inmediato a toda la app, independientemente de la preferencia del sistema operativo del dispositivo.
3. CUANDO el usuario vuelve a abrir la app en una sesión posterior ENTONCES el sistema DEBERÁ recordar y aplicar el último tema elegido explícitamente.
4. CUANDO se diseña el modelo de datos/estado del tema seleccionado ENTONCES el sistema NO DEBERÁ representarlo como un valor binario claro/oscuro — DEBERÁ representarlo de forma que añadir un tercer tema (o más) en el futuro no requiera cambiar su forma, solo añadir una opción nueva.
5. CUANDO se listan las opciones del selector ENTONCES el sistema DEBERÁ mostrar cada tema con un nombre identificable (no solo un icono o un interruptor sin etiqueta).

## Requisito 4: Navegación y estructura local dentro de un concepto

**Historia:** Como usuario, quiero distinguir a simple vista si estoy leyendo el texto oficial transcrito, el material adaptado o el resumen de un concepto, ver la estructura completa del concepto y moverme entre sus partes sin perderme, para orientarme dentro de un tema largo tanto si lo estoy leyendo por primera vez como si vuelvo a repasarlo.

**Criterios de aceptación:**
1. CUANDO el usuario está leyendo cualquier punto del contenido de un concepto ENTONCES el sistema DEBERÁ indicar en todo momento, de forma visible, cuál de las tres partes (texto oficial / material adaptado / resumen) está viendo.
2. CUANDO el usuario quiere ir directamente a otra de las tres partes, o a `Esquema`/`Resumen extenso` dentro del resumen ENTONCES el sistema DEBERÁ ofrecer un mecanismo de navegación directo (sin depender de hacer scroll manual por todo el contenido) que lo lleve a esa parte.
3. CUANDO se muestran las tres partes del contenido ENTONCES el sistema DEBERÁ darles un tratamiento visual distinguible entre sí (más allá de solo el título de la sección), de forma que el usuario pueda reconocer cuál está leyendo incluso sin fijarse en el encabezado.
4. CUANDO el resumen de un concepto se muestra ENTONCES el sistema DEBERÁ mantener distinguibles entre sí sus dos subpartes (esquema y resumen extenso), consistente con el resto de la jerarquía visual del punto 3.
5. CUANDO el usuario quiere volver al principio del concepto desde cualquier punto de scroll ENTONCES el sistema DEBERÁ ofrecer una forma directa de hacerlo.
6. CUANDO el usuario usa la navegación local en tablet o móvil ENTONCES el sistema DEBERÁ ofrecer un control cómodo para el tamaño de pantalla (p. ej. índice persistente en tablet/escritorio, control compacto tipo "Contenido del tema" en móvil) — la solución visual concreta queda para `design.md`.
7. CUANDO la navegación local está activa ENTONCES el sistema DEBERÁ mantenerla como un nivel de navegación independiente del menú de navegación global (Requisito 2) — ambos DEBERÁN poder convivir sin competir por el mismo espacio visual ni confundirse entre sí.

## Requisito 5: Modelo de estados de contenido y estado "sin escribir"

**Historia:** Como usuario, quiero que el estado de un concepto sin contenido todavía redactado sea inconfundible con un error o un hueco en blanco, y quiero poder ver de un vistazo qué partes de un concepto parcial ya existen y cuáles faltan, para saber que es una ausencia conocida y no un fallo de la app.

**Criterios de aceptación:**
1. CUANDO el usuario abre un concepto cuyo contenido todavía no existe ENTONCES el sistema DEBERÁ mostrar un estado visual explícito y reconocible como "pendiente de redactar", nunca una página en blanco, rota o indistinguible del estado de carga/error.
2. CUANDO se compara el estado "sin escribir" con el resto de la app ENTONCES el sistema DEBERÁ darle un tratamiento visual (color, borde, iconografía) que en ningún caso comparta el lenguaje visual usado para errores del sistema.
3. CUANDO se compara el estado "sin escribir" con el estado "normativa en revisión" (Requisito 6) ENTONCES el sistema DEBERÁ diferenciarlos claramente entre sí — no DEBERÁN compartir el mismo color ni el mismo patrón visual, dado que representan situaciones distintas (ausencia total de contenido frente a contenido existente pendiente de una revisión puntual).
4. CUANDO se modela el estado de un concepto ENTONCES el sistema DEBERÁ distinguir conceptualmente disponibilidad de contenido (`empty` / `partial` / `available` / `complete`) de revisión normativa (Requisito 6) — no DEBERÁ representarlos con el mismo campo ni el mismo booleano, aunque en v1 solo se implementen los valores estrictamente necesarios para los casos reales de hoy (sin escribir vs. disponible).
5. CUANDO un concepto está `partial` (existe alguna pieza pero no todas) ENTONCES el sistema DEBERÁ mostrar un indicador de completitud que liste qué piezas existen y cuáles faltan (p. ej. Texto oficial ✓, Material adaptado ✓, Esquema …, Resumen extenso …), en vez de tratarlo igual que un concepto totalmente vacío.

## Requisito 6: Estado "normativa desactualizada, en revisión"

**Historia:** Como usuario, quiero que, cuando el agente `verificador-vigencia-normativa` marque un concepto como pendiente de revisión de vigencia normativa, la vista de ese concepto me lo indique de forma visible pero tranquila, para saber que el contenido puede estar desactualizado sin que deje de ser consultable ni se trate como un error.

**Criterios de aceptación:**
1. CUANDO un concepto está marcado como pendiente de revisión de vigencia normativa ENTONCES el sistema DEBERÁ mostrar un indicador visual visible en la vista de ese concepto.
2. CUANDO se muestra el indicador de "en revisión" ENTONCES el sistema NO DEBERÁ usar lenguaje, iconografía ni color asociados a error o alarma (p. ej. rojo, símbolos de advertencia crítica) — DEBERÁ transmitir un tono informativo y tranquilo.
3. CUANDO un concepto está marcado como "en revisión" ENTONCES el sistema DEBERÁ seguir mostrando el contenido completo del concepto sin ocultarlo ni bloquearlo.
4. CUANDO se compara el indicador de "en revisión" con el estado "contenido sin escribir" (Requisito 5) ENTONCES el sistema DEBERÁ usar un color y un patrón visual distintos de los usados para ese otro estado, de forma que ambos sean identificables sin ambigüedad incluso para quien no ha leído ninguna explicación previa.
5. Nota de modelo: "en revisión" es el único valor de `not_checked` / `verified` / `needs_review` que esta versión necesita representar visualmente; el modelo conceptual completo de revisión normativa queda documentado para referencia futura, no exige construir un selector de tres estados en v1.

## Requisito 7: Consistencia de badges y estados especiales en ambos temas

**Historia:** Como usuario, quiero que los indicadores de núcleo común y de bookmark se vean igual de claros en tema claro y en tema oscuro, para no perder esa información al cambiar de tema.

**Criterios de aceptación:**
1. CUANDO se muestra el badge de "núcleo común" ENTONCES el sistema DEBERÁ mantener contraste WCAG AA entre su texto y su fondo, tanto en tema claro como en tema oscuro.
2. CUANDO se muestra el botón/indicador de bookmark, marcado o sin marcar ENTONCES el sistema DEBERÁ mantener contraste WCAG AA entre su contenido y su fondo, tanto en tema claro como en tema oscuro.
3. CUANDO el usuario cambia de tema con un badge o estado especial visible en pantalla ENTONCES el sistema DEBERÁ actualizar sus colores de forma coherente con el resto de la interfaz, sin quedar con un aspecto "roto" o de contraste insuficiente respecto al tema recién aplicado.
4. CUANDO se diseña o se retoca el significado del bookmark ENTONCES el sistema NO DEBERÁ sobrecargarlo con significados adicionales ("estudiado", "necesita repaso", "dominado", etc.) — DEBERÁ conservar su significado actual y único ("quiero volver a este concepto"), dejando esos estados adicionales para una spec futura de progreso/repaso (`PRODUCT-VISION.md` fases 3-5) que los modele por separado.

## Requisito 8: Perfil de lectura extensible

**Historia:** Como usuario, quiero poder ajustar el tamaño de letra del contenido de estudio, con un modelo preparado para añadir más ajustes de lectura en el futuro, para reducir la fatiga visual en sesiones largas de lectura densa.

**Criterios de aceptación:**
1. CUANDO el usuario accede al panel de configuración de lectura ENTONCES el sistema DEBERÁ ofrecer un control para ajustar el tamaño de letra del contenido, con varios niveles disponibles (propuesta concreta en `notas-de-diseno.md`).
2. CUANDO el usuario ajusta el tamaño de letra ENTONCES el sistema DEBERÁ aplicar el cambio de inmediato a todo el contenido de lectura visible, sin recargar la página.
3. CUANDO el usuario ha ajustado el tamaño de letra ENTONCES el sistema DEBERÁ recordar esa elección entre sesiones, con el mismo criterio de persistencia que la preferencia de tema (Requisito 3) y el nivel de densidad de navegación (Requisito 2).
4. CUANDO se diseña el modelo de datos/estado de la configuración de lectura ENTONCES el sistema NO DEBERÁ representarlo como un único valor aislado de tamaño de letra — DEBERÁ representarlo como un objeto `readingSettings` extensible (tamaño de letra en v1; candidatos futuros: interlineado, ancho de columna, separación entre párrafos, densidad de interfaz, tipografía de lectura, presets como "Cómodo"/"Compacto") de forma que añadir un control nuevo en el futuro no requiera cambiar la forma de los ajustes ya existentes ni migrar los valores ya guardados.
5. CUANDO el usuario cambia el tamaño de letra ENTONCES el sistema DEBERÁ seguir cumpliendo el contraste WCAG AA definido en el Requisito 1 en todos los niveles disponibles — el ajuste de tamaño no DEBERÁ depender de reducir el contraste de color para funcionar.
6. Nota de alcance: los presets combinados ("Cómodo", "Equilibrado", "Compacto", "Grande") y los controles más allá de tamaño de letra son candidatos documentados, no obligación de v1.

## Requisito 9: Modo concentración (preparado en v1, no necesariamente completo)

**Historia:** Como usuario, quiero una forma explícita de reducir distracciones durante una sesión de lectura larga, para que el contenido sea protagonista y la interfaz desaparezca sin perder el contexto de dónde estoy.

**Criterios de aceptación:**
1. CUANDO el usuario activa el modo concentración ENTONCES el sistema DEBERÁ minimizar u ocultar la navegación global (Requisito 2), manteniendo visibles solo los controles imprescindibles para seguir estudiando (p. ej. salir del modo, navegación local del concepto).
2. CUANDO el modo concentración está activo ENTONCES el sistema DEBERÁ conservar el contexto del tema/concepto que se está leyendo (el usuario no DEBERÁ perder de vista en qué concepto está).
3. CUANDO el usuario quiere salir del modo concentración ENTONCES el sistema DEBERÁ ofrecer una forma fácil e inmediata de hacerlo desde cualquier punto de la pantalla.
4. **Decisión (aprobada 2026-09-14):** el modo concentración se construye completo en `003`, no solo se deja diseñado. Debe ser un estado de interfaz diseñado específicamente para lectura prolongada (no simplemente `display: none` para todo lo que no sea contenido), cumpliendo los criterios 1-3 anteriores.

## Requisito 10: Progreso de lectura (posición y continuidad, no dominio)

**Historia:** Como usuario, quiero poder continuar exactamente donde dejé la lectura de un concepto, y ver un indicador discreto de cuánto llevo recorrido, para no perder el hilo entre sesiones — sin que esto se confunda con si domino o no el concepto.

**Criterios de aceptación:**
1. CUANDO el usuario vuelve a abrir un concepto que ya había empezado a leer ENTONCES el sistema DEBERÁ restaurar automáticamente la posición de scroll donde lo dejó, sin salto brusco, y sin bloquear la lectura con un modal o diálogo de confirmación.
2. CUANDO el usuario está leyendo un concepto ENTONCES el sistema DEBERÁ mostrar un indicador discreto de progreso de lectura (cuánto ha recorrido de ese concepto concreto), sin que compita visualmente con el contenido (Requisito 13). **Decisión (aprobada 2026-09-14):** el indicador es obligatorio en v1, no opcional, y es **por concepto/página** (cada concepto lleva su propio progreso, no un progreso global de la app ni del temario).
3. CUANDO se diseña este requisito ENTONCES el sistema NO DEBERÁ confundir progreso de lectura (cuánto se ha recorrido) con progreso de aprendizaje/dominio, estado de revisión, o bookmark — son señales distintas y esta spec solo resuelve la primera. El progreso de aprendizaje real queda explícitamente fuera de `003` y se aborda en `004-progreso-estudio` (`PRODUCT-VISION.md` fase 3).

## Requisito 11: Trazabilidad de fuentes normativas

**Historia:** Como usuario, quiero poder identificar de dónde viene el contenido normativo que estoy leyendo (norma, artículo, enlace oficial) cuando sea relevante, para poder verificarlo o citarlo, aprovechando que la app ya trabaja con fuentes primarias (`fuentes:` en el frontmatter de cada concepto, ver `specs/001-seccion-estudio/design.md`).

**Criterios de aceptación:**
1. CUANDO un concepto tiene fuentes normativas asociadas en su frontmatter ENTONCES el sistema DEBERÁ ofrecer una forma de consultarlas (norma, artículo/referencia, enlace a la fuente oficial) sin que dominen visualmente la pantalla de estudio.
2. CUANDO un concepto está marcado "en revisión" (Requisito 6) ENTONCES el sistema DEBERÁ conectar visualmente ese aviso con la fuente concreta afectada, cuando el dato esté disponible.
3. CUANDO se diseña la presentación de fuentes ENTONCES el sistema NO DEBERÁ convertir cada página de estudio en una ficha burocrática — el detalle de fuente puede vivir en un elemento secundario (p. ej. expandible), no en primer plano permanente.
4. **Decisión (aprobada 2026-09-14):** este requisito se construye ya en `003`, no se pospone. El dato de fuente ya existe hoy en el frontmatter (`fuentes:`, con norma, artículo y enlace en texto libre); esta spec solo define cómo se presenta, no cambia su formato de almacenamiento.

## Requisito 12: Accesibilidad mínima

**Historia:** Como usuario, quiero que los componentes de la interfaz sean utilizables con teclado y sin depender solo del color, para que la app no bloquee mejoras de accesibilidad más adelante.

**Criterios de aceptación:**
1. CUANDO cualquier elemento interactivo recibe foco de teclado ENTONCES el sistema DEBERÁ mostrar un indicador de foco visible.
2. CUANDO se diseñan controles táctiles ENTONCES el sistema DEBERÁ dimensionarlos para interacción táctil cómoda.
3. CUANDO se comunica un estado (activo/seleccionado/error/especial) ENTONCES el sistema NO DEBERÁ depender exclusivamente del color para transmitirlo — DEBERÁ acompañarlo de forma, icono, texto o patrón de borde.
4. CUANDO se construyen acciones interactivas ENTONCES el sistema DEBERÁ usar elementos HTML semánticos (botones reales, no `div` con `onClick`) y etiquetas accesibles en iconos sin texto visible.
5. CUANDO existan animaciones o transiciones ENTONCES el sistema DEBERÁ respetar `prefers-reduced-motion`.
6. CUANDO existan menús o controles compuestos (navegación, selector de tema, panel de lectura) ENTONCES el sistema DEBERÁ permitir su uso mediante navegación por teclado.
7. Nota de alcance: el soporte exhaustivo de lectores de pantalla queda fuera de esta versión, pero la arquitectura de componentes DEBERÁ permitirlo sin rehacerse.

## Requisito 13: Jerarquía visual estable

**Historia:** Como usuario, quiero que los avisos y estados especiales complementen el contenido que vine a estudiar, no que compitan con él, para poder concentrarme en lo importante.

**Criterios de aceptación:**
1. CUANDO se diseña cualquier pantalla ENTONCES el sistema DEBERÁ respetar la jerarquía `Aplicación → Sección → Tema/Concepto → (Contexto y metadata, Texto oficial, Material adaptado, Resumen [Esquema, Resumen extenso])`.
2. CUANDO se muestra un aviso, badge o estado especial (núcleo común, bookmark, sin escribir, en revisión) ENTONCES el sistema NO DEBERÁ hacer que ese elemento parezca visualmente más importante que el contenido que el usuario vino a estudiar, salvo que exista un riesgo crítico real que lo justifique.

## Fuera de alcance

- Implementación en código de cualquiera de estos requisitos — esta spec entrega diseño y especificación, no cambios en `app/` ni `components/`.
- Temas adicionales más allá de claro/oscuro (alto contraste, sepia, por oposición, etc.) — solo se exige que el modelo de datos/estado quede preparado para ellos, no que existan en esta versión.
- Persistencia técnica concreta de las preferencias de interfaz (tema, nivel de densidad de navegación, ajustes de lectura) — cookie vs. `localStorage` vs. tabla en Postgres es una decisión de la Fase 2 (`design.md` técnico de `lead-developer`); esta spec solo exige que el resultado sea persistente entre sesiones y esté preparado para multiusuario futuro.
- Número exacto de niveles de tamaño de letra y valores en rem/px de cada nivel, y presets combinados de lectura — se propone una cifra concreta en `notas-de-diseno.md`, pero es una decisión de diseño visual, no un criterio de aceptación cerrado en este documento.
- Accesibilidad más allá del Requisito 12 (navegación completa por teclado en toda la app, soporte completo de lector de pantalla, auditoría WCAG completa) — no descartado a futuro, pero no forma parte de los criterios de aceptación de esta versión.
- Rediseño del modelo de datos del temario o del contenido — se apoya en lo ya definido en `specs/001-seccion-estudio/design.md`.
- Cualquier pantalla de `specs/002-seccion-pruebas/` — todavía no existe implementación sobre la que aplicar este sistema.
- Sistema completo de progreso de aprendizaje/dominio, estados de revisión personal (pendiente/estudiado/necesita repaso/dominado/duda), flashcards, repetición espaciada, planificación, estadísticas, recomendaciones, banco de preguntas, simulacros, convocatorias, búsqueda global avanzada — cada una tiene o tendrá su propia spec (`PRODUCT-VISION.md` §5-§9); `003` solo debe evitar decisiones que las bloqueen.
- Multiusuario real (login, cuentas separadas), aunque el diseño de tema/preferencias debe dejar hueco para ese futuro (ver `notas-de-diseno.md`).
- Offline / PWA.
- Definir cómo exactamente `verificador-vigencia-normativa` decide o comunica que un concepto necesita revisión — eso es un flujo de ese agente, no de esta spec de diseño; aquí solo se define cómo se ve el estado resultante.

## Alineación con `PRODUCT-VISION.md`

Esta spec es la Fase 1 del roadmap de producto (`PRODUCT-VISION.md` §5). Las decisiones tomadas aquí están pensadas para no bloquear las fases siguientes sin construirlas:

- El menú de navegación (Requisito 2.8) y el modelo de `readingSettings` (Requisito 8.4) están pensados como listas/objetos extensibles, no estructuras cerradas, para que `004-progreso-estudio`, `005-flashcards` y `007-sesiones-estudio` puedan añadir entradas y ajustes sin rediseñar estos componentes.
- El bookmark mantiene un significado único y estrecho (Requisito 7.4) precisamente porque `PRODUCT-VISION.md` prevé estados de usuario más ricos (pendiente/estudiado/dominado/duda) en fases posteriores — mezclarlos ahora obligaría a deshacer trabajo después.
- El modelo de estados de contenido (Requisito 5.4) separa disponibilidad de revisión normativa para que un futuro estado editorial (`draft`/`review`/`published`) no tenga que inventarse un campo nuevo desde cero.
- El progreso de lectura (Requisito 10) se limita deliberadamente a posición y continuidad, dejando dominio/aprendizaje para `004-progreso-estudio` — construirlo aquí adelantaría trabajo de una spec que todavía no tiene su propio `requirements.md`.
- El modo concentración (Requisito 9) responde directamente al principio de producto 2.6 ("la interfaz debe desaparecer durante el estudio").

## Decisiones (aprobadas por Diego, 2026-09-14)

Esta revisión incorpora `MEJORAS.md` y `PRODUCT-VISION.md`. Las cuatro decisiones que introducían cambios de criterio quedaron resueltas así:

1. **Requisito 2.3 se ablanda**: deja de exigir literalmente "hamburguesa / iconos / visible" y pide en su lugar tres niveles de densidad abstractos (`collapsed`/`compact`/`expanded`), dejando la solución visual concreta para `design.md`. **Aprobado.**
2. **Modo concentración (Requisito 9):** se construye completo en `003`, no solo se diseña. **Aprobado.**
3. **Progreso de lectura (Requisito 10):** se construyen tanto la restauración de posición de scroll como el indicador visual discreto, por concepto/página (no un progreso global). **Aprobado.**
4. **Trazabilidad normativa (Requisito 11):** se implementa ya en `003`, no se pospone. **Aprobado.**

Con esto, `requirements.md` queda aprobado y `design.md` (Fase 2) puede actualizarse para cubrir técnicamente los Requisitos 9, 10, 11, 12 y 13, y reflejar el Requisito 2 ablandado.
