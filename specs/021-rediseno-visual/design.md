# Design: Rediseño visual (acento, elevación, marca, tipografía)

Fase: 2 — Design. Estado: borrador, pendiente de aprobación de Diego.
Última actualización: 2026-09-15

## Visión general

Las 4 decisiones de esta spec son aditivas sobre `specs/003-sistema-de-diseno/`: ningún token base ni componente estructural (`NavShell`, tabs+scrollspy, los 3 temas) se toca — se añaden 2 tokens de color nuevos y se documenta/unifica un criterio de peso tipográfico que hoy varía sin patrón. Todo se aplica en los 3 temas (claro/oscuro/papel).

## Decisiones clave

### Decisión: `--acento-fuerte`, reutilizando "Academic Navy" (`#1E3A5F`) ya verificado, con una derivación propia para oscuro

- **Opción elegida (claro/papel):** `--acento-fuerte: #1E3A5F` — el mismo "Primary dark" que `notas-de-diseno.md` §8 ya dejó verificado (11.00:1 contra `bg-primario` claro) pero nunca activó. Se re-verifica aquí contra los fondos que realmente va a tocar esta spec: **10.84:1** contra `bg-primario` papel (`#fbf8f0`) y **9.76:1** contra `bg-secundario` papel (`#f2ecdd`) — ambos con margen amplio, mismo criterio de verificación par-por-par que el resto del documento.
- **Opción elegida (oscuro):** `notas-de-diseno.md` nunca dio un valor de oscuro para "Primary dark" (el token entero quedó diferido). Se deriva con el mismo método ya documentado en §15 de esa spec para huecos equivalentes (mantener el matiz `H` del valor de Diego, ajustar `S`/`L` para leerse como texto/borde sobre fondo oscuro): `#1E3A5F` → HSL(214°, 52%, 25%) → aclarado a HSL(214°, 60%, 60%) → **`#5C91D6`**. Verificado: **5.50:1** contra `bg-primario` oscuro (`#121820`) y **4.78:1** contra `bg-secundario` oscuro (`#1b2530`) — ambos por encima del mínimo AA (4.5:1).
- **Por qué no el punto medio más pálido (p. ej. `HSL(214°,50%,72%)` ≈ `#94B3DB`):** ese punto da más contraste (8.27:1/7.19:1) pero cae casi encima de `--revision-texto` oscuro (`#91BBD4`, ya en uso para el estado "en revisión normativa") — dos roles distintos (acento de interacción vs. aviso informativo) no deberían leerse como el mismo color. `#5C91D6` es más saturado y algo más oscuro, visualmente distinguible de `#91BBD4` mientras sigue cumpliendo AA con margen.
- **Alternativas consideradas:** `Primary` (`#4F81BD`, 3.86:1 en claro) — descartado como color de *texto* (no llega a 4.5:1), pero queda anotado como candidato válido si en el futuro se necesitara un acento para un elemento no textual (borde/fondo, umbral WCAG 1.4.11 de 3:1) sin comprometer `--acento-fuerte` como texto.
- **Uso:** solo en roles de interacción/marca — pestaña activa de `SeccionesConcepto`, entrada de navegación activa, wordmark (Decisión siguiente). Nunca en contenido de estudio (ese sigue el sistema `ink-*`).
- **Satisface:** Requisito 1 (1, 2, 3)

### Decisión: elevación con `box-shadow` de 2 capas, opacidad baja, variable por tema

- **Opción elegida:** nuevo token `--sombra-tarjeta` en `globals.css`, patrón Notion (2 capas en vez de las 4 que usa Notion — proporcional a la sencillez de nuestras superficies): `0 1px 2px rgba(0,0,0,.06), 0 3px 6px rgba(0,0,0,.05)` en claro/papel. En oscuro, una sombra negra sobre fondo ya oscuro es casi invisible — se sube la opacidad (`rgba(0,0,0,.35)/(0,0,0,.20)`), mismo criterio estándar de temas oscuros tipo Material.
- **Aplicación:** clase utilitaria `.sombra-sutil` (no un componente `<Tarjeta>` nuevo — las superficies afectadas ya usan clases Tailwind ad hoc con `border-borde`, añadir la clase junto a las existentes es más simple que introducir una abstracción de componente para 3-4 sitios).
- **Dónde se aplica (de `investigacion-referencias-visuales.md` §2.4):** tarjetas de `app/estudio/tema/page.tsx` y `app/estudio/page.tsx`, `components/preferencias/PreferenciasPanel.tsx`, el `<dialog>` de navegación móvil.
- **Satisface:** Requisito 2 (1, 2)

### Decisión: wordmark propio, tipográfico, sin ilustración

- **Opción elegida:** nuevo `components/nav/Wordmark.tsx` — una inicial ("G") en peso grueso con `--acento-fuerte`, dentro de un contenedor con el mismo radio de esquina que el resto de controles del rail (`rounded-md`), mismo tamaño que un icono del set existente. Sustituye el texto plano "GSW" en `NavIconos.tsx`, `NavVisible.tsx` y `NavHamburguesa.tsx`.
- **Alternativas consideradas:** encargar un logotipo/ilustración: descartado — fuera de alcance de una spec de "superficie" (Requisito 3 solo pide dejar de usar el placeholder, no diseñar una identidad de marca completa) y sin recursos de diseño gráfico dedicados en el proyecto.
- **Satisface:** Requisito 3 (1, 2)

### Decisión: escala de peso tipográfico documentada, única para h1/h2/h3

- **Opción elegida:** se fija y documenta un criterio único (hoy inconsistente: `font-semibold`/`font-medium` sin patrón entre páginas):
  | Nivel | Peso | Uso |
  |---|---|---|
  | h1 | 700 (bold) | Título de página |
  | h2 | 600 (semibold) | Título de sección |
  | h3 | 500 (medium) | Subtítulo |
  | cuerpo | 400 (regular) | Sin cambios |
  Se aplica tanto a los encabezados fuera de markdown (`app/estudio/**`, `SeccionesConcepto.tsx`) como dentro del contenido (`Markdown.tsx`: `prose-h1:font-bold prose-h2:font-semibold prose-h3:font-medium`, sustituyendo el `prose-headings:font-semibold` uniforme actual).
- **Fuera de esta decisión:** compresión de `letter-spacing` en tamaños grandes (mencionada en la investigación como exploración, no como criterio de aceptación de `requirements.md`) — no se incluye, para no exceder lo aprobado en Fase 1.
- **Satisface:** Requisito 4 (1, 2)

## Componentes afectados

- `app/globals.css` — nuevos tokens `--acento-fuerte` (3 temas) y `--sombra-tarjeta` (3 temas), clase `.sombra-sutil`.
- `components/estudio/SeccionesConcepto.tsx` — pestaña activa usa `--acento-fuerte` en vez de `border-texto-primario`.
- `components/nav/NavIconos.tsx`, `NavVisible.tsx`, `NavHamburguesa.tsx` — entrada activa usa `--acento-fuerte`; wordmark nuevo sustituye el texto "GSW".
- `components/nav/Wordmark.tsx` (nuevo).
- `app/estudio/tema/page.tsx`, `app/estudio/page.tsx`, `components/preferencias/PreferenciasPanel.tsx`, `<dialog>` de nav móvil — clase `.sombra-sutil` añadida a las tarjetas/paneles ya existentes.
- `components/estudio/Markdown.tsx` — escala de peso por nivel en `prose-h1/h2/h3`.
- `app/estudio/tema/[conceptoId]/page.tsx` y demás h1/h2/h3 sueltos bajo `app/estudio/**` — unificados al criterio de la tabla.
- `specs/003-sistema-de-diseno/notas-de-diseno.md` — se documenta la activación de `--acento-fuerte`/`--sombra-tarjeta` y la escala de peso, como adenda (mismo criterio que la adenda de "tercer tema papel" ya existente).

## Riesgos y mitigaciones

- **`--acento-fuerte` claro/papel reutiliza el mismo valor que `--revision-texto` claro (`#1E3A5F`), ya en uso para el aviso "en revisión normativa"):** riesgo de ambigüedad si ambos aparecieran juntos. Mitigación: los dos roles nunca son co-visibles en el mismo contexto visual inmediato (uno es un banner de aviso dentro del contenido de un concepto, el otro es chrome de navegación/pestañas) — se documenta como riesgo aceptado y verificado en vez de ignorado, y se revisa visualmente durante la implementación (V2 de `tasks.md`) por si en la práctica sí se percibe confuso.
- **Sombras en modo oscuro pueden verse "sucias" si la opacidad es demasiado alta:** mitigación — ajustar visualmente durante implementación dentro del rango ya propuesto (0.20–0.35), no es un valor cerrado a rajatabla.
- **Cambiar el peso de los `prose-headings` puede alterar el ritmo vertical del contenido Markdown ya escrito** (negrita más pesada ocupa más ancho, puede provocar saltos de línea distintos en encabezados largos de `content/estudio/*.md`): mitigación — revisión visual de al menos un concepto con encabezados largos dentro de `esquema`/`resumenExtenso` durante la verificación (V2).
