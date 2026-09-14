# Notas de diseño: Sistema de diseño (legibilidad, navegación y temas)

**Esto es una propuesta/borrador pendiente de aprobación de Diego, no una decisión cerrada.** No es el `design.md` técnico formal de Fase 2 (ese documento lo escribe `lead-developer` y llegará después de que Diego apruebe `requirements.md`). Aquí solo se fija la dirección visual — paleta, tipografía, navegación, estados — para que Diego pueda revisarla y darle el visto bueno o pedir cambios antes de que se traduzca a decisiones técnicas concretas (CSS custom properties, componentes, librerías).

Última actualización: 2026-09-14

## Registro de cambios de esta revisión (2026-09-14, segunda pasada)

`003-sistema-de-diseno` ya está implementado y mergeado en `main` (paleta v1 en `app/globals.css`). Diego ha pedido dos cambios sobre ese trabajo ya construido, dentro del alcance ya aprobado de la spec (mejora visual + una capacidad de contenido nueva, no un requisito de producto nuevo — no requieren su aprobación previa según su propio encargo, pero quedan documentados aquí por qué se decidieron así):

1. **Sustitución completa de la paleta de color (§1)** por "Academic Blue"/"Focused Night", a partir de un documento de referencia que Diego aportó fuera del repo. Los 5 tokens base y los 3 pares de estado existentes cambian de valor (mismos nombres de token, mismos usos); se añaden 3 tokens de estado nuevos (`ejemplo`, `excepcion`, `atencion`) pensados para el punto 2. Contraste WCAG AA reverificado de cero para todos los pares, no reutilizado de la v1. Se decide **no** introducir tokens de acento para h1/h2/enlaces (`Primary`/`Primary dark`/`Secondary` del documento de Diego) porque dos de los tres no cumplen 4.5:1 contra el `bg-primario` elegido — ver justificación completa al final de §1.
2. **Especificación de texto enriquecido para el contenido de estudio (§14, nueva)**: subrayado (`<u>`), resaltado con fondo (`<mark class="ink-...">`, 6 variantes reutilizando tokens de §1) y la decisión de no incluir una variante de solo color de texto. Requiere que `lead-developer` añada soporte de HTML embebido (`rehype-raw` o equivalente) a `components/estudio/Markdown.tsx`, que hoy no lo tiene — anotado como premisa técnica al principio de §14, no implementado en esta revisión.

## Registro de cambios de esta revisión (2026-09-14, tercera pasada — modo manuscrito y tema "papel")

A partir de una imagen de referencia (apuntes de cuaderno con rotuladores) y de una exploración visual iterada con Diego en un mockup, se añade una tercera capacidad — igual que las dos anteriores, dentro del alcance ya aprobado (Requisito 3.4 y 8.4 ya exigían que tema y perfil de lectura fueran extensibles precisamente para casos como este, así que esto no reabre `requirements.md`):

3. **Modo de texto "Manuscrito" (§15, nueva) — nuevo campo `lectura.estiloTexto`**: además de `tamanoLetra`, el perfil de lectura gana `estiloTexto: "digital" | "manuscrito"` (default `"digital"`, sin cambios visuales respecto a hoy) y, solo relevante cuando `estiloTexto === "manuscrito"`, `intensidadManuscrito: "ligera" | "media" | "intensa"` (default `"media"`). En digital nada cambia. En manuscrito, títulos y cuerpo de texto pasan a tipografías de mano (`Caveat` para encabezados, `Kalam` para cuerpo — cargadas con `next/font/google`, nunca por `<link>` en runtime), con tamaño/interlineado del cuerpo ajustados un poco al alza respecto al modo digital (una tipografía de mano necesita más aire para seguir siendo legible) y esa necesidad de aire escala con la intensidad. **El control de intensidad solo se muestra (pop-in) cuando se elige "Manuscrito"** — no tiene sentido con "Digital" seleccionado.
4. **Tercer tema "Papel" (§16, nueva) — el selector de tema (Requisito 3) gana una tercera opción**: `tema` pasa de `"claro" | "oscuro"` a `"claro" | "oscuro" | "papel"` — una fila más en el mismo selector ya diseñado como lista extensible, tal como pedía el Requisito 3.4 explícitamente para este caso. "Papel" es un fondo cálido tipo cuaderno con un patrón muy sutil de líneas horizontales — no es una alternativa al modo manuscrito (son ejes independientes: se puede tener texto digital sobre papel, o texto manuscrito sobre fondo claro).

Ver §15 y §16 para el detalle técnico de valores y verificación de contraste.

---

## 1. Paleta de tokens de color

### Por qué cambia esta sección (2026-09-14, segunda revisión)

La paleta anterior (grises cálidos neutros) cumplía el contraste WCAG con margen, pero Diego la ha rechazado por criterio estético puro ("horrible") tras verla ya implementada en `app/globals.css`. Esto no es una corrección técnica — es una sustitución completa de valores a partir de un documento de referencia externo que Diego aportó, con dos paletas ya nombradas y aprobadas por él en origen: **"Academic Blue"** (claro) y **"Focused Night"** (oscuro). El trabajo de esta revisión es (a) decidir cómo esos valores —pensados con más niveles de superficie de los que tiene nuestro sistema de tokens— encajan en los 5 tokens base + pares de estado que ya existen, y (b) verificar que el resultado sigue cumpliendo el Requisito 1 (no basta con que Diego lo prefiera visualmente si además no es legible). El diagnóstico de raíz de la v1 (dos escalas de gris calibradas por separado, una por tema, nunca invertir la misma) se mantiene como principio de fondo y no cambia — solo cambian los valores concretos.

### Tokens base

| Token | Light ("Academic Blue") | Dark ("Focused Night") | Uso |
|---|---|---|---|
| `bg-primario` | `#FAFAF7` | `#121820` | Fondo de página |
| `bg-secundario` | `#F2F4F5` | `#1B2530` | Paneles, nav, tarjetas, cajas de estado |
| `borde` | `#DDE2E5` | `#35424D` | Separadores, bordes de tarjeta/badge |
| `texto-primario` | `#303840` | `#E8EDF2` | Cuerpo de texto, títulos |
| `texto-secundario` | `#64717A` | `#AAB5BE` | Metadatos, fuentes, texto auxiliar |

**Por qué `bg-primario` = `#FAFAF7` ("Background") y no `#FFFFFF` ("Surface"):** el documento de Diego define dos niveles de superficie clara (`Background` #FAFAF7 para la página, `Surface` #FFFFFF para tarjetas) más un tercero (`Surface secondary` #F2F4F5 para paneles/nav), pero nuestro sistema de tokens solo tiene un nivel de fondo de página. El propio principio que abre el documento de Diego es explícito: *"nunca blanco puro de fondo"* — así que para el fondo que ocupa toda la sesión de lectura (Requisito de producto: legibilidad para lectura larga, no estética de app ligera) se usa el valor cálido `#FAFAF7`, no el blanco puro `#FFFFFF`. `#F2F4F5` ("Surface secondary") mapea a `bg-secundario` porque el propio documento ya lo etiqueta para el mismo uso que le damos hoy ("paneles, nav, tarjetas"). El valor `#FFFFFF` ("Surface") queda sin token propio por ahora — no hace falta un tercer nivel de superficie todavía (ver "Futuros evolutivos", §8, para el candidato).

**Nota de diseño (dark):** igual que en la v1, el fondo oscuro no es negro puro (`#121820`, con un ligero tinte azul-marino, no `#000000`) y el texto claro no es blanco puro (`#E8EDF2`) — mismo criterio de comodidad en sesiones largas, ahora con un tinte azulado ("Focused Night") en vez del beige/marrón anterior.

**Ratios de contraste verificados** (cálculo WCAG real — fórmula de luminancia relativa estándar, no estimado):

| Combinación | Ratio | ¿Cumple AA (4.5:1)? |
|---|---|---|
| Light: texto-primario / bg-primario | 11.90:1 | Sí (supera AAA) |
| Light: texto-primario / bg-secundario | 10.78:1 | Sí (supera AAA) |
| Light: texto-secundario / bg-primario | 4.80:1 | Sí |
| Light: texto-secundario / bg-secundario | 4.55:1 | Sí, con margen ajustado |
| Dark: texto-primario / bg-primario | 15.14:1 | Sí (supera AAA) |
| Dark: texto-primario / bg-secundario | 13.17:1 | Sí (supera AAA) |
| Dark: texto-secundario / bg-primario | 8.55:1 | Sí |
| Dark: texto-secundario / bg-secundario | 7.43:1 | Sí |

Todos los pares cumplen el mínimo de 4.5:1. El par más ajustado de todo el sistema es `texto-secundario` sobre `bg-secundario` en claro (4.55:1, margen de solo ~0.05 sobre el mínimo) — pasa, pero **nota para `lead-developer`:** no aplicar opacidad/alpha reducida a `texto-secundario` sobre `bg-secundario` (p. ej. para un estado "deshabilitado más tenue") sin volver a verificar el ratio, porque cualquier reducción de opacidad lo haría caer por debajo de AA. Los bordes (`borde` sobre `bg-primario`) no llevan texto encima, así que no les aplica el criterio de contraste de texto (igual que en la v1).

### Estados especiales — remapeo de los 3 existentes + 3 nuevos

Los tres estados que ya existían se remapean a la paleta semántica del documento de Diego, manteniendo el criterio ya validado de que cada uno debe ser reconocible sin ambigüedad y no compartir color con los demás. Se añaden además tres tokens semánticos nuevos (`ejemplo`, `excepcion`, `atencion`) que hoy no tiene ningún componente, pensados para el resaltado de contenido de estudio de la Tarea 2 (§14).

| Token | Origen en el documento | Light bg / texto | Dark bg / texto | Ratio light | Ratio dark |
|---|---|---|---|---|---|
| `nucleo-bg` / `nucleo-texto` | Important (amarillo) | `#FFF1B8` / `#4A4325` | `#453D21` / `#D8C78F` | 8.74:1 | 6.43:1 |
| `bookmark-bg` / `bookmark-texto` | Mnemonic (morado) | `#E4DDF5` / `#40375A` | `#2B2145` / `#A89ACB` | 8.35:1 | 5.80:1 |
| `revision-bg` / `revision-texto` | Info (azul) | `#DCEAF7` / `#1E3A5F` * | `#213845` / `#91BBD4` | 9.40:1 | 5.98:1 |
| `ejemplo-bg` / `ejemplo-texto` **(nuevo)** | Positive (verde) | `#DCEBD8` / `#29402C` | `#214529` / `#91B89A` | 9.08:1 | 4.89:1 |
| `excepcion-bg` / `excepcion-texto` **(nuevo)** | Error (rojo) | `#F3D6D6` / `#552B2B` | `#452121` / `#C98F8F` | 8.72:1 | 5.23:1 |
| `atencion-bg` / `atencion-texto` **(nuevo)** | Warning (naranja) | `#F2DECC` / `#513A2C` | `#453221` / `#C99A72` | 8.08:1 | 4.82:1 |
| `sin-escribir` (sin color propio) | — | `bg-secundario` / `texto-secundario` | `bg-secundario` / `texto-secundario` | 4.55:1 | 7.43:1 |

Todos los pares superan 4.5:1 con margen — los más ajustados son los dos derivados en oscuro para `ejemplo` (4.89:1) y `atencion` (4.82:1), verificados igualmente por encima del mínimo.

**Por qué núcleo común sigue siendo ámbar/amarillo y bookmark sigue siendo violeta/morado:** se mantiene el mismo razonamiento de la v1 — núcleo común es una propiedad del contenido ("esto lo piden varias oposiciones") y bookmark es una acción del usuario ("esto lo he marcado yo"); son señales de naturaleza distinta que no deben compartir color. El documento de Diego separa exactamente esos dos matices (Important=amarillo para lo compartido/relevante, Mnemonic=morado, el más cercano al violeta que ya usábamos), así que el remapeo es directo.

**Por qué "en revisión" sigue siendo azul:** mismo razonamiento que la v1 (contenido consultable y fiable, revisión puntual de vigencia, no un error) — el documento de Diego etiqueta el azul como "Info", que es exactamente ese registro.

**`*` Nota sobre el texto claro de `revision-texto`:** el documento de Diego da fondo para "Info" (`#DCEAF7`) pero no da un texto ya resuelto para ese estado en claro (a diferencia de los otros cinco, que vienen como trío bg/accent/texto). Se reutiliza `#1E3A5F` — el "Primary dark"/"Academic Navy" que el documento reserva para h1/acentos fuertes — porque su tono (mismo matiz de azul, saturación e iluminancia baja) es exactamente el patrón que el propio documento usa para todos los demás textos claros de estado (mismo matiz que el fondo, saturación moderada, luminosidad ~21–28%): no es un valor inventado, es el mismo criterio de diseño aplicado al hueco que dejó el documento. Verificado a 9.40:1.

### Cómo se derivaron los 6 pares oscuros (metodología)

El documento de Diego da un fondo/accent/texto ya resueltos para el modo claro, pero para el modo oscuro solo da un **acento** por color (p. ej. Important → `#D8C78F`), sin el par bg/texto ya resuelto. Se ha seguido el mismo patrón que ya usaba la v1 de este documento (`nucleo-bg`/`nucleo-texto` dark, `bookmark-bg`/`bookmark-texto` dark), confirmado retro-calculando su HSL: **el acento se usa tal cual como color de texto** (ya es un tono apagado, pensado para leerse sobre fondo oscuro), y **el fondo se deriva del mismo matiz (H), desaturado y oscurecido** (`S` 30–40%, `L` ~20%, en vez de la `S` alta / `L` alta del acento). Se fijó `S=35%, L=20%` como receta uniforme para los 6 estados (en vez de ajustar caso a caso) por consistencia visual entre ellos, y se verificó que los 6 resultados superan 4.5:1 sin necesitar mover el texto — el margen más ajustado (`ejemplo`, 4.89:1) queda igualmente resuelto solo ajustando el fondo, sin tocar el acento dado por Diego.

### Colores base del documento que NO se introducen como tokens todavía: `Primary` / `Primary dark` / `Secondary`

El documento de Diego da tres colores adicionales para jerarquía tipográfica y enlaces: `Primary dark` #1E3A5F (h1/acentos fuertes), `Primary` #4F81BD (enlaces/interactivo) y `Secondary` #527D8A (h2/acentos secundarios). Se evaluó introducirlos como tokens nuevos (`--acento-fuerte`, `--enlace`, `--acento-secundario`) para diferenciar visualmente h1/h2/enlaces del cuerpo de texto, verificando su contraste contra el `bg-primario` (`#FAFAF7`) ya elegido:

| Color | Uso previsto | Ratio contra `bg-primario` | ¿Cumple AA (4.5:1, texto normal)? |
|---|---|---|---|
| `Primary dark` #1E3A5F | h1 | 11.00:1 | Sí, con margen amplio |
| `Secondary` #527D8A | h2 | 4.31:1 | **No** |
| `Primary` #4F81BD | Enlaces en línea | 3.86:1 | **No** |

**Decisión: no se introducen los tres ahora.** `Primary dark` pasa el contraste con margen de sobra y sería un candidato limpio para un futuro `--acento-fuerte` en h1, pero `Secondary` y `Primary` tal cual los da el documento **no llegan al mínimo de 4.5:1 exigido por el Requisito 1** contra el fondo que hemos elegido — introducirlos implicaría o (a) oscurecerlos hasta que cumplan, lo que ya no serían "los valores del documento de Diego" sino una tercera variante inventada sin que él la haya visto, o (b) asumir que h2/enlaces siempre van a ir en texto "grande" (umbral WCAG 3:1), lo cual es cierto para h2 pero no para un enlace en línea dentro de un párrafo de cuerpo. Ante esa ambigüedad, y siguiendo el criterio de "no complicar el sistema de tokens si no aporta valor real hoy", se deja h1/h2/enlaces con los tokens ya existentes (`texto-primario`, con la escala tipográfica de §2 para diferenciar tamaño/peso) y se anota el hallazgo como candidato futuro en §8, para que si Diego quiere diferenciar h1/h2/enlaces por color más adelante, ya exista el análisis de qué valores sí cumplen y cuáles necesitarían ajuste.

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
| **Núcleo común** | Badge con fondo `#FFF1B8`, texto `#4A4325`, borde a juego, icono opcional (p. ej. un pequeño marcador de "comparte varias oposiciones"). | Fondo `#453D21`, texto `#D8C78F`. Mismo icono, mismo contraste. |
| **Bookmark — sin marcar** | Botón con borde `borde`, texto `texto-secundario`, sin relleno — discreto, invita a la acción sin gritar. | Igual patrón con los tokens dark equivalentes. |
| **Bookmark — marcado** | Botón con fondo `#E4DDF5`, texto `#40375A`, icono de marcador relleno (no solo contorno) — la diferencia marcado/sin marcar se nota tanto por color como por forma del icono (relleno vs. contorno), no solo por color, para que sea reconocible también para quien no distingue bien el violeta. | Fondo `#2B2145`, texto `#A89ACB`, mismo icono relleno. |
| **Sin escribir** | Caja con borde discontinuo (se conserva, es el lenguaje ya validado por Diego: "esto no es un error, es un hueco conocido"), fondo `bg-secundario`, texto `texto-secundario`, icono neutro (p. ej. un lápiz o documento vacío, nunca un triángulo de alerta). Título "Contenido pendiente de redactar" se mantiene. | Mismos tokens dark, mismo borde discontinuo, mismo icono. |
| **En revisión normativa** | Aviso no bloqueante, en línea, cerca de la sección "Texto oficial" (no tapando el contenido): fondo `#DCEAF7`, texto `#1E3A5F`, borde sólido fino (no discontinuo — discontinuo queda reservado para "sin escribir", para no mezclar los dos lenguajes visuales), icono de información (ⓘ o similar, nunca un triángulo de alerta ni un icono rojo). Texto propuesto: "Esta normativa está pendiente de una revisión de vigencia — el contenido sigue disponible." | Fondo `#213845`, texto `#91BBD4`, mismo icono y mismo texto. |

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
- **Candidatos de tokens diferidos de la revisión de paleta (§1, 2026-09-14):** un futuro `--acento-fuerte` para h1 a partir de `#1E3A5F` ("Primary dark"/Academic Navy) es viable sin más trabajo — ya pasa AA con margen amplio (11:1) contra `bg-primario`. Un futuro color diferenciado para h2 (`Secondary` #527D8A, hoy 4.31:1) o para enlaces en línea (`Primary` #4F81BD, hoy 3.86:1) necesitaría primero oscurecerse para cumplir 4.5:1 contra `bg-primario` — no se pueden adoptar tal cual del documento de Diego sin ese ajuste.
- **Tercer nivel de superficie clara (`#FFFFFF`, "Surface" en el documento de la paleta):** no tiene token propio hoy — `bg-primario` usa `#FAFAF7` y `bg-secundario` usa `#F2F4F5`. Si en el futuro se necesita distinguir una "tarjeta elevada" (p. ej. la caja de "Texto oficial", §6) del resto de superficies con `bg-secundario`, `#FFFFFF` es el candidato ya verificado en el documento de origen para ese tercer nivel.

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

---

## 14. Texto enriquecido en el contenido de estudio (subrayado, resaltado, color)

Encargo de Diego (2026-09-14): dar soporte a subrayado, texto con fondo/resaltado y (a evaluar) texto coloreado dentro de `content/estudio/*.md`, escrito a mano por `preparador-opos`. Especificación de diseño para que `lead-developer` la implemente — no se toca código en esta revisión.

### Premisa técnica (para `lead-developer`)

`components/estudio/Markdown.tsx` renderiza hoy con `react-markdown` + `remark-gfm`, sin `rehype-raw` — el HTML embebido en el `.md` se ignora/limpia por defecto, no se renderiza. Para que cualquiera de las convenciones de abajo funcione hace falta añadir soporte de HTML embebido (`rehype-raw`, o equivalente) al pipeline de `Markdown.tsx`. El contenido de `content/estudio/` lo escriben siempre nuestros propios agentes, nunca un usuario externo, así que no hay superficie de XSS real — no es necesario `rehype-sanitize` por seguridad. Sí puede ser una buena práctica barata limitar igualmente las etiquetas/atributos aceptados a la lista cerrada de esta sección (`u`, `mark` con `class` de la lista de abajo) para que un error de escritura del agente que genera el contenido no rompa el layout con HTML arbitrario — decisión de implementación de `lead-developer`, no bloqueante para esta especificación.

### Subrayado

- **Sintaxis de autoría:** etiqueta HTML `<u>texto</u>` embebida directamente en el markdown — es válida, ya reconocible para quien escribe (agentes y Diego si edita a mano), y no colisiona con ninguna sintaxis de markdown existente (a diferencia de `_texto_`, que remark ya interpreta como cursiva).
- **Estilo:** `text-decoration: underline`, grosor fino (`text-decoration-thickness: 1px`) y `text-underline-offset: ~0.15em` para que la línea no toque los descendentes de la tipografía (separación cómoda en lectura larga). Color de la línea: `texto-secundario` (no `currentColor`), **no** uno de los colores semánticos de estado — el subrayado de autoría es énfasis neutro, no una categoría.
- **Por qué no `currentColor`/tal cual el navegador:** el subrayado por defecto de `<u>` hereda el color del texto (`texto-primario`), que es visualmente indistinguible de un enlace subrayado si alguna vez apareciera un enlace en línea dentro del cuerpo de "Material adaptado"/"Resumen" (hoy los enlaces reales solo viven en el bloque colapsable de fuentes, §11, pero mejor no depender de que eso no cambie). Usar `texto-secundario` para la línea del subrayado de énfasis los distingue de un hipotético enlace en línea sin necesitar un color de enlace dedicado (que, recuérdese, §1 dejó diferido).
- Combinable con el resaltado de abajo (`<mark class="ink-...">` envolviendo o envuelto por `<u>`) sin conflicto — son dos propiedades CSS independientes (fondo vs. decoración de texto).

### Resaltado con fondo ("rotulador")

- **Sintaxis de autoría:** `<mark class="ink-NOMBRE">texto</mark>`. Se usa `<mark>`, no `<span>`: es la etiqueta HTML semánticamente correcta para "contenido marcado/destacado por su relevancia" — más correcta que un `span` decorativo, y coherente con cómo ya se razona la semántica del resto del sistema (nunca un color suelto, siempre con intención).
- **Reutiliza exactamente los tokens ya definidos en §1** — ningún color nuevo se introduce para esto, siguiendo el principio ya establecido en `design.md`/`notas-de-diseno.md` de que ningún color se escribe suelto en un componente:

| Clase | Uso previsto (convención de autoría) | Tokens (bg / texto) |
|---|---|---|
| `ink-importante` | Punto clave que hay que fijar sí o sí (lo más preguntado, una idea que no puede olvidarse). | `--nucleo-bg` / `--nucleo-texto` |
| `ink-ejemplo` | Un ejemplo concreto o caso práctico dentro del texto explicativo. | `--ejemplo-bg` / `--ejemplo-texto` |
| `ink-excepcion` | Una excepción, matiz o caso que rompe la regla general que se acaba de explicar. | `--excepcion-bg` / `--excepcion-texto` |
| `ink-mnemonico` | Una regla mnemotécnica o truco de memorización. | `--bookmark-bg` / `--bookmark-texto` |
| `ink-atencion` | Un error común, confusión frecuente o algo con lo que hay que tener cuidado al estudiar (p. ej. dos artículos que se confunden entre sí). | `--atencion-bg` / `--atencion-texto` |
| `ink-info` | Un dato de referencia/contexto adicional, no imprescindible pero útil. | `--revision-bg` / `--revision-texto` |

- **Estilo común a las seis:** `background: var(--x-bg)`, `color: var(--x-texto)` (ya verificados a ≥4.5:1 en §1 en ambos temas — el resaltado hereda ese contraste, no hay que reverificar nada nuevo), `border-radius` pequeño (~0.15em) y un `padding-inline` corto (~0.15–0.2em) para que el fondo no quede pegado a las letras — efecto "rotulador", no rectángulo duro. `box-decoration-break: clone` para que un resaltado que se parte en dos líneas mantenga el mismo redondeo en ambos fragmentos.
- **¿Esto necesita nombres reutilizados de `nucleo`/`bookmark`/`revision` o convendría desacoplarlos?** Se decide reutilizar los mismos tokens (no duplicar valores hex) precisamente por el principio de tokens ya fijado — pero la clase de autoría (`ink-importante`, `ink-mnemonico`, `ink-info`) usa **nombres propios del contexto de lectura**, no los nombres de los badges de UI (`nucleo`, `bookmark`, `revision`), porque son dos usos conceptualmente distintos aunque compartan color: uno es un estado de UI sobre metadatos del concepto, el otro es una marca de énfasis dentro de la prosa. Mantenerlos con nombres de clase distintos evita que a alguien le parezca, leyendo el CSS, que resaltar un ejemplo en verde "activa" algo relacionado con bookmarks.

### Texto coloreado sin fondo: **no se introduce**

Se evaluó (como pedía el encargo) si además del resaltado con fondo hacía falta una variante de "solo color de texto, sin fondo". Se descarta:

- El caso de uso real de un material de estudio — "quiero que esto destaque distinto de lo demás cuando escaneo la página" — ya lo cubre el resaltado con fondo; una variante sin fondo no añade una necesidad nueva, solo una forma alternativa de expresar la misma necesidad.
- Tiene un coste real que el resaltado con fondo no tiene: **duplicaría la matriz de verificación de contraste de §1** (habría que comprobar cada uno de los 6 colores de texto contra `bg-primario` y `bg-secundario`, en dos temas, en vez de reutilizar los pares ya verificados como bloque bg+texto autocontenido).
- Mezclar varios colores de texto sueltos dentro de un mismo párrafo de lectura larga (el caso de uso dominante de esta app, no una app "ligera") es más ruidoso visualmente que un fondo suave — choca con el principio de legibilidad para lectura larga y con "no sobrecargar el sistema visual" ya citado en §13.

Si en el futuro aparece un caso de uso genuinamente distinto (p. ej. colorear términos técnicos en línea sin interrumpir el flujo de lectura con una caja), se revisita como candidato nuevo — no se cierra la puerta, simplemente no se construye ahora sin una necesidad concreta.

### Accesibilidad (Requisito 12) — por qué aquí el color sí puede ir solo

El Requisito 12.3 exige que un **estado** de la interfaz (activo/seleccionado/error/especial) nunca dependa solo del color. Los resaltados de esta sección son distintos: no son un estado de UI con significado fijo por marca (como sí lo son los badges de §7, que Requisito 12.3 obliga a acompañar de icono/forma/texto) — son una herramienta de énfasis editorial, más parecida a un rotulador real sobre papel, cuyo significado concreto en cada caso lo da el propio texto que envuelven (un `ink-excepcion` casi siempre irá pegado a una frase que ya dice "salvo que...", "con la excepción de...", etc. — el color refuerza la lectura, no la sustituye). Por eso se considera aceptable que estas seis clases sean puramente cromáticas, sin icono ni patrón obligatorio adicional, a diferencia de los badges/avisos de estado (§7), que sí mantienen semántica fija y sí necesitan ese refuerzo no cromático. El subrayado (`<u>`), al ser adicionalmente una señal de forma (no solo color), no tiene este problema en ningún caso.

### Ejemplo de uso combinado

```markdown
La <mark class="ink-mnemonico">regla de las tres P (Prevenir, Proteger, Planificar)</mark> ayuda a
recordar el orden del art. 15. **Importante:** <mark class="ink-importante">el coste de las medidas de
seguridad nunca recae sobre el trabajador</mark> — <u>esta frase se pregunta prácticamente en cada
convocatoria</u>.
```

---

## 15. Modo de texto "Manuscrito"

Encargo de Diego (2026-09-14), validado antes con un mockup visual interactivo. Vive en el panel de preferencias, sección "Lectura", junto al tamaño de letra (§5) — es otro eje del mismo `readingSettings` extensible que ya exigía el Requisito 8.4.

### Modelo de datos

```ts
lectura: {
  tamanoLetra: "pequeno" | "mediano" | "grande";
  estiloTexto: "digital" | "manuscrito";           // nuevo, default "digital"
  intensidadManuscrito: "ligera" | "media" | "intensa"; // nuevo, default "media"
}
```

`intensidadManuscrito` solo es relevante (y solo se muestra en el panel) cuando `estiloTexto === "manuscrito"` — con `"digital"` seleccionado, el control de intensidad no se renderiza (pop-in condicional, no un control siempre visible pero deshabilitado).

### Qué cambia en cada modo

- **Digital** (default): sin cambios respecto al sistema ya construido — tipografía de UI en toda la app, tokens de §1 y §2 tal cual.
- **Manuscrito**: los encabezados (h1-h3, incluidos los de `--tw-prose-headings` dentro del contenido Markdown) pasan a `Caveat` (peso 700 para h1, 600 para h2/h3), con un ligero acento de color reutilizando `--acento-titulo`/`--acento-resumen` (dos tokens nuevos, ver más abajo). El cuerpo de texto (`--tw-prose-body`, párrafos de `Markdown.tsx`) pasa a `Kalam`. Ambas se cargan con `next/font/google` (mismo patrón que Geist, nunca `<link>` a Google Fonts en runtime — eso solo vale para el mockup en Claude Artifacts).
- **Por qué el cuerpo sube de tamaño/interlineado en manuscrito:** una tipografía de mano necesita más aire para seguir siendo cómoda en sesiones largas — verificado visualmente en el mockup. Los tres niveles de intensidad controlan cuánto:

| Intensidad | Tamaño título | Tamaño cuerpo | Interlineado cuerpo |
|---|---|---|---|
| Ligera | 2.1rem | 17.5px | 1.8 |
| Media (default) | 2.8rem | 18px | 1.85 |
| Intensa | 3.4rem | 18.5px | 1.9 |

(Valores de partida tomados del mockup validado por Diego; `lead-developer` puede ajustarlos ligeramente al integrarlos si el resultado real en pantalla lo pide, sin que haga falta otra ronda de aprobación por un ajuste tan fino.)

- **Contraste:** `Caveat`/`Kalam` en manuscrito siguen usando los mismos tokens de color de texto (`--texto-primario`, `--acento-titulo`, `--acento-resumen`) ya verificados en ambos temas (Requisito 1) — el cambio de tipografía no cambia ningún color, así que no hace falta reverificar contraste, solo confirmar visualmente que el trazo más fino de una fuente manuscrita no compromete la lectura (si hiciera falta, aumentar peso/tamaño antes que tocar el color).

### Tokens nuevos para el modo manuscrito

| Token | Light / Papel | Dark | Uso |
|---|---|---|---|
| `--acento-titulo` | `#B0526F` | `#D590A5` | Color de encabezados h1 en modo manuscrito |
| `--acento-resumen` | `#5C7A52` | `#9FCA91` | Color de encabezados h2/h3 en modo manuscrito |

**Resultado de la verificación (`lead-developer`, implementación):**

- **Papel hereda los valores de claro tal cual** (mismo criterio que el resto de §16: son colores de texto, no de fondo, y el fondo de papel es lo bastante próximo al de claro como para no necesitar un tercer valor).
- **Dark se deriva** manteniendo el mismo matiz (H) que el valor de claro y ajustando saturación/luminosidad para leerse como texto sobre fondo oscuro (no como fondo, que habría sido "oscurecer" — aquí el uso es al revés: es un color de encabezado, hay que aclararlo, no oscurecerlo): `#B0526F` → HSL(341°, 37%, 51%) → `#D590A5` HSL(341°, 45%, 70%); `#5C7A52` → HSL(105°, 20%, 40%) → `#9FCA91` HSL(105°, 35%, 68%).
- **Ratios verificados** (fórmula WCAG real):

| Combinación | Ratio | ¿Cumple? |
|---|---|---|
| `acento-titulo` claro / `bg-primario` claro | 4.69:1 | Sí (incluso para texto normal) |
| `acento-titulo` claro / `bg-secundario` claro | 4.45:1 | Large text sí (≥3:1); texto normal no (queda a 0.05 de 4.5) |
| `acento-titulo` papel / `bg-primario` papel | 4.62:1 | Sí |
| `acento-titulo` papel / `bg-secundario` papel | 4.16:1 | Large text sí; texto normal no |
| `acento-titulo` dark / `bg-primario` dark | 7.11:1 | Sí (con margen amplio) |
| `acento-titulo` dark / `bg-secundario` dark | 6.18:1 | Sí (con margen amplio) |
| `acento-resumen` claro / `bg-primario` claro | 4.61:1 | Sí |
| `acento-resumen` claro / `bg-secundario` claro | 4.37:1 | Large text sí; texto normal no |
| `acento-resumen` papel / `bg-primario` papel | 4.54:1 | Sí |
| `acento-resumen` papel / `bg-secundario` papel | 4.09:1 | Large text sí; texto normal no |
| `acento-resumen` dark / `bg-primario` dark | 9.63:1 | Sí (con margen amplio) |
| `acento-resumen` dark / `bg-secundario` dark | 8.37:1 | Sí (con margen amplio) |

Los cuatro casos que no llegan a 4.5:1 son exactamente el escenario que la propia spec ya preveía ("los títulos son texto grande, así que ≥3:1 basta") — h1/h2/h3 en modo manuscrito siempre se renderizan muy por encima de 24px (la intensidad más baja ya usa 2.1rem para h1 y 1.5rem/1.85rem para h3/h2), así que el umbral aplicable es 3:1 y los cuatro lo superan con margen (4.09–4.45:1). No ha hecho falta ajustar ningún valor de claro/papel para esto; el par dark se calculó desde cero (la spec no daba un valor, solo el método).

---

## 16. Tercer tema "Papel"

Encargo de Diego (2026-09-14): el selector de tema (Requisito 3, §4) gana una tercera opción, `"papel"`, junto a `"claro"`/`"oscuro"` — exactamente el caso para el que el Requisito 3.4 exigía un modelo de tema no binario desde el principio.

### Qué es y qué no es

"Papel" es un **tema de fondo**, independiente del modo de texto (§15) — los dos ejes se combinan libremente: texto digital sobre papel, texto manuscrito sobre fondo claro, etc. No es "modo manuscrito con otro nombre".

### Valores propuestos

Parte de la misma familia cálida que ya usa "Academic Blue" (claro), pero con un tono de papel más marcado y el patrón de líneas de cuaderno:

| Token | Valor | Nota |
|---|---|---|
| `bg-primario` | `#FBF8F0` | Más cálido que el `#FAFAF7` de claro — diferenciable a simple vista |
| `bg-secundario` | `#F2ECDD` | Paneles/tarjetas sobre el papel |
| `borde` | `#DED2B8` | |
| `texto-primario` | `#303840` | Igual que claro — no hace falta reinventar el texto principal |
| `texto-secundario` | `#64717A` | Igual que claro |

Los pares de estado (`nucleo`, `bookmark`, `revision`, `ejemplo`, `excepcion`, `atencion`) se heredan tal cual de claro — son los mismos colores semánticos, el papel solo cambia el fondo general. `lead-developer` debe reverificar el contraste texto/fondo de cada uno contra el `bg-primario`/`bg-secundario` de papel (probablemente pase sin cambios al ser tonos muy próximos a claro, pero confirmarlo, no asumirlo).

**Resultado de la verificación:** los 6 pares de estado no necesitan reverificación real porque su contraste es autocontenido (texto propio sobre fondo propio, p. ej. `nucleo-texto` sobre `nucleo-bg`) — ninguno de los dos lados es `bg-primario`/`bg-secundario`, así que el cambio de tema no los afecta en absoluto; siguen siendo exactamente los ratios ya verificados en §1 (8.08–9.40:1 en claro). Sí se ha verificado, en cambio, el par base `texto-secundario`/`bg-secundario` (usado en metadatos, badges de oposición, etc., no es uno de los "6 pares" pero sí usa `bg-secundario`): en claro daba 4.55:1 (§1, "margen ajustado"); contra el `bg-secundario` de papel (`#F2ECDD`, algo menos luminoso que el `#F2F4F5` de claro) el ratio baja a **4.26:1 — por debajo del mínimo AA de 4.5:1 para texto normal** (aunque bastante por encima del 3:1 de large text). Es un hallazgo real del fondo `#F2ECDD` ya decidido en el mockup, no algo que se pueda resolver eligiendo un valor distinto sin salirse de "no inventar los colores de nuevo" — se implementa tal cual está especificado y se deja anotado aquí para que Diego decida si quiere aceptar ese margen (el texto afectado es metadato secundario, nunca cuerpo de lectura) o ajustar `bg-secundario` de papel ligeramente más oscuro en una próxima revisión.

### El patrón de líneas de cuaderno

Un `background-image` muy sutil (`repeating-linear-gradient` horizontal, opacidad ≤0.10, espaciado igual al interlineado del cuerpo activo) aplicado solo al contenedor de contenido de lectura cuando `data-theme="papel"` — nunca a toda la página (nav, paneles) para no ensuciar visualmente el chrome de la app. Ver el mockup para el efecto exacto; `lead-developer` tiene margen para ajustar la opacidad/espaciado al verlo en pantalla real.

### Modelo de datos

Sin cambios de forma — `tema` ya era un string libre por el Requisito 3.4, solo se añade el valor `"papel"` a las opciones válidas de `lib/preferencias.ts` y al selector de `PreferenciasPanel`.

### Hallazgo incidental durante la implementación: `--tw-prose-*` no llegaba a aplicarse dentro de `.prose`

No es parte de §15 ni §16 — se descubrió durante el recorrido visual de verificación de ambas (probando `data-theme="oscuro"`) y se corrigió en el mismo `app/globals.css` por ser la misma superficie de código. Documentado aquí porque es un hallazgo de implementación, no una decisión de diseño nueva.

El bloque `--tw-prose-body`/`--tw-prose-headings`/`--tw-prose-quotes`/etc. que `app/globals.css` ya definía en `:root` (apuntando a los tokens de §1, para que `@tailwindcss/typography` los usara) **nunca llegaba a aplicarse en la práctica**: el propio plugin redeclara ese mismo bloque de variables directamente sobre el elemento `.prose`, con su paleta clara por defecto (`--tw-prose-quotes:#101828`, etc.). Una declaración puesta directamente sobre un elemento gana siempre a un valor heredado de un ancestro (aquí, `:root`) — esto no depende de capas de cascada, es cómo funciona la herencia CSS con o sin `@layer`. Consecuencia real, visible en el recorrido de verificación: en `data-theme="oscuro"`, las citas (`<blockquote>`, el patrón `> texto` que ya usa `content/estudio/constitucion-espanola.md`) y en general todo el texto de `.prose` se pintaban con la paleta clara por defecto del plugin, prácticamente ilegible sobre fondo oscuro (~1:1 de contraste en el peor caso, muy por debajo del Requisito 1). No era un problema introducido por esta revisión — ya existía desde que se adoptó la paleta Academic Blue/Focused Night (probablemente desde la v1), simplemente no se había notado porque en tema claro los grises por defecto del plugin y los tokens propios son visualmente parecidos.

**Corrección aplicada:** redeclarar el mismo bloque de `--tw-prose-*` directamente sobre el selector `.prose` en `app/globals.css` (mismo patrón ya usado por `.prose u`/`.prose mark.ink-*` para ganarle a las reglas del plugin). Verificado tras el cambio: el color de `<blockquote>`/`<p>` dentro de `.prose` en oscuro pasa de `#101828` (ilegible) a `#e8edf2` (`--texto-primario` oscuro, el valor correcto). `npm run build`/`npm run lint` siguen limpios.
