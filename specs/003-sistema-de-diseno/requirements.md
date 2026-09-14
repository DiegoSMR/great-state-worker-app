# Requirements: Sistema de diseño (legibilidad, navegación y temas)

Fase: 1 — Requirements. Estado: borrador.
Última actualización: 2026-09-14

## Resumen

Diego usa la app sobre todo en tablet para leer contenido legal/normativo denso durante sesiones largas. Hoy la app es dolorosa a la vista (contraste roto entre el tema oscuro del sistema operativo y colores de texto fijos pensados para fondo claro), no tiene navegación persistente en ningún tamaño de pantalla, y no ofrece control real sobre el tema visual ni sobre cómo se ve el texto. Esta feature transversal resuelve esos problemas: construye la navegación con metodología mobile-first (base definida primero para móvil, con tablet y escritorio — el uso real prioritario de Diego — recibiendo el mayor pulido una vez esa base funciona), añade un selector de tema explícito y un panel de configuración de lectura (empezando por tamaño de letra), y formaliza cómo se distinguen visualmente las tres partes del contenido de un concepto y cómo se representan los estados especiales (núcleo común, bookmark, contenido sin escribir, normativa en revisión) en ambos temas.

## Requisito 1: Contraste y legibilidad

**Historia:** Como usuario, quiero que el texto tenga siempre contraste suficiente frente a su fondo, en cualquier tema, para poder leer contenido denso durante sesiones largas sin fatiga ni dolor de ojos.

**Criterios de aceptación:**
1. CUANDO se muestra texto de cuerpo (párrafos, listas, metadatos) sobre su fondo, en tema claro o en tema oscuro, ENTONCES el sistema DEBERÁ mantener una relación de contraste de al menos 4.5:1 (WCAG AA para texto normal).
2. CUANDO se muestra texto grande (títulos, encabezados de sección) sobre su fondo, en tema claro o en tema oscuro, ENTONCES el sistema DEBERÁ mantener una relación de contraste de al menos 3:1 (WCAG AA para texto grande).
3. CUANDO el usuario cambia de tema (claro/oscuro) ENTONCES el sistema DEBERÁ actualizar de forma coherente todos los colores de texto, fondo y borde de la pantalla visible — nunca DEBERÁ quedar un color de un tema mezclado con el fondo del otro.
4. CUANDO se diseña cualquier color de texto secundario o metadato ENTONCES el sistema NO DEBERÁ reutilizar el mismo valor de gris para ambos temas invirtiendo solo el fondo — cada tema DEBERÁ tener su propia escala de grises calibrada para su propio fondo.

## Requisito 2: Navegación persistente responsive, construida mobile-first con tablet como prioridad de uso

**Historia:** Como usuario, quiero un sistema de navegación persistente cuya base funcione bien en cualquier pantalla pequeña y que reciba su mayor pulido en tablet y escritorio (mi uso real), y quiero poder elegir cuánto espacio ocupa ese menú en cualquier tamaño de pantalla, para moverme por la app sin depender de enlaces "volver" sueltos y sin que la navegación me robe espacio de lectura cuando no lo necesito.

**Criterios de aceptación:**
1. CUANDO se construye el sistema de navegación ENTONCES el sistema DEBERÁ definirse primero para el breakpoint móvil (metodología mobile-first / progressive enhancement) y extenderse hacia tablet y escritorio a partir de esa base — nunca al revés.
2. CUANDO el usuario abre la app en tablet o en escritorio (los tamaños de uso real prioritario de Diego, ver `CONTEXT.md`) ENTONCES el sistema DEBERÁ recibir en esos tamaños el mayor nivel de pulido visual y de interacción, una vez que la base móvil funciona correctamente — esto es una prioridad de uso, no de orden de construcción, y no contradice el criterio 1.
3. CUANDO el usuario abre la app en cualquier tamaño de pantalla ENTONCES el sistema DEBERÁ ofrecer un menú de navegación con tres modos de densidad seleccionables: "hamburguesa" (oculto tras icono, se abre como overlay sobre el contenido), "iconos" (rail compacto, solo iconos sin etiqueta) y "visible" (expandido, iconos con etiqueta de texto).
4. CUANDO el usuario no ha elegido manualmente un modo de densidad ENTONCES el sistema DEBERÁ aplicar un modo por defecto razonable según el tamaño de pantalla (propuesta concreta de defaults en `notas-de-diseno.md`).
5. CUANDO el usuario cambia manualmente el modo de densidad del menú ENTONCES el sistema DEBERÁ aplicar ese modo de inmediato, en cualquier tamaño de pantalla, independientemente de cuál sea el default de ese breakpoint.
6. CUANDO el usuario ha elegido manualmente un modo de densidad ENTONCES el sistema DEBERÁ recordar esa elección entre sesiones, con el mismo criterio de persistencia que la preferencia de tema (Requisito 3).
7. CUANDO el usuario navega entre pantallas usando el menú de navegación, en cualquiera de sus tres modos de densidad ENTONCES el sistema DEBERÁ indicar en qué sección se encuentra actualmente.

## Requisito 3: Selector de tema explícito y extensible

**Historia:** Como usuario, quiero elegir explícitamente el tema visual de la app (no depender de la preferencia del sistema operativo), que mi elección se recuerde, y que el sistema esté preparado para más temas en el futuro.

**Criterios de aceptación:**
1. CUANDO el usuario accede a la app por primera vez ENTONCES el sistema DEBERÁ mostrar un tema por defecto sin requerir que el usuario lo configure, pero DEBERÁ dejar visible y accesible un control para cambiarlo explícitamente.
2. CUANDO el usuario selecciona un tema desde el control de selección ENTONCES el sistema DEBERÁ aplicar ese tema de inmediato a toda la app, independientemente de la preferencia del sistema operativo del dispositivo.
3. CUANDO el usuario vuelve a abrir la app en una sesión posterior ENTONCES el sistema DEBERÁ recordar y aplicar el último tema elegido explícitamente.
4. CUANDO se diseña el modelo de datos/estado del tema seleccionado ENTONCES el sistema NO DEBERÁ representarlo como un valor binario claro/oscuro — DEBERÁ representarlo de forma que añadir un tercer tema (o más) en el futuro no requiera cambiar su forma, solo añadir una opción nueva.
5. CUANDO se listan las opciones del selector ENTONCES el sistema DEBERÁ mostrar cada tema con un nombre identificable (no solo un icono o un interruptor sin etiqueta).

## Requisito 4: Diferenciación y navegación entre las tres partes del contenido de un concepto

**Historia:** Como usuario, quiero distinguir a simple vista si estoy leyendo el texto oficial transcrito, el material adaptado o el resumen de un concepto, y moverme entre las tres partes sin perderme, para orientarme dentro de un tema largo.

**Criterios de aceptación:**
1. CUANDO el usuario está leyendo cualquier punto del contenido de un concepto ENTONCES el sistema DEBERÁ indicar en todo momento, de forma visible, cuál de las tres partes (texto oficial / material adaptado / resumen) está viendo.
2. CUANDO el usuario quiere ir directamente a otra de las tres partes ENTONCES el sistema DEBERÁ ofrecer un mecanismo de navegación directo (sin depender de hacer scroll manual por todo el contenido) que lo lleve a esa parte.
3. CUANDO se muestran las tres partes del contenido ENTONCES el sistema DEBERÁ darles un tratamiento visual distinguible entre sí (más allá de solo el título de la sección), de forma que el usuario pueda reconocer cuál está leyendo incluso sin fijarse en el encabezado.
4. CUANDO el resumen de un concepto se muestra ENTONCES el sistema DEBERÁ mantener distinguibles entre sí sus dos subpartes (esquema y resumen extenso), consistente con el resto de la jerarquía visual del punto 3.

## Requisito 5: Estado "contenido sin escribir"

**Historia:** Como usuario, quiero que el estado de un concepto sin contenido todavía redactado sea inconfundible con un error o un hueco en blanco, para saber que es una ausencia conocida y no un fallo de la app.

**Criterios de aceptación:**
1. CUANDO el usuario abre un concepto cuyo contenido todavía no existe ENTONCES el sistema DEBERÁ mostrar un estado visual explícito y reconocible como "pendiente de redactar", nunca una página en blanco, rota o indistinguible del estado de carga/error.
2. CUANDO se compara el estado "sin escribir" con el resto de la app ENTONCES el sistema DEBERÁ darle un tratamiento visual (color, borde, iconografía) que en ningún caso comparta el lenguaje visual usado para errores del sistema.
3. CUANDO se compara el estado "sin escribir" con el estado "normativa en revisión" (Requisito 6) ENTONCES el sistema DEBERÁ diferenciarlos claramente entre sí — no DEBERÁN compartir el mismo color ni el mismo patrón visual, dado que representan situaciones distintas (ausencia total de contenido frente a contenido existente pendiente de una revisión puntual).

## Requisito 6: Estado "normativa desactualizada, en revisión"

**Historia:** Como usuario, quiero que, cuando el agente `verificador-vigencia-normativa` marque un concepto como pendiente de revisión de vigencia normativa, la vista de ese concepto me lo indique de forma visible pero tranquila, para saber que el contenido puede estar desactualizado sin que deje de ser consultable ni se trate como un error.

**Criterios de aceptación:**
1. CUANDO un concepto está marcado como pendiente de revisión de vigencia normativa ENTONCES el sistema DEBERÁ mostrar un indicador visual visible en la vista de ese concepto.
2. CUANDO se muestra el indicador de "en revisión" ENTONCES el sistema NO DEBERÁ usar lenguaje, iconografía ni color asociados a error o alarma (p. ej. rojo, símbolos de advertencia crítica) — DEBERÁ transmitir un tono informativo y tranquilo.
3. CUANDO un concepto está marcado como "en revisión" ENTONCES el sistema DEBERÁ seguir mostrando el contenido completo del concepto sin ocultarlo ni bloquearlo.
4. CUANDO se compara el indicador de "en revisión" con el estado "contenido sin escribir" (Requisito 5) ENTONCES el sistema DEBERÁ usar un color y un patrón visual distintos de los usados para ese otro estado, de forma que ambos sean identificables sin ambigüedad incluso para quien no ha leído ninguna explicación previa.

## Requisito 7: Consistencia de badges y estados especiales en ambos temas

**Historia:** Como usuario, quiero que los indicadores de núcleo común y de bookmark se vean igual de claros en tema claro y en tema oscuro, para no perder esa información al cambiar de tema.

**Criterios de aceptación:**
1. CUANDO se muestra el badge de "núcleo común" ENTONCES el sistema DEBERÁ mantener contraste WCAG AA entre su texto y su fondo, tanto en tema claro como en tema oscuro.
2. CUANDO se muestra el botón/indicador de bookmark, marcado o sin marcar ENTONCES el sistema DEBERÁ mantener contraste WCAG AA entre su contenido y su fondo, tanto en tema claro como en tema oscuro.
3. CUANDO el usuario cambia de tema con un badge o estado especial visible en pantalla ENTONCES el sistema DEBERÁ actualizar sus colores de forma coherente con el resto de la interfaz, sin quedar con un aspecto "roto" o de contraste insuficiente respecto al tema recién aplicado.

## Requisito 8: Panel de configuración de lectura

**Historia:** Como usuario, quiero poder ajustar el tamaño de letra del contenido de estudio, con un panel preparado para añadir más ajustes de lectura en el futuro, para reducir la fatiga visual en sesiones largas de lectura densa.

**Criterios de aceptación:**
1. CUANDO el usuario accede al panel de configuración de lectura ENTONCES el sistema DEBERÁ ofrecer un control para ajustar el tamaño de letra del contenido, con varios niveles disponibles (propuesta concreta en `notas-de-diseno.md`).
2. CUANDO el usuario ajusta el tamaño de letra ENTONCES el sistema DEBERÁ aplicar el cambio de inmediato a todo el contenido de lectura visible, sin recargar la página.
3. CUANDO el usuario ha ajustado el tamaño de letra ENTONCES el sistema DEBERÁ recordar esa elección entre sesiones, con el mismo criterio de persistencia que la preferencia de tema (Requisito 3) y el modo de densidad de navegación (Requisito 2).
4. CUANDO se diseña el modelo de datos/estado de la configuración de lectura ENTONCES el sistema NO DEBERÁ representarlo como un único valor aislado de tamaño de letra — DEBERÁ representarlo como un conjunto de ajustes de lectura extensible, de forma que añadir un control nuevo (p. ej. interlineado, ancho de columna) en el futuro no requiera cambiar la forma de los ajustes ya existentes ni migrar los valores ya guardados.
5. CUANDO el usuario cambia el tamaño de letra ENTONCES el sistema DEBERÁ seguir cumpliendo el contraste WCAG AA definido en el Requisito 1 en todos los niveles disponibles — el ajuste de tamaño no DEBERÁ depender de reducir el contraste de color para funcionar.

## Fuera de alcance

- Implementación en código de cualquiera de estos requisitos — esta spec entrega diseño y especificación, no cambios en `app/` ni `components/`.
- Temas adicionales más allá de claro/oscuro (alto contraste, sepia, por oposición, etc.) — solo se exige que el modelo de datos/estado quede preparado para ellos, no que existan en esta versión.
- Persistencia técnica concreta de las preferencias de interfaz (tema, modo de densidad de navegación, ajustes de lectura) — cookie vs. `localStorage` vs. tabla en Postgres es una decisión de la Fase 2 (`design.md` técnico de `lead-developer`); esta spec solo exige que el resultado sea persistente entre sesiones y esté preparado para multiusuario futuro.
- Número exacto de niveles de tamaño de letra y valores en rem/px de cada nivel — se propone una cifra concreta en `notas-de-diseno.md`, pero es una decisión de diseño visual, no un criterio de aceptación cerrado en este documento.
- Accesibilidad más allá de contraste de color y estructura de navegación (navegación completa por teclado, soporte de lector de pantalla) — no descartado a futuro, pero no forma parte de los criterios de aceptación de esta versión.
- Rediseño del modelo de datos del temario o del contenido — se apoya en lo ya definido en `specs/001-seccion-estudio/design.md`.
- Cualquier pantalla de `specs/002-seccion-pruebas/` — todavía no existe implementación sobre la que aplicar este sistema.
- Multiusuario real (login, cuentas separadas).
- Offline / PWA.
- Definir cómo exactamente `verificador-vigencia-normativa` decide o comunica que un concepto necesita revisión — eso es un flujo de ese agente, no de esta spec de diseño; aquí solo se define cómo se ve el estado resultante.

## Decisiones (Preguntas abiertas pendientes de aprobación, 2026-09-14)

Ninguna resuelta todavía — esta es la primera versión de `requirements.md`, pendiente de aprobación de Diego antes de pasar a `design.md` (Fase 2).
