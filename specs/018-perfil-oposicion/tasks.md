# Tasks: Perfil de oposición

Fase: 3 — Tasks. Generadas a partir de "Componentes afectados" y "Flujo de datos" de `design.md` (aprobado). Cada tarea señala el Requisito de `requirements.md` al que sirve. Un commit por Requisito completado (más uno por tarea de base técnica sin Requisito propio), según `CONSTITUTION.md`.

Las tareas de contenido real (rellenar `content/perfil-oposicion/*.yaml`) se delegan a `preparador-opos`, usando `investigacion-datos.md` como única fuente de datos y `design.md` como esquema — nunca redactadas por `lead-developer`. Se reparten por Requisito según qué campo del esquema sirve cada una (`introduccion` → Requisito 1, `faqEspecificas`/`faq-comunes.yaml` → Requisito 2, `retribuciones` → Requisito 4, `participacion` → Requisito 5), para que cada commit de Requisito incluya tanto el código como el dato real que consume.

## Base técnica (sin Requisito propio)

- [ ] T0.1 `lib/dato-oficial.ts`: tipos `DatoOficial<T>`, `Atribucion`, tal cual `design.md`.
  - Satisface: base de tipo para Requisitos 1.3, 4.2, 4.3, 5.2.
- [ ] T0.2 `lib/perfil-oposicion.ts`: tipos `RequisitosAcceso`, `IntroduccionOposicion`, `FilaRetribucion`, `ConvocatoriaParticipacion`, `PreguntaFaq`, `PerfilOposicion`; carga de `content/perfil-oposicion/<oposicionId>.yaml` con `readFileSync`/`parse` + caché en memoria (mismo patrón que `lib/temario.ts`); `getPerfilOposicion(oposicionId)` devuelve `null` sin lanzar excepción si el fichero no existe todavía.
  - Satisface: base de lectura para Requisitos 1, 2, 4, 5.
- [ ] T0.3 Crear el directorio `content/perfil-oposicion/` (vacío hasta que las tareas de contenido de cada Requisito lo rellenen).
  - Satisface: base para Requisito 1.2/1.3 (estructura de datos).

## Requisito 1 — Introducción general de la oposición

- [ ] T1.1 `components/estudio/DatoPendiente.tsx`: tag inline para un `DatoOficial`/`Atribucion` en `estado: "pendiente_confirmar"` — `rounded` (no `rounded-full`), borde discontinuo, tokens `bg-bg-secundario`/`text-texto-secundario`, sin color de estado propio, `nota` en texto plano al lado (nunca tooltip).
  - Satisface: Requisito 1.3.
- [ ] T1.2 Contenido: `preparador-opos` redacta el campo `introduccion` (cuerpoEscala, grupoSubgrupo, requisitos.{titulacion,edad,nacionalidad,otros}, funciones) de los 4 `content/perfil-oposicion/<oposicionId>.yaml`, con `retribuciones: []`, `participacion: []`, `faqEspecificas: []` como placeholders a rellenar en Requisitos 2/4/5 — cada dato confirmado con `fuente`/`fechaConsulta` de `investigacion-datos.md`, cada hueco como `estado: "pendiente_confirmar"` con `nota` explicando el motivo (nunca en blanco).
  - Satisface: Requisito 1.1, 1.2, 1.3.
- [ ] T1.3 `app/estudio/oposicion/[oposicionId]/page.tsx`: reescritura — cabecera existente + enlace "Ir directamente al temario ↓"; subsecciones "Requisitos de acceso" (`<dl>`) y "Funciones del puesto" (vía `Markdown.tsx`), usando `DatoPendiente` para cada campo pendiente y mostrando `fuente`/`fechaConsulta` cuando está confirmado; ancho de lectura `65–72ch`. Temario existente pasa bajo su propio `<h2>Temario</h2>`. Página sigue funcionando (solo listado de temas) si `getPerfilOposicion` devuelve `null`.
  - Satisface: Requisito 1.1, 1.2, 1.3.

## Requisito 2 — Preguntas frecuentes (FAQ)

- [ ] T2.1 `lib/perfil-oposicion.ts`: `getFaqComunes()` (lee `faq-comunes.yaml`, mismo mecanismo de caché) y `getFaqEspecificas(oposicionId)`.
  - Satisface: Requisito 2.1, 2.3, 2.4 (base de datos).
- [ ] T2.2 Contenido: `preparador-opos` redacta `content/perfil-oposicion/faq-comunes.yaml` (preguntas transversales a las 4 oposiciones — turno libre, bolsa de trabajo, periodicidad, etc., con `oposiciones: string[]`) y el campo `faqEspecificas` de los 4 `<oposicionId>.yaml` (proceso selectivo propio, estructura de ejercicios, si genera bolsa), citando `fuente` (tipo `Atribucion`) cuando la respuesta depende de un dato oficial concreto (Requisito 2.2), sin `fuente` cuando es explicación general — ninguna pregunta común se copia dentro de `faqEspecificas`.
  - Satisface: Requisito 2.1, 2.2, 2.4.
- [ ] T2.3 `components/nav/iconos.tsx`: `IconoPregunta`, mismo patrón `Base` que el resto.
  - Satisface: Requisito 2.3.
- [ ] T2.4 `lib/nav-items.ts`: nueva entrada `{ href: "/estudio/faqs", etiqueta: "FAQs", icono: "pregunta" }`.
  - Satisface: Requisito 2.3.
- [ ] T2.5 `app/estudio/faqs/page.tsx`: sección nueva con nav local pegajosa (Comunes + una pestaña por oposición) y preguntas como `<details>` nativo cerradas por defecto (mismo patrón que `FuenteNormativa`).
  - Satisface: Requisito 2.3, 2.4.
- [ ] T2.6 `app/estudio/oposicion/[oposicionId]/page.tsx`: subsección "Preguntas frecuentes" — solo `faqEspecificas` de esa oposición, termina con enlace a `/estudio/faqs#faq-comunes` (nunca repite el texto de una pregunta común).
  - Satisface: Requisito 2.1, 2.4.

## Requisito 3 — Comparativa de temario entre oposiciones en alcance

- [ ] T3.1 `lib/temario.ts`: `getResumenNucleoComun(oposicionId)` — `totalTemas`, `nucleoComun`, `compartidoCon` (derivado de `getConceptosEnAlcance()`/`getOposicionesDeConcepto()`, sin fichero nuevo).
  - Satisface: Requisito 3.1, 3.3.
- [ ] T3.2 `lib/temario.ts`: `getComparativaTemario()` — una fila por concepto, `porOposicion` (num + tituloOficial por oposición que lo incluye), ordenado por nº de oposiciones que lo comparten (desc.) y luego alfabético.
  - Satisface: Requisito 3.2, 3.3.
- [ ] T3.3 `app/estudio/oposicion/[oposicionId]/page.tsx`: primera subsección — franja de núcleo común (usa T3.1), enlaza a `/estudio/comparativa-temario`.
  - Satisface: Requisito 3.1.
- [ ] T3.4 `app/estudio/comparativa-temario/page.tsx`: vista nueva — tabla con cabecera sticky, columna identidad + 4 columnas de oposición (numeración propia como pill-enlace, `–` cuando la oposición no incluye el concepto — nunca `DatoPendiente`), `overflow-x-auto` con aviso de scroll en móvil estrecho. Sin entrada propia en `lib/nav-items.ts` (decisión de `disenador-maquetador`, ver `design.md`).
  - Satisface: Requisito 3.2, 3.3.

## Requisito 4 — Datos retributivos

- [ ] T4.1 Contenido: `preparador-opos` rellena el campo `retribuciones: FilaRetribucion[]` de los 4 `<oposicionId>.yaml` con las cifras de `investigacion-datos.md` (concepto, grupo `base`/`complemento_especifico`, año del ejercicio, `dato` como `DatoOficial<string>` ya formateado) — complemento específico no publicado se deja `estado: "pendiente_confirmar"` con `nota`, nunca estimado.
  - Satisface: Requisito 4.1, 4.2, 4.3.
- [ ] T4.2 `app/estudio/oposicion/[oposicionId]/page.tsx`: subsección "Retribución del puesto" — tabla con filas agrupadas ("Retribución base"/"Complemento específico"), columnas Concepto/Importe/Año/Fuente siempre visibles; grupo vacío usa `DatoPendiente` en la celda de importe sin color de advertencia (es el caso esperado, Requisito 4.2). Ancho completo del contenedor (tabular, no 65–72ch).
  - Satisface: Requisito 4.1, 4.2, 4.3.

## Requisito 5 — Datos de participación (plazas y aspirantes)

- [ ] T5.1 `lib/perfil-oposicion.ts`: `getRatioParticipacion(c: ConvocatoriaParticipacion)` — `null` si `plazas` o `aspirantes` no están `estado: "confirmado"`, cociente si ambos lo están.
  - Satisface: Requisito 5.2 (por construcción, no por `if` disperso en UI).
- [ ] T5.2 Contenido: `preparador-opos` rellena el campo `participacion: ConvocatoriaParticipacion[]` de los 4 `<oposicionId>.yaml` (una fila por convocatoria conocida, `etiqueta` libre) con los datos de `investigacion-datos.md` — aspirantes no publicados quedan `estado: "pendiente_confirmar"` con `nota`, nunca omitidos en silencio ni estimados.
  - Satisface: Requisito 5.1, 5.2, 5.3.
- [ ] T5.3 `app/estudio/oposicion/[oposicionId]/page.tsx`: subsección "Plazas y participación" — tabla Convocatoria/Plazas/Aspirantes/Ratio, una fila por convocatoria (histórico del 5.3 sin componente adicional); celda "Aspirantes" pendiente usa `DatoPendiente`, celda "Ratio" en ese caso es un guión discreto (no un segundo `DatoPendiente`, sería redundante en la misma fila).
  - Satisface: Requisito 5.1, 5.2, 5.3.

## Verificación (Fase 5)

- [ ] V1 `npm run lint` y `npm run build` limpios.
- [ ] V2 Recorrido en navegador (dev server, Playwright headless si `chromium-cli` no disponible, puerto 3031): `/estudio/oposicion/dga-aux-adm` (perfil mejor documentado), `/estudio/oposicion/dpz-aux-adm` (caso casi todo `pendiente_confirmar`), `/estudio/faqs` (nav local + pestañas), `/estudio/comparativa-temario` (scroll horizontal en móvil), claro/oscuro, sin errores de consola.
- [ ] V3 Repaso criterio a criterio de los 5 Requisitos de `requirements.md` con evidencia concreta (archivo/línea/comportamiento) — sección "Verificación" propia al final de este documento.
- [ ] V4 Actualizar `ARCHITECTURE.md` con la decisión de `DatoOficial<T>`/`Atribucion` y `content/perfil-oposicion/*.yaml` (mismo criterio ya documentado ahí para `content/temario.yaml`/`content/estudio/*.md`).
