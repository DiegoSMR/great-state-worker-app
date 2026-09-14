# Tasks: Perfil de oposición

Fase: 3 — Tasks (completa). Fase 4 — Implementación (completa, en la rama `018-perfil-oposicion`). Fase 5 — Verificación (completa, ver sección al final). Pendiente de revisión final de Diego y de su confirmación explícita para abrir el Pull Request hacia `development`.

Generadas a partir de "Componentes afectados" y "Flujo de datos" de `design.md` (aprobado). Cada tarea señala el Requisito de `requirements.md` al que sirve. Un commit por Requisito completado (más uno por tarea de base técnica sin Requisito propio), según `CONSTITUTION.md`.

Las tareas de contenido real (rellenar `content/perfil-oposicion/*.yaml`) se delegan a `preparador-opos`, usando `investigacion-datos.md` como única fuente de datos y `design.md` como esquema — nunca redactadas por `lead-developer`. Se reparten por Requisito según qué campo del esquema sirve cada una (`introduccion` → Requisito 1, `faqEspecificas`/`faq-comunes.yaml` → Requisito 2, `retribuciones` → Requisito 4, `participacion` → Requisito 5), para que cada commit de Requisito incluya tanto el código como el dato real que consume.

## Base técnica (sin Requisito propio)

- [x] T0.1 `lib/dato-oficial.ts`: tipos `DatoOficial<T>`, `Atribucion`, tal cual `design.md`.
  - Satisface: base de tipo para Requisitos 1.3, 4.2, 4.3, 5.2.
- [x] T0.2 `lib/perfil-oposicion.ts`: tipos `RequisitosAcceso`, `IntroduccionOposicion`, `FilaRetribucion`, `ConvocatoriaParticipacion`, `PreguntaFaq`, `PerfilOposicion`; carga de `content/perfil-oposicion/<oposicionId>.yaml` con `readFileSync`/`parse` + caché en memoria (mismo patrón que `lib/temario.ts`); `getPerfilOposicion(oposicionId)` devuelve `null` sin lanzar excepción si el fichero no existe todavía.
  - Satisface: base de lectura para Requisitos 1, 2, 4, 5.
- [x] T0.3 Crear el directorio `content/perfil-oposicion/` (vacío hasta que las tareas de contenido de cada Requisito lo rellenen).
  - Satisface: base para Requisito 1.2/1.3 (estructura de datos).

## Requisito 1 — Introducción general de la oposición

- [x] T1.1 `components/estudio/DatoPendiente.tsx`: tag inline para un `DatoOficial`/`Atribucion` en `estado: "pendiente_confirmar"` — `rounded` (no `rounded-full`), borde discontinuo, tokens `bg-bg-secundario`/`text-texto-secundario`, sin color de estado propio, `nota` en texto plano al lado (nunca tooltip).
  - Satisface: Requisito 1.3.
- [x] T1.2 Contenido: `preparador-opos` redacta el campo `introduccion` (cuerpoEscala, grupoSubgrupo, requisitos.{titulacion,edad,nacionalidad,otros}, funciones) de los 4 `content/perfil-oposicion/<oposicionId>.yaml`, con `retribuciones: []`, `participacion: []`, `faqEspecificas: []` como placeholders a rellenar en Requisitos 2/4/5 — cada dato confirmado con `fuente`/`fechaConsulta` de `investigacion-datos.md`, cada hueco como `estado: "pendiente_confirmar"` con `nota` explicando el motivo (nunca en blanco).
  - Satisface: Requisito 1.1, 1.2, 1.3.
- [x] T1.3 `app/estudio/oposicion/[oposicionId]/page.tsx`: reescritura — cabecera existente + enlace "Ir directamente al temario ↓"; subsecciones "Requisitos de acceso" (`<dl>`) y "Funciones del puesto" (vía `Markdown.tsx`), usando `DatoPendiente` para cada campo pendiente y mostrando `fuente`/`fechaConsulta` cuando está confirmado; ancho de lectura `65–72ch`. Temario existente pasa bajo su propio `<h2>Temario</h2>`. Página sigue funcionando (solo listado de temas) si `getPerfilOposicion` devuelve `null`.
  - Satisface: Requisito 1.1, 1.2, 1.3.

## Requisito 2 — Preguntas frecuentes (FAQ)

- [x] T2.1 `lib/perfil-oposicion.ts`: `getFaqComunes()` (lee `faq-comunes.yaml`, mismo mecanismo de caché) y `getFaqEspecificas(oposicionId)`.
  - Satisface: Requisito 2.1, 2.3, 2.4 (base de datos).
- [x] T2.2 Contenido: `preparador-opos` redacta `content/perfil-oposicion/faq-comunes.yaml` (preguntas transversales a las 4 oposiciones — turno libre, bolsa de trabajo, periodicidad, etc., con `oposiciones: string[]`) y el campo `faqEspecificas` de los 4 `<oposicionId>.yaml` (proceso selectivo propio, estructura de ejercicios, si genera bolsa), citando `fuente` (tipo `Atribucion`) cuando la respuesta depende de un dato oficial concreto (Requisito 2.2), sin `fuente` cuando es explicación general — ninguna pregunta común se copia dentro de `faqEspecificas`.
  - Satisface: Requisito 2.1, 2.2, 2.4.
- [x] T2.3 `components/nav/iconos.tsx`: `IconoPregunta`, mismo patrón `Base` que el resto.
  - Satisface: Requisito 2.3.
- [x] T2.4 `lib/nav-items.ts`: nueva entrada `{ href: "/estudio/faqs", etiqueta: "FAQs", icono: "pregunta" }`.
  - Satisface: Requisito 2.3.
- [x] T2.5 `app/estudio/faqs/page.tsx`: sección nueva con nav local pegajosa (Comunes + una pestaña por oposición) y preguntas como `<details>` nativo cerradas por defecto (mismo patrón que `FuenteNormativa`).
  - Satisface: Requisito 2.3, 2.4.
- [x] T2.6 `app/estudio/oposicion/[oposicionId]/page.tsx`: subsección "Preguntas frecuentes" — solo `faqEspecificas` de esa oposición, termina con enlace a `/estudio/faqs#faq-comunes` (nunca repite el texto de una pregunta común).
  - Satisface: Requisito 2.1, 2.4.

## Requisito 3 — Comparativa de temario entre oposiciones en alcance

- [x] T3.1 `lib/temario.ts`: `getResumenNucleoComun(oposicionId)` — `totalTemas`, `nucleoComun`, `compartidoCon` (derivado de `getConceptosEnAlcance()`/`getOposicionesDeConcepto()`, sin fichero nuevo).
  - Satisface: Requisito 3.1, 3.3.
- [x] T3.2 `lib/temario.ts`: `getComparativaTemario()` — una fila por concepto, `porOposicion` (num + tituloOficial por oposición que lo incluye), ordenado por nº de oposiciones que lo comparten (desc.) y luego alfabético.
  - Satisface: Requisito 3.2, 3.3.
- [x] T3.3 `app/estudio/oposicion/[oposicionId]/page.tsx`: primera subsección — franja de núcleo común (usa T3.1), enlaza a `/estudio/comparativa-temario`.
  - Satisface: Requisito 3.1.
- [x] T3.4 `app/estudio/comparativa-temario/page.tsx`: vista nueva — tabla con cabecera sticky, columna identidad + 4 columnas de oposición (numeración propia como pill-enlace, `–` cuando la oposición no incluye el concepto — nunca `DatoPendiente`), `overflow-x-auto` con aviso de scroll en móvil estrecho. Sin entrada propia en `lib/nav-items.ts` (decisión de `disenador-maquetador`, ver `design.md`).
  - Satisface: Requisito 3.2, 3.3.

## Requisito 4 — Datos retributivos

- [x] T4.1 Contenido: `preparador-opos` rellena el campo `retribuciones: FilaRetribucion[]` de los 4 `<oposicionId>.yaml` con las cifras de `investigacion-datos.md` (concepto, grupo `base`/`complemento_especifico`, año del ejercicio, `dato` como `DatoOficial<string>` ya formateado) — complemento específico no publicado se deja `estado: "pendiente_confirmar"` con `nota`, nunca estimado.
  - Satisface: Requisito 4.1, 4.2, 4.3.
- [x] T4.2 `app/estudio/oposicion/[oposicionId]/page.tsx`: subsección "Retribución del puesto" — tabla con filas agrupadas ("Retribución base"/"Complemento específico"), columnas Concepto/Importe/Año/Fuente siempre visibles; grupo vacío usa `DatoPendiente` en la celda de importe sin color de advertencia (es el caso esperado, Requisito 4.2). Ancho completo del contenedor (tabular, no 65–72ch).
  - Satisface: Requisito 4.1, 4.2, 4.3.

## Requisito 5 — Datos de participación (plazas y aspirantes)

- [x] T5.1 `lib/perfil-oposicion.ts`: `getRatioParticipacion(c: ConvocatoriaParticipacion)` — `null` si `plazas` o `aspirantes` no están `estado: "confirmado"`, cociente si ambos lo están.
  - Satisface: Requisito 5.2 (por construcción, no por `if` disperso en UI).
- [x] T5.2 Contenido: `preparador-opos` rellena el campo `participacion: ConvocatoriaParticipacion[]` de los 4 `<oposicionId>.yaml` (una fila por convocatoria conocida, `etiqueta` libre) con los datos de `investigacion-datos.md` — aspirantes no publicados quedan `estado: "pendiente_confirmar"` con `nota`, nunca omitidos en silencio ni estimados.
  - Satisface: Requisito 5.1, 5.2, 5.3.
- [x] T5.3 `app/estudio/oposicion/[oposicionId]/page.tsx`: subsección "Plazas y participación" — tabla Convocatoria/Plazas/Aspirantes/Ratio, una fila por convocatoria (histórico del 5.3 sin componente adicional); celda "Aspirantes" pendiente usa `DatoPendiente`, celda "Ratio" en ese caso es un guión discreto (no un segundo `DatoPendiente`, sería redundante en la misma fila).
  - Satisface: Requisito 5.1, 5.2, 5.3.

## Verificación (Fase 5)

- [x] V1 `npm run lint` y `npm run build` limpios.
- [x] V2 Recorrido en navegador (dev server, Playwright headless si `chromium-cli` no disponible, puerto 3031): `/estudio/oposicion/dga-aux-adm` (perfil mejor documentado), `/estudio/oposicion/dpz-aux-adm` (caso casi todo `pendiente_confirmar`), `/estudio/faqs` (nav local + pestañas), `/estudio/comparativa-temario` (scroll horizontal en móvil), claro/oscuro, sin errores de consola.
- [x] V3 Repaso criterio a criterio de los 5 Requisitos de `requirements.md` con evidencia concreta (archivo/línea/comportamiento) — sección "Verificación" propia al final de este documento.
- [x] V4 Actualizar `ARCHITECTURE.md` con la decisión de `DatoOficial<T>`/`Atribucion` y `content/perfil-oposicion/*.yaml` (mismo criterio ya documentado ahí para `content/temario.yaml`/`content/estudio/*.md`).

## Verificación

Repaso criterio a criterio de `requirements.md`, con evidencia concreta. `npm run lint` y `npm run build` limpios en cada uno de los 5 commits de Requisito (verificado tras cada commit, no solo al final); recorrido visual con Playwright headless (dev server, puerto 3031) en las 4 oposiciones + `/estudio/faqs` + `/estudio/comparativa-temario`, claro/oscuro + móvil 390px, sin errores de consola en ningún caso.

### Requisito 1 — Introducción general de la oposición

1. **Introducción antes del listado de temas, con organismo/cuerpo-escala/grupo-subgrupo/funciones/requisitos.** `app/estudio/oposicion/[oposicionId]/page.tsx` — sección "Requisitos de acceso" (`<dl>`, líneas ~88-100 tras el commit de Requisito 5) y "Funciones del puesto" se renderizan entre la cabecera (que ya mostraba organismo/subgrupo) y el `<h2>Temario</h2>`. Confirmado visualmente en las 4 oposiciones (capturas `018_estudio_oposicion_*_claro.png`/`_oscuro.png`).
2. **Fuente referenciada para dato confirmado.** `CampoDato`/`FuenteInline` (mismo componente en las 4 oposiciones) muestran `fuente` + `fechaConsulta` bajo cada valor confirmado, con enlace cuando `extraerEnlaceFuente` puede extraer una URL — visible en DGA/AGE, donde la mayoría de campos están confirmados (captura `018_estudio_oposicion_dga-aux-adm_claro.png`).
3. **Dato no verificado se muestra "pendiente de confirmar", nunca inventado.** `DatoPendiente` (`components/estudio/DatoPendiente.tsx`) usado en todos los campos `estado: "pendiente_confirmar"`; a nivel de tipo (`lib/dato-oficial.ts`) es imposible renderizar un `valor` sin `fuente`/`fechaConsulta` porque el tipo unión no lo permite. Verificado en DPZ, donde casi toda la introducción queda `pendiente_confirmar` con nota explicando el bloqueo SSL (captura `018_estudio_oposicion_dpz-aux-adm_claro.png`).

### Requisito 2 — Preguntas frecuentes (FAQ)

1. **FAQ específicas en la introducción de cada oposición.** Sección "Preguntas frecuentes" en `page.tsx`, usando `getFaqEspecificas(oposicionId)` — 4-5 preguntas por oposición, confirmadas en las 4 capturas.
2. **Respuesta basada en bases/normativa, no en academias.** Cada `PreguntaFaq.fuente` de `faqEspecificas` cita `investigacion-datos.md` (BOA/BOE/BOPZ/zaragoza.es) o queda `pendiente_confirmar` con nota — ninguna cita una academia (revisado manualmente el contenido de los 4 YAML antes de comitear).
3. **Sección de FAQs propia y navegable.** `app/estudio/faqs/page.tsx` + entrada `{ href: "/estudio/faqs", etiqueta: "FAQs", icono: "pregunta" }` en `lib/nav-items.ts` (visible en las 3 densidades de nav, confirmado en captura `018_estudio_faqs_claro.png` con nav local de pestañas Comunes + 4 oposiciones).
4. **Pregunta común una sola vez, nunca duplicada.** `content/perfil-oposicion/faq-comunes.yaml` (10 preguntas) es la única fuente de preguntas comunes; `faqEspecificas` de las 4 oposiciones no repite ninguna (revisado contenido). A nivel de UI, la introducción de cada oposición enlaza a `/estudio/faqs#faq-comunes` en vez de repetir el texto.

### Requisito 3 — Comparativa de temario entre oposiciones en alcance

1. **Resumen de núcleo común en la introducción.** Franja superior con badge + "`N` de `M` temas son núcleo común — compartido con...", usando `getResumenNucleoComun()` (`lib/temario.ts`) — visible en las 4 capturas, primera sección tras el enlace "Ir directamente al temario".
2. **Vista comparativa completa.** `app/estudio/comparativa-temario/page.tsx`, tabla con cabecera + columna identidad + 4 columnas de oposición, pill-enlace con numeración propia, `–` cuando no incluido — confirmada visualmente (`018_estudio_comparativa-temario_claro.png`), cabecera sticky y cuerpo `overflow-x-auto` con aviso "Desliza..." en móvil (`018_comparativa_mobile.png`, 390px).
3. **Sin fuente de datos nueva.** `getResumenNucleoComun`/`getComparativaTemario` (`lib/temario.ts`) se derivan solo de `getConceptosEnAlcance()`/`getOposicionesDeConcepto()`, ya existentes sobre `content/temario.yaml` — no se creó ningún fichero de datos nuevo para esta vista.

### Requisito 4 — Datos retributivos

1. **Tabla retributiva oficial del puesto.** Sección "Retribución del puesto" en `page.tsx`, filas agrupadas "Retribución base"/"Complemento específico", columnas Concepto/Importe/Año/Fuente — confirmada en las 4 capturas (Ayuntamiento de Zaragoza con 8 filas, mayoría confirmadas 2025/2026).
2. **Complemento específico no publicado → solo base, marcado pendiente.** DPZ/DGA/AGE muestran únicamente filas `pendiente_confirmar` (con nota del motivo real: bloqueo SSL, acuerdo sin cifras accesibles, fallo de acceso a PDF de SEPG) — nunca una cifra estimada; Ayuntamiento de Zaragoza marca el complemento específico real del puesto como pendiente y etiqueta explícitamente el ejemplo de estrato 00002 como "no necesariamente el que aplica".
3. **Ejercicio/año y fuente en cada cifra.** Columnas "Año" y "Fuente" siempre visibles en la tabla (`FilaRetribucion.anio` + `dato.fuente`/`fechaConsulta` cuando confirmado, `—` cuando pendiente) — verificado en las 4 capturas.

### Requisito 5 — Datos de participación (plazas y aspirantes)

1. **Plazas, aspirantes y ratio de la convocatoria más reciente.** Sección "Plazas y participación", tabla Convocatoria/Plazas/Aspirantes/Ratio — confirmada en las 4 oposiciones (Ayuntamiento de Zaragoza y AGE con varias filas).
2. **Sin dato de aspirantes → ratio omitida, no estimada.** `getRatioParticipacion()` (`lib/perfil-oposicion.ts`) devuelve `null` si `plazas` o `aspirantes` no están `estado: "confirmado"`; la celda "Ratio" muestra un guión discreto en ese caso (nunca un `DatoPendiente` redundante en la misma fila) — las 4 oposiciones tienen `aspirantes: pendiente_confirmar` en todas sus filas, así que la ratio nunca se calcula todavía, visible en las 4 capturas.
3. **Varias convocatorias para percibir tendencia.** Ayuntamiento de Zaragoza (3 filas: turno libre 2025, ampliación 2025, histórica 2019) y AGE (3 filas: OEP 2025/2023/2021) muestran más de un dato histórico — confirmado en capturas.

### Decisiones tomadas durante la implementación (no reabren `design.md`)

- El ancho de lectura 65-72ch, aplicado en `design.md` como una única regla `[&>section]:max-w-[70ch]` sobre el contenedor, se aplicó en su lugar `max-w-[70ch]` por sección individual de prosa (Requisitos de acceso, Funciones, FAQ), dejando las dos secciones tabulares (Retribución, Participación) sin esa clase — necesario para que ocupen el ancho completo del contenedor tal como pide el punto 1 de la decisión de `disenador-maquetador`, sin depender del sufijo `!important` de Tailwind v4 (no usado en ningún otro punto del código existente). No cambia ningún criterio de aceptación, es un detalle de implementación del mismo layout ya decidido.
- La columna "Fuente" de las tablas de retribución muestra el texto de `fuente` (enlazado cuando `extraerEnlaceFuente` encuentra URL) con `fechaConsulta` debajo en texto pequeño, en vez de mostrar solo la fecha — `design.md` no especificaba el contenido exacto de esa celda, esta forma sigue el mismo criterio de trazabilidad que `FuenteInline` en el resto de la página.
- No se encontró ninguna discrepancia entre `design.md` y lo que hizo falta implementar — el esquema de tipos, la decisión de FAQ comunes deduplicadas, y el resto de decisiones de `disenador-maquetador` encajaron sin fricción.

### Estado de los 5 YAML de contenido

| Fichero | introducción | retribuciones | participación | faqEspecificas |
|---|---|---|---|---|
| `dga-aux-adm.yaml` | 5/7 confirmados | 0/3 confirmadas | 1/1 plazas confirmada | 4 preguntas, 0 pendientes |
| `age-aux-general.yaml` | 6/7 confirmados | 0/3 confirmadas | 1/3 plazas confirmadas | 5 preguntas, 1 pendiente |
| `ayto-zgz-aux-adm.yaml` | 3/7 confirmados | 7/8 confirmadas | 2/3 plazas confirmadas | 4 preguntas, 3 pendientes |
| `dpz-aux-adm.yaml` | 3/7 confirmados | 0/2 confirmadas | 1/1 plazas confirmada | 4 preguntas, 2 pendientes |
| `faq-comunes.yaml` | — | — | — | 10 preguntas, redactadas desde cero, sin depender de dato oficial puntual |

DPZ queda, como anticipaba `investigacion-datos.md`, la oposición con más huecos — bloqueada por el error de certificado SSL de `dpz.es` documentado al final de ese informe, todavía sin resolver. No es un fallo de esta implementación: el diseño (T0.2, `getPerfilOposicion` null-safe) y el contenido ya están preparados para que baste con volver a ejecutar las tareas de contenido de cada Requisito sobre DPZ el día que ese bloqueo se resuelva, sin tocar ni una línea de código.
