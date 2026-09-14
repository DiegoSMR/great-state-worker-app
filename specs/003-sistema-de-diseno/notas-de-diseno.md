# Notas de diseño: Sistema de diseño (legibilidad, navegación y temas)

**Esto es una propuesta/borrador pendiente de aprobación de Diego, no una decisión cerrada.** No es el `design.md` técnico formal de Fase 2 (ese documento lo escribe `lead-developer` y llegará después de que Diego apruebe `requirements.md`). Aquí solo se fija la dirección visual — paleta, tipografía, navegación, estados — para que Diego pueda revisarla y darle el visto bueno o pedir cambios antes de que se traduzca a decisiones técnicas concretas (CSS custom properties, componentes, librerías).

Última actualización: 2026-09-14

---

## 1. Paleta de tokens de color

### Diagnóstico de raíz (por qué duele la vista hoy)

El problema no es "falta un tema oscuro" — es que existe *medio* tema oscuro: el fondo del `body` cambia vía `prefers-color-scheme`, pero todos los textos (`text-neutral-600`, `text-neutral-500`) y bordes (`border-neutral-200`, `bg-neutral-50`) se quedan fijos con la escala de grises de Tailwind pensada para fondo blanco. Un gris medio (`neutral-600`, ~`#525252`) da buen contraste sobre blanco pero contraste pobre sobre un fondo casi negro. La solución no es "invertir la misma escala de grises" — es tener **dos escalas de gris calibradas por separado**, una para cada tema, cada una pensada desde su propio fondo hacia afuera. Ese es el requisito de fondo del Requisito 1.4 de `requirements.md`.

### Tokens propuestos

Nombres neutros (no ligados a una tecnología concreta — la Fase 2 decide si son CSS custom properties, tokens de Tailwind v4 `@theme`, etc.):

| Token | Light | Dark | Uso |
|---|---|---|---|
| `bg-primario` | `#ffffff` | `#1b1b19` | Fondo de página |
| `bg-secundario` | `#f6f5f2` | `#242320` | Paneles, nav, tarjetas, cajas de estado |
| `borde` | `#ddd9d0` | `#3a3833` | Separadores, bordes de tarjeta/badge |
| `texto-primario` | `#23211d` | `#ece9e1` | Cuerpo de texto, títulos |
| `texto-secundario` | `#5f5c53` | `#b3afa3` | Metadatos, fuentes, texto auxiliar |

Nota de diseño: son grises cálidos (con un toque de marrón/beige, no grises fríos puros) — encajan mejor con sesiones de lectura larga que un gris neutro frío, y con el `bg-secundario` funcionando como un "papel" sutil que separa paneles del fondo sin necesitar un borde marcado en todos los casos. El fondo oscuro (`#1b1b19`) es deliberadamente *no* negro puro (`#000000`) — un negro puro con texto casi blanco maximiza contraste pero también fatiga la vista en sesiones largas por el contraste excesivo; `#1b1b19` es la elección estándar de apps de lectura para tema oscuro.

**Ratios de contraste verificados** (cálculo WCAG real, no estimado — fórmula de luminancia relativa estándar):

| Combinación | Ratio | ¿Cumple AA? |
|---|---|---|
| Light: texto-primario / bg-primario | 16.07:1 | Sí (supera AAA) |
| Light: texto-primario / bg-secundario | 14.74:1 | Sí (supera AAA) |
| Light: texto-secundario / bg-primario | 6.68:1 | Sí |
| Light: texto-secundario / bg-secundario | 6.13:1 | Sí |
| Dark: texto-primario / bg-primario | 14.22:1 | Sí (supera AAA) |
| Dark: texto-primario / bg-secundario | 12.95:1 | Sí (supera AAA) |
| Dark: texto-secundario / bg-primario | 7.87:1 | Sí |
| Dark: texto-secundario / bg-secundario | 7.17:1 | Sí |

Todos los pares texto/fondo superan el mínimo de 4.5:1 (texto normal) con margen. Los bordes (`borde` sobre `bg-primario`, ratio ~1.4:1) no llevan texto encima — solo delimitan áreas, así que no les aplica el criterio de contraste de texto de WCAG AA (sí aplicaría si en algún momento se usan para iconografía informativa sin texto, a revisar en Fase 2 si surge el caso).

### Colores de los 4 estados especiales

Cada estado tiene su propio par de colores, deliberadamente distintos entre sí para que no se confundan a simple vista, con contraste verificado en ambos temas:

| Estado | Light bg / texto | Dark bg / texto | Ratio light | Ratio dark |
|---|---|---|---|---|
| **Núcleo común** (ámbar — se mantiene, ya funcionaba conceptualmente) | `#fdecc8` / `#7a4a00` | `#4a3410` / `#f5c877` | 6.42:1 | 7.49:1 |
| **Bookmark marcado** (violeta — color nuevo, para no confundirse con el ámbar de núcleo común) | `#efe6fb` / `#5b3a9e` | `#3a2a54` / `#c9b3f0` | 6.83:1 | 6.83:1 |
| **Sin escribir** (gris + borde discontinuo, sin color de acento — es intencionalmente "apagado") | `bg-secundario` / `texto-secundario` | `bg-secundario` / `texto-secundario` | 6.13:1 | 7.17:1 |
| **En revisión normativa** (azul información — nuevo, ver justificación abajo) | `#e2edfb` / `#1e4f8c` | `#193353` / `#8fbdf2` | 6.95:1 | 6.54:1 |

**Por qué bookmark cambia de ámbar a violeta:** hoy `BookmarkButton.tsx` (marcado) y `NucleoComunBadge.tsx` usan la misma familia de color (ámbar/amber). Son dos señales con significado distinto — una es propiedad del contenido ("esto lo piden varias oposiciones"), la otra es una acción del usuario ("esto lo he marcado yo") — y compartir color hace que a simple vista, en una lista con varios badges, cueste distinguir cuál es cuál. Se propone violeta para bookmark, reservando el ámbar en exclusiva para núcleo común.

**Por qué "en revisión" es azul, no rojo/naranja:** el requisito de producto es explícito — el contenido sigue siendo consultable y fiable en líneas generales, la revisión es un chequeo puntual de vigencia normativa, no una alerta de que algo esté mal. El azul es el color convencionalmente "informativo" (ni error, ni advertencia, ni éxito), y es un tono que no se usa en ningún otro estado de la app hoy, así que no compite visualmente con nada existente.

---

## 2. Escala tipográfica y ancho de línea

Pensada para sesiones largas de lectura de texto legal/normativo denso (el caso de uso dominante, no una app "ligera" de scroll rápido):

| Propiedad | Valor propuesto | Justificación |
|---|---|---|
| Tamaño base (cuerpo) | `1.0625rem` (17px) | Ligeramente por encima del default de navegador (16px) — mejora legibilidad sostenida sin saltar a un tamaño que rompa la maquetación en tablet. |
| `line-height` cuerpo | `1.65` | Texto legal denso con frases largas necesita más aire vertical que prosa corta; 1.65 reduce la tasa de "perder la línea" al volver de un salto de línea largo, sin quedar tan suelto que rompa la sensación de párrafo. |
| Ancho de columna de lectura | `65ch` (~ `72ch` en texto oficial transcrito, que suele tener frases más largas) | El rango recomendado por convención tipográfica para legibilidad sostenida es 50–75 caracteres por línea; 65ch es el punto medio seguro para prosa en español (que tiende a ser algo más larga que en inglés). Medido en `ch` (no `px`/`rem`) porque se ancla al ancho real del carácter de la fuente elegida, no a un valor fijo de pantalla. |
| Escala de encabezados | `h1: 1.75rem / h2: 1.375rem / h3: 1.125rem`, todos `font-weight: 600` | Salto moderado, no dramático — dentro de un concepto largo con tres secciones y subsecciones, una escala muy agresiva (p. ej. h1 a 2.5rem) sobrecarga visualmente una página que ya tiene mucho texto debajo. |
| Tipografía | Mantener Geist Sans (ya cargada en el proyecto, sin usar activamente) para UI/metadatos; considerar una serif de lectura (p. ej. una fuente con buena legibilidad en texto largo) para el cuerpo de "Texto oficial" y "Material adaptado" — **a decidir en Fase 2**, aquí se deja como pregunta abierta de diseño, no como decisión cerrada. | Ver más abajo en "Diferenciación de las tres partes". |

Este ancho de columna (`65ch`/`72ch`) sustituye al `max-w-3xl` actual de `app/estudio/tema/[conceptoId]/page.tsx`, que es un ancho en píxeles fijo sin relación directa con el número de caracteres por línea real de la tipografía usada.

---

## 3. Patrón de navegación por breakpoint

**Metodología de construcción: mobile-first.** El CSS/responsive se define primero para el breakpoint móvil (la base tiene que funcionar bien por sí sola) y se extiende hacia tablet y escritorio por progressive enhancement (media queries `min-width`, nunca `max-width`) — nunca al revés. Esto es un eje distinto de la prioridad de uso: tablet sigue siendo donde Diego pasa más tiempo real (ver `CONTEXT.md`), así que tablet y escritorio reciben el mayor esfuerzo de pulido visual y de interacción una vez que la base móvil está sólida. Metodología de construcción y prioridad de uso no se confunden entre sí.

### Tres modos de densidad, seleccionables por el usuario en cualquier tamaño de pantalla

En vez de que el tamaño de pantalla imponga un único patrón fijo de navegación, se proponen tres modos de densidad para el menú, intercambiables manualmente por el usuario en cualquier momento, en cualquier tamaño de pantalla:

| Modo | Descripción | Efecto |
|---|---|---|
| **Hamburguesa** | Menú oculto tras un icono; al pulsarlo se abre como overlay (capa superpuesta) sobre el contenido, con las mismas entradas que los otros dos modos. | Máximo espacio para el contenido; navegación bajo demanda. |
| **Iconos** | Rail compacto siempre visible, solo iconos sin etiqueta de texto (ancho aproximado 56–72px). | Navegación siempre accesible, ancho horizontal mínimo. |
| **Visible** | Menú expandido siempre visible, iconos + etiqueta de texto completa (ancho aproximado 220–260px). | Máxima claridad de cada entrada, a cambio de más ancho ocupado. |

Las tres entradas de contenido son las mismas en los tres modos: Estudio, Marcadores (futuro: Pruebas, Flashcards, Planificador — ver sección 8), y el acceso al selector de tema + panel de configuración de lectura (sección 4 y 5).

**Defaults propuestos por tamaño de pantalla** (el usuario puede cambiar cualquiera de ellos manualmente en cualquier momento; esto es solo el punto de partida razonable, no una limitación):

| Breakpoint | Modo por defecto | Por qué |
|---|---|---|
| Móvil | Hamburguesa | El ancho horizontal es el recurso más escaso — incluso un rail de solo iconos le resta espacio de lectura al contenido en una pantalla estrecha. |
| Tablet | Iconos | Hay espacio de sobra para un rail permanente sin invadir la columna de lectura (65–72ch), pero las etiquetas de texto completas no son imprescindibles para reconocer 4–5 iconos ya familiares tras el primer uso — deja más aire visual al contenido, que es lo que Diego usa más tiempo en este dispositivo. |
| Escritorio | Visible | Sobra ancho horizontal con claridad; aprovecharlo con etiquetas de texto no compite con el ancho de columna de lectura, que se mantiene fijo en 65–72ch independientemente del ancho de ventana (sección 2). |

El modo elegido manualmente se guarda como preferencia persistente (mismo mecanismo técnico que la preferencia de tema, a decidir en el `design.md` de Fase 2) — si Diego colapsa el menú a "iconos" en escritorio un día, la app lo recuerda la próxima vez en vez de volver al default de ese breakpoint.

### Dentro de la vista de un concepto

Independientemente del modo de densidad elegido para el menú de navegación global, la vista de un concepto mantiene su propio nivel de navegación local entre las tres partes del contenido (pestañas + scrollspy, ver sección 6) — son dos niveles de navegación distintos que no deben competir por el mismo espacio visual ni confundirse entre sí.

---

## 4. Selector de tema

- **No es un interruptor binario.** Se propone una lista desplegable (dropdown) o un grupo de opciones tipo "segmented control" con nombre visible por tema: "Claro", "Oscuro" en v1, con espacio ya previsto en el propio componente para añadir más filas/opciones sin rediseñarlo (p. ej. un futuro "Alto contraste" o "Sepia").
- **Dónde vive:** parte inferior o superior del menú de navegación, visible en el modo "visible" y accesible como icono en los modos "iconos"/"hamburguesa" (sección 3) — se cierra la ubicación exacta en Fase 2, pero en cualquier modo/tamaño de pantalla debe ser accesible en máximo un toque/clic adicional, no enterrado en varios niveles de menú. Comparte panel con la configuración de lectura (sección 5) — ver ahí el porqué.
- **Modelo de estado:** el valor guardado es un identificador de tema (string, p. ej. `"claro"` / `"oscuro"`), no un booleano `esOscuro: true/false`. Esto es lo que permite añadir un tercer tema sin cambiar la forma del dato — solo se añade un valor posible más a la lista de opciones válidas (ver Requisito 3.4 de `requirements.md`).

---

## 5. Panel de configuración de lectura

Vive en el mismo control que el selector de tema (sección 4) — ambos responden a la misma pregunta del usuario ("cómo se ve la app para mí"), así que comparten ubicación en el menú de navegación. Se proponen como dos bloques dentro del mismo panel ("Apariencia" con el selector de tema, "Lectura" con los ajustes de lectura), no como un único control mezclado — cada uno tiene un ciclo de vida distinto (el tema afecta a toda la app; la configuración de lectura afecta sobre todo al contenido de estudio).

- **Control obligatorio en v1: tamaño de letra.** Se propone un selector de 3 niveles (Pequeño / Mediano / Grande), con "Mediano" como valor por defecto correspondiente a los `1.0625rem` definidos en la sección 2. Se propone un control tipo segmented control (mismo patrón visual que el selector de tema, por consistencia) en vez de un slider continuo — más simple de usar en tablet con el dedo, y evita valores intermedios que compliquen mantener el contraste verificado en la sección 1.
- **Modelo de estado extensible.** Igual que el tema (sección 4) no se modela como booleano, la configuración de lectura no se modela como un único valor `tamañoLetra` suelto, sino como un objeto de ajustes de lectura con `tamañoLetra` como su primera propiedad — listo para añadir `interlineado`, `anchoColumna` u otros controles después sin cambiar la forma del dato existente ni migrar el valor ya guardado.
- **Interacción con el ancho de columna de lectura (sección 2), explícita:** el ancho de columna ya está definido en `ch` (unidad relativa al ancho del carácter de la fuente activa a su tamaño actual), no en `px`/`rem` fijos. Por diseño, esto significa que cuando el usuario sube el tamaño de letra, el número de caracteres por línea (65–72) se mantiene estable automáticamente — lo que cambia es el ancho en píxeles de la columna, no la cantidad de texto por línea. Es el comportamiento deseable: quien necesita letra más grande no debería además tener que leer líneas más largas o más cortas de lo recomendado.
- **Interacción con contraste (Requisito 1), explícita:** los tres niveles de tamaño de letra reutilizan los mismos tokens de color de la sección 1 — el ajuste de tamaño no cambia ningún color de texto, así que el cumplimiento WCAG AA ya verificado se mantiene igual en los tres niveles.

---

## 6. Diferenciación de las tres partes del contenido

**Propuesta: pestañas (tabs) en tablet/escritorio + navegación por anclas con indicador de sección activo, combinadas — no una u otra.**

- En la vista de un concepto, justo debajo de la cabecera (título, badges, oposiciones), aparece una barra de navegación local con tres pestañas: **Texto oficial** · **Material adaptado** · **Resumen** (esta última con sus dos subpartes Esquema/Resumen extenso accesibles dentro, p. ej. como un sub-nivel de anclas dentro de la pestaña Resumen).
- Al seleccionar una pestaña, la vista se desplaza (scroll suave) a esa sección — todo el contenido sigue viviendo en la misma página (no son rutas distintas ni recargas), simplemente se ancla. Esto evita el problema de "perderse": el usuario siempre puede volver arriba a la barra de pestañas y saltar directamente a cualquier parte, sin depender de hacer scroll manual hacia atrás.
- La pestaña activa se resalta (subrayado + color de acento) y, a medida que el usuario hace scroll libremente por el contenido, la pestaña correspondiente a la sección visible se resalta sola (patrón "scrollspy") — así el indicador de "dónde estoy" funciona tanto si el usuario navega con las pestañas como si simplemente hace scroll.
- **Tratamiento tipográfico distinto por sección** (más allá del encabezado), para que sea reconocible incluso sin mirar la pestaña activa:
  - **Texto oficial**: fondo `bg-secundario` en una caja con borde sólido fino, tipografía ligeramente distinta (posible uso de la serif de lectura mencionada en la sección 2) — transmite "esto es una cita textual, no lo hemos escrito nosotros".
  - **Material adaptado**: fondo `bg-primario` normal, sin caja — es el cuerpo principal de estudio, el que se lee más tiempo, así que no debe llevar ningún tratamiento que añada fricción visual.
  - **Resumen** (Esquema + Resumen extenso): fondo `bg-primario`, pero con una barra lateral de acento fina (color neutro, no uno de los colores de estado) a la izquierda del bloque, y el Esquema específicamente en formato más compacto (posible tabla o lista con más espaciado entre bloques que prosa corrida) para reforzar la sensación de "ficha de repaso" frente a "lectura completa".

---

## 7. Estados especiales — cómo se ven

| Estado | Light | Dark |
|---|---|---|
| **Núcleo común** | Badge con fondo `#fdecc8`, texto `#7a4a00`, borde a juego, icono opcional (p. ej. un pequeño marcador de "comparte varias oposiciones"). | Fondo `#4a3410`, texto `#f5c877`. Mismo icono, mismo contraste. |
| **Bookmark — sin marcar** | Botón con borde `borde`, texto `texto-secundario`, sin relleno — discreto, invita a la acción sin gritar. | Igual patrón con los tokens dark equivalentes. |
| **Bookmark — marcado** | Botón con fondo `#efe6fb`, texto `#5b3a9e`, icono de marcador relleno (no solo contorno) — la diferencia marcado/sin marcar se nota tanto por color como por forma del icono (relleno vs. contorno), no solo por color, para que sea reconocible también para quien no distingue bien el violeta. | Fondo `#3a2a54`, texto `#c9b3f0`, mismo icono relleno. |
| **Sin escribir** | Caja con borde discontinuo (se conserva, es el lenguaje ya validado por Diego: "esto no es un error, es un hueco conocido"), fondo `bg-secundario`, texto `texto-secundario`, icono neutro (p. ej. un lápiz o documento vacío, nunca un triángulo de alerta). Título "Contenido pendiente de redactar" se mantiene. | Mismos tokens dark, mismo borde discontinuo, mismo icono. |
| **En revisión normativa** | Aviso no bloqueante, en línea, cerca de la sección "Texto oficial" (no tapando el contenido): fondo `#e2edfb`, texto `#1e4f8c`, borde sólido fino (no discontinuo — discontinuo queda reservado para "sin escribir", para no mezclar los dos lenguajes visuales), icono de información (ⓘ o similar, nunca un triángulo de alerta ni un icono rojo). Texto propuesto: "Esta normativa está pendiente de una revisión de vigencia — el contenido sigue disponible." | Fondo `#193353`, texto `#8fbdf2`, mismo icono y mismo texto. |

La distinción "sin escribir" (borde discontinuo, sin contenido detrás) vs. "en revisión" (borde sólido, contenido completo debajo, banner informativo) es deliberada: el patrón de borde comunica por sí solo si hay algo que leer o no, incluso antes de leer el texto del aviso.

---

## 8. Futuros evolutivos

Cómo debe quedar este sistema para no rehacerse cuando lleguen tests/exámenes (`specs/002-seccion-pruebas/`), flashcards y planificador (ver "Ideas futuras" en `specs/001-seccion-estudio/spec.md` y `CONTEXT.md`):

- **Menú de navegación con espacio reservado, no cerrado a 2 entradas.** El menú (sección 3, en cualquiera de sus tres modos de densidad) debe maquetarse desde ahora asumiendo que crecerá a 4–5 entradas (Estudio, Pruebas, Flashcards, Planificador, Marcadores), no solo las 2 actuales — evita que la Fase 2 técnica tenga que rediseñar el componente en vez de solo añadirle filas.
- **Tokens de color, no valores sueltos.** Toda la paleta de la sección 1 debe implementarse como tokens nombrados (sea cual sea el mecanismo técnico que decida `lead-developer` — custom properties CSS, tokens de Tailwind v4, etc.), nunca como valores hex repetidos por componente. Esto es lo que permite que un futuro tercer tema ("alto contraste", "sepia") se añada redefiniendo el mismo set de tokens, sin tocar componente por componente — igual que el selector de tema (sección 4) ya está pensado como lista extensible y no como booleano.
- **El patrón de pestañas de la sección 6 debe ser genérico, no exclusivo del contenido de "Estudio".** Cuando lleguen flashcards (que previsiblemente también tendrán algún tipo de "modo estudio" vs. "modo repaso") o el planificador (con vistas por día/semana/mes), conviene que el componente de pestañas + scrollspy construido aquí sea reutilizable, no una solución ad-hoc soldada a los tres nombres fijos "Texto oficial/Material adaptado/Resumen".
- **Persistencia de preferencias de interfaz (tema, modo de densidad de navegación, ajustes de lectura) — requisito de diseño para `lead-developer` (Fase 2):** las tres viven en el mismo panel (secciones 4 y 5) y comparten la misma naturaleza — elecciones del usuario sobre cómo se ve/comporta la app para él, no datos de contenido. La app es single-user hoy, pero la arquitectura general del proyecto (principio 6 de `CONSTITUTION.md`, y el patrón ya usado por la tabla `bookmark` de `specs/001-seccion-estudio/design.md`, que usa `usuario_id` aunque solo exista un usuario fijo) está pensada para multiusuario futuro. **No se diseña aquí la solución técnica de persistencia** (cookie vs. `localStorage` vs. tabla en Postgres es decisión de `lead-developer` en el `design.md` técnico), pero si la elección técnica es guardar estas preferencias en base de datos, el requisito de diseño que deben cumplir las tres por igual es el mismo patrón que `bookmark`: la fila debe llevar `usuario_id` desde el primer día, no añadirse como columna nueva cuando llegue el segundo usuario. Si la elección técnica es `localStorage`/cookie de cliente, debe quedar documentado en el `design.md` técnico como decisión consciente de que esas preferencias no viajan entre dispositivos hasta que exista una cuenta de usuario real — no una limitación descubierta tarde.
- **Estados especiales como catálogo abierto.** Los 4 estados de la sección 7 no deben tratarse como una lista cerrada de 4 casos especiales en el código — el patrón (badge con color propio + icono + texto corto, o banner informativo con borde e icono) debe quedar documentado como una receta reutilizable, porque es razonable esperar estados nuevos a futuro (p. ej. "flashcard pendiente de repaso hoy" en el planificador). Esto es una nota para que `lead-developer` lo tenga en cuenta al construir el componente base de badge/estado en Fase 2, no una petición de construir ya ese catálogo genérico.
- **Panel de configuración de lectura extensible (sección 5) por el mismo motivo que el selector de tema.** Cuando lleguen flashcards o tests, es razonable esperar controles de lectura adicionales relevantes para esas pantallas (p. ej. modo "solo texto grande" para repasar en movimiento) — el modelo de ajustes de lectura como objeto extensible (no un valor suelto) es lo que evita rehacerlo cuando llegue ese momento.

---

## 9. Modo concentración — propuesta visual

Responde al Requisito 9 de `requirements.md` y al principio de producto 2.6 ("la interfaz debe desaparecer durante el estudio").

- **Activación:** un icono/botón (ojo, o "Concentración") visible en cualquiera de los tres niveles de densidad del menú global, junto al selector de tema — no enterrado en un submenú.
- **Efecto:** colapsa el menú global a su expresión mínima (icono único para salir, sin las demás entradas) y oculta cualquier chrome no esencial (breadcrumbs, cabeceras secundarias). La navegación local del concepto (sección 3, tabs del §6) se mantiene, porque sigue siendo necesaria para moverse dentro del contenido que se está leyendo.
- **Qué se conserva siempre visible:** el botón de salir del modo, y algo que identifique en qué concepto/tema está el usuario (p. ej. un título discreto, no una barra completa de contexto).
- **Salida:** el mismo control de activación actúa como interruptor, y además cualquier navegación explícita (ej. pulsar el menú local) puede sacar del modo automáticamente — a decidir en Fase 2 si conviene ese comportamiento implícito o si debe ser siempre una acción explícita.
- **Versión mínima aceptable si el alcance de v1 se recorta (ver "Decisiones pendientes" en `requirements.md`):** un solo botón que alterna `display` del `NavShell` a su variante `collapsed` y oculta metadatos de cabecera, sin animación ni persistencia de la elección entre conceptos.

---

## 10. Progreso de lectura — propuesta visual

Responde al Requisito 10. Deliberadamente mínimo: posición y continuidad, no dominio.

- **"Continuar donde lo dejaste":** al reabrir un concepto con posición de scroll guardada, restaurar el scroll automáticamente (sin salto brusco) y mostrar un aviso discreto y temporal (p. ej. una línea pequeña bajo la cabecera, "Continuando desde donde lo dejaste", que desaparece a los pocos segundos o al primer scroll manual) — nunca un modal ni un elemento que bloquee la lectura.
- **Indicador de progreso (opcional en v1, ver decisión pendiente):** una barra fina horizontal, fija en la parte superior de la columna de lectura (no del viewport completo, para no competir con el menú global), que crece con el scroll dentro del contenido del concepto. Color neutro (`texto-secundario` o `borde`), nunca uno de los colores de estado (ámbar/violeta/azul) para no confundirse con núcleo común, bookmark o revisión.
- **Qué NO es esto:** no hay checkmark de "completado", no hay porcentaje de dominio, no hay relación con si el usuario ha estudiado bien o mal el concepto — es puramente "cuánto texto ha recorrido", útil solo para retomar la lectura.

---

## 11. Trazabilidad de fuentes normativas — propuesta visual

Responde al Requisito 11. La fuente ya vive en el frontmatter (`fuentes:`) de cada concepto — ver ejemplo real en `content/estudio/prevencion-riesgos-laborales.md`, que ya incluye norma, artículo y enlace en un único string.

- **Ubicación:** un elemento secundario y colapsable (p. ej. `<details>`/acordeón nativo, o un icono "fuente" junto al título de "Texto oficial") — nunca una ficha fija siempre expandida que compita con el contenido.
- **Contenido al expandir:** la norma y artículo tal cual están en `fuentes:`, con el enlace oficial como link real (no solo texto), y, si el concepto está "en revisión" (Requisito 6), un enlace directo desde el aviso de revisión hacia esta misma fuente en vez de duplicar la información.
- **Tono visual:** texto pequeño, `texto-secundario`, sin caja ni color de estado propio — es metadato de referencia, no un aviso.
- **No parsear el string de `fuentes:` en campos estructurados (norma/artículo/enlace por separado) en esta spec** — mostrarlo tal cual existe hoy es suficiente para el requisito; estructurarlo es una decisión de `lib/contenido.ts` que puede esperar a que haga falta (p. ej. para filtrar o enlazar automáticamente).

---

## 12. Accesibilidad mínima — checklist de aplicación práctica

Responde al Requisito 12. No es una sección de diseño visual nueva — es una lista de comprobación que aplica transversalmente a todos los componentes ya descritos en este documento:

| Componente | Qué revisar |
|---|---|
| `NavShell` (§3) | Foco visible en cada entrada; `aria-label` en modo iconos; navegable con Tab/flechas. |
| Selector de tema (§4) y panel de lectura (§5) | Roles semánticos correctos (`role="radiogroup"` o `<select>` nativo mejor que `div` a medida); foco visible; operable solo con teclado. |
| Tabs de concepto (§6) | Anclas reales (`<a href="#...">`), no solo `onClick`; foco visible al navegar con teclado. |
| Badges y estados (§7) | Nunca solo color — icono/forma/texto acompañan siempre (ya contemplado: glifo relleno/contorno en bookmark, texto fijo en avisos). |
| Botón de modo concentración (§9) y barra de progreso (§10) | Botón real (`<button>`), no `div`; la barra de progreso no lleva foco ni interacción (es informativa, `aria-hidden` si no aporta valor a lector de pantalla). |
| Cualquier transición/animación (apertura de overlay, scroll suave, aparición de avisos) | Envolver en `@media (prefers-reduced-motion: no-preference)` — con `reduce`, el cambio es instantáneo. |

---

## 13. Jerarquía visual y robustez de color — notas de aplicación

Responde al Requisito 13 y extiende el §1 y §7 con la lista de estados interactivos que `design.md` debe verificar, no solo el par texto/fondo estático:

- Estados a verificar con los mismos tokens de §1 (nunca un color suelto nuevo): `hover`, `focus`, `active`, controles deshabilitados (`texto-secundario` sobre `bg-secundario`, nunca simplemente "más transparente"), enlaces (subrayado o color propio, no solo `texto-primario`), selección de texto, indicador de progreso (§10), mensajes temporales (p. ej. "Continuando donde lo dejaste", §10), superficies anidadas (una caja de "Texto oficial" dentro de una página que ya tiene `bg-secundario` en el panel de navegación — deben distinguirse entre sí), y bordes informativos (discontinuo = sin escribir, sólido = en revisión, ya definido en §7).
- **Regla de jerarquía:** ante cualquier duda sobre si un elemento nuevo (badge, aviso, indicador) debe destacar más que el contenido, la respuesta por defecto es no — solo se permite mayor peso visual que el cuerpo de texto cuando existe un riesgo real que el usuario deba atender antes de seguir leyendo (que hoy no se da en ningún estado definido: ni "sin escribir" ni "en revisión" son ese caso, de ahí su tratamiento deliberadamente tranquilo en §7).
