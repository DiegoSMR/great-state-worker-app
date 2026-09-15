# Requirements: Rediseño visual (acento, elevación, marca, tipografía)

Fase: 1 — Requirements. Estado: borrador, pendiente de aprobación de Diego.
Última actualización: 2026-09-15

## Resumen

A partir de `specs/003-sistema-de-diseno/investigacion-referencias-visuales.md` (comparativa con Anki, Notion, RemNote, Linear, Duolingo, Brilliant.org, Readwise Reader, Todoist y Obsidian), esta spec aborda las 4 propuestas de menor esfuerzo y mayor impacto visual (P1–P4 del documento): acento de interacción, elevación sutil, wordmark propio y jerarquía tipográfica por peso. Ninguna de las cuatro reabre la paleta de color base, el modelo de 3 densidades de navegación ni el patrón tabs+scrollspy de `SeccionesConcepto` — todo se construye encima de lo ya aprobado en `specs/003-sistema-de-diseno/`.

## Requisito 1: Acento de interacción

**Historia:** Como usuario, quiero que los elementos interactivos y de marca se distingan visualmente de los estáticos, para que la app se perciba con jerarquía en vez de como un formulario plano.

**Criterios de aceptación:**
1. CUANDO se muestra un elemento interactivo seleccionado o activo (pestaña activa de `SeccionesConcepto`, entrada de navegación activa) ENTONCES el sistema DEBERÁ usar un color de acento distinto del texto normal, en vez del mismo tono que el cuerpo del texto.
2. CUANDO se define el token de acento ENTONCES el sistema DEBERÁ reutilizar el valor y el contraste ya verificados en `notas-de-diseno.md` §8 (`#1E3A5F` claro / `#D590A5` oscuro), sin abrir una nueva investigación de contraste.
3. CUANDO se aplica el acento ENTONCES el sistema DEBERÁ reservarlo para roles de interacción/marca (seleccionado, foco, marca), nunca para decorar contenido de estudio, que sigue el sistema `ink-*` ya existente.

## Requisito 2: Elevación sutil

**Historia:** Como usuario, quiero que las superficies de la app (tarjetas, paneles, diálogos) se perciban con algo de profundidad, para que la interfaz no se vea plana.

**Criterios de aceptación:**
1. CUANDO se muestra una tarjeta de catálogo, el panel de preferencias o un `<dialog>` ENTONCES el sistema DEBERÁ aplicar una sombra sutil (opacidad baja) además del borde ya existente, no en sustitución de él.
2. CUANDO se aplica la sombra ENTONCES el sistema DEBERÁ mantenerla coherente y perceptible en los 3 temas (claro/oscuro/papel), sin degradar el contraste ya verificado de cada uno.

## Requisito 3: Wordmark propio

**Historia:** Como usuario, quiero un logo/wordmark real en vez del texto placeholder "GSW", para que la navegación tenga una identidad reconocible.

**Criterios de aceptación:**
1. CUANDO se muestra el enlace a inicio en cualquiera de las 3 variantes de navegación (`NavIconos`, `NavVisible`, `NavHamburguesa`) ENTONCES el sistema DEBERÁ mostrar un wordmark/mark con tratamiento tipográfico propio, no el texto sin tratar "GSW".
2. CUANDO se aplica el wordmark ENTONCES el sistema DEBERÁ mantenerlo coherente en las 3 densidades de navegación y en los 3 temas.

## Requisito 4: Jerarquía tipográfica por peso

**Historia:** Como usuario, quiero que los títulos se perciban como titulares y no solo como texto más grande, para que la jerarquía de cada página sea clara de un vistazo.

**Criterios de aceptación:**
1. CUANDO se muestra un h1/h2/h3 en cualquier página de la app ENTONCES el sistema DEBERÁ aplicar un criterio único y documentado de peso tipográfico por nivel, sustituyendo el criterio actual (inconsistente entre `font-semibold`/`font-medium` sin patrón documentado).
2. CUANDO se define el nuevo criterio ENTONCES el sistema DEBERÁ aplicarlo de forma consistente en todas las páginas ya construidas bajo `app/estudio/**`, no solo en las que se construyan a partir de ahora.

## Fuera de alcance

- Paleta de color base (Academic Blue / Focused Night) — no se reabre, ya verificada.
- Modelo de 3 densidades de navegación y patrón tabs+scrollspy de `SeccionesConcepto` — no se reabren.
- **P5** (agrupación visual del catálogo de temas por bloque temático, distinguir núcleo común más allá del badge) — se deja para cuando se aborde junto con o después de `019-filtro-catalogo-por-oposicion`, que ya toca esa misma página.
- **P6** (rediseño de los 2-3 iconos hoy ambiguos entre sí) — iteración futura, sin bloquear esta spec.
- **P7** (superficie de progreso agregado: cobertura de temario, marcadores, posible racha de estudio) — candidata a spec propia; no es un cambio puramente visual, requiere agregación de datos.
