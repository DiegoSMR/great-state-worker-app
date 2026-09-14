# Design: Perfil de oposición

Fase: 2 — Design. Estado: borrador, pendiente de aprobación de Diego.
Última actualización: 2026-09-15

## Visión general

Esta spec añade una capa de contenido nueva — pero de una naturaleza distinta a la que ya existe en `content/estudio/*.md` (texto largo, una fuente por concepto). Lo que se necesita aquí son **muchos datos sueltos y cortos por oposición** (un organismo, cuatro requisitos, una tabla de retribuciones con varias filas, una tabla de participación con varias convocatorias, un puñado de preguntas frecuentes), cada uno con su propia fecha/fuente/estado de verificación — y donde, según `investigacion-datos.md`, una fracción alta de esos datos va a estar en estado "pendiente de confirmar" desde el primer día, no como excepción sino como norma (funciones del puesto y aspirantes presentados, vacíos en las 4 oposiciones).

Esto obliga a una decisión de modelado distinta a la ya usada en el proyecto: en vez de un frontmatter único por fichero (que asume una sola fuente para todo el documento, válido para "Texto oficial" de un concepto pero no aquí), cada dato individual lleva su propio estado + fuente. El resto de esta spec —FAQ, comparativa de temario, tabla retributiva, participación— se construye sobre esa misma pieza base.

La UI se ha diseñado en coordinación con `disenador-maquetador` (decisiones íntegras más abajo, atribuidas) — no se ha decidido en solitario, según el reparto de responsabilidades de `CONSTITUTION.md`.

## Decisiones clave

### Decisión: Tipo `DatoOficial<T>` — trazabilidad por dato individual, no por fichero

- **Opción elegida:** se introduce un tipo genérico, pensado explícitamente como patrón reutilizable (no solo para esta spec — también encaja con el mismo criterio "pendiente de confirmar" que ya pide `specs/016-convocatorias/requirements.md`, todavía sin `design.md`):

  ```ts
  // lib/dato-oficial.ts
  export type DatoOficial<T> =
    | { estado: "confirmado"; valor: T; fuente: string; fechaConsulta: string }
    | { estado: "pendiente_confirmar"; nota?: string };

  /** Igual que DatoOficial pero sin `valor` propio — para atribuir una fuente a
   * contenido que ya existe por sí mismo (p. ej. la respuesta de una FAQ), no
   * a un dato que haya que mostrar. */
  export type Atribucion =
    | { estado: "confirmado"; fuente: string; fechaConsulta: string }
    | { estado: "pendiente_confirmar"; nota?: string };
  ```

  `nota` es opcional y libre (p. ej. "Bloqueo SSL en dpz.es, no se pudo verificar" o "Varios estratos posibles en la tabla oficial, no se pudo confirmar cuál aplica") — permite que `preparador-opos` deje constancia de *por qué* falta el dato sin forzar un campo estructurado para algo que solo hace falta en prosa libre.
- **Alternativas consideradas:**
  - Un único booleano `confirmado: boolean` + `valor` siempre presente (vacío si no confirmado). Descartado: no distingue "vacío porque no hay dato" de "vacío porque el valor real es una cadena vacía", y no dejaría sitio a `fuente`/`fechaConsulta` de forma tipada — habría que leerlos como opcionales sueltos sin que el tipo garantice que solo existen cuando `confirmado` es verdadero.
  - Reutilizar el campo `en_revision: boolean` ya existente en `content/estudio/*.md` (`specs/003-sistema-de-diseno`). Descartado: `en_revision` responde a una pregunta distinta ("esto existe pero puede haber cambiado"), aquí la pregunta es "esto no existe todavía verificado" — mezclar los dos conceptos en el mismo campo confundiría a `verificador-vigencia-normativa`, cuyo trabajo es específicamente sobre contenido ya escrito.
- **Satisface:** Requisito 1.3, 4.2, 4.3, 5.2 (el criterio "pendiente de confirmar, nunca inventar" se cumple a nivel de tipo, no solo de UI — es imposible renderizar un valor sin que también exista su `fuente`/`fechaConsulta`, porque el tipo no lo permite).

### Decisión: Los datos nuevos viven en `content/perfil-oposicion/*.yaml`, no en Markdown+frontmatter ni en `content/temario.yaml`

- **Opción elegida:** un fichero YAML por oposición (`content/perfil-oposicion/<oposicionId>.yaml`) más uno compartido para las FAQ comunes (`content/perfil-oposicion/faq-comunes.yaml`). Mismo mecanismo de lectura que `content/temario.yaml` (`readFileSync` + `parse` del paquete `yaml`, ya dependencia del proyecto — no se añade ninguna librería nueva), con caché en memoria del mismo estilo que `lib/temario.ts`.
- **Por qué no Markdown+frontmatter (patrón de `content/estudio/*.md`):** ese patrón fue diseñado para un documento largo con **una** procedencia por fichero (`fuentes:` en el frontmatter, cuerpo en Markdown). Aquí cada fichero necesitaría en la práctica un `DatoOficial` por campo dentro del propio frontmatter — lo que en YAML plano es exactamente igual de expresivo y no obliga a inventar una sintaxis de frontmatter anidado más compleja que la que ya existe, ni a fragmentar en decenas de ficheros `.md` de una frase cada uno (un fichero por "funciones del puesto", otro por "edad", etc.) para conseguir atribución por campo.
- **Por qué no `content/temario.yaml`:** ese fichero tiene un propósito ya fijado y acotado por el propio Requisito 3.3 — la tabla de relación oposición↔concepto↔numeración. Los campos `organismo`/`subgrupo`/`fuente` que ya tiene `Oposicion` sirven para identificar la oposición y trazar de dónde salió la numeración del temario (con `fuente` apuntando hoy, en la práctica, a resúmenes de academia en varios casos — ver "Riesgos"), no para atribuir cada dato retributivo o de participación. Mezclar ambos propósitos en el mismo fichero lo convertiría en un documento con dos formas y dos audiencias distintas.
- **Por qué YAML y no JSON:** consistencia con el único precedente de datos estructurados ya versionados del proyecto (`content/temario.yaml`); admite comentarios (útil para que `preparador-opos`/`investigador-convocatorias` dejen contexto junto al dato, como ya hace el propio `content/temario.yaml` en su cabecera) y bloques de texto multilínea legibles (`|`) para los campos de prosa corta (funciones, notas, respuestas de FAQ), algo que JSON no ofrece sin escapar saltos de línea.
- **Alternativas consideradas:** tabla Postgres. Descartada por el mismo criterio ya fijado en `ARCHITECTURE.md` para `content/temario.yaml` y `content/estudio/*.md`: es contenido editado por agentes y versionado en git, no estado de usuario — no hay razón para romper ese patrón aquí.
- **Satisface:** Requisito 1.2, 2.2, 3.3 (no introduce fuente nueva para el temario), 4.3, 5.1.

### Decisión: Esquema completo de `content/perfil-oposicion/<oposicionId>.yaml`

```ts
// lib/perfil-oposicion.ts
import type { DatoOficial, Atribucion } from "@/lib/dato-oficial";

export type RequisitosAcceso = {
  titulacion: DatoOficial<string>;
  edad: DatoOficial<string>;
  nacionalidad: DatoOficial<string>;
  otros: DatoOficial<string>;
};

export type IntroduccionOposicion = {
  /** Denominación oficial completa de cuerpo/escala (p. ej. "Cuerpo Auxiliar de la
   * Administración General de la Comunidad Autónoma de Aragón, Escala Auxiliar
   * Administrativa"). NO sustituye a `Oposicion.organismo`/`.subgrupo` de
   * content/temario.yaml, que se siguen usando tal cual para identificar la
   * oposición en toda la app — este campo es la denominación oficial completa
   * y atribuida, más detallada que el `subgrupo: "C2"` corto ya existente. */
  cuerpoEscala: DatoOficial<string>;
  grupoSubgrupo: DatoOficial<string>;
  requisitos: RequisitosAcceso;
  /** Markdown corto (1-3 párrafos) — renderizado con components/estudio/Markdown.tsx. */
  funciones: DatoOficial<string>;
};

export type FilaRetribucion = {
  concepto: string; // "Sueldo base", "Paga extra", "Complemento de destino", "Complemento específico", "Total bruto anual"...
  grupo: "base" | "complemento_especifico";
  anio: number; // ejercicio económico al que corresponde la cifra (Req 4.3) — no confundir con fechaConsulta
  dato: DatoOficial<string>; // valor ya formateado como texto, p. ej. "738,50 €/mes"
};

export type ConvocatoriaParticipacion = {
  etiqueta: string; // p. ej. "OEP 2025 (examen previsto 2026)" — texto libre, lo redacta preparador-opos
  plazas: DatoOficial<number>;
  aspirantes: DatoOficial<number>;
  // La ratio NUNCA se guarda aquí — se calcula en lib/perfil-oposicion.ts a partir
  // de plazas/aspirantes cuando ambos están confirmados (Decisión siguiente).
};

export type PreguntaFaq = {
  id: string; // slug estable, p. ej. "cuantos-ejercicios-tiene"
  pregunta: string;
  respuesta: string; // Markdown, renderizado con components/estudio/Markdown.tsx
  /** Presente solo si la respuesta depende de un dato oficial concreto (Req 2.2:
   * número de ejercicios, tipo de prueba, sistema de puntuación...). Ausente
   * cuando la pregunta es una explicación general/elaboración propia (p. ej.
   * "¿qué es una bolsa de trabajo?") que no necesita citar una fuente puntual. */
  fuente?: Atribucion;
};

export type PerfilOposicion = {
  oposicionId: string; // debe existir en OPOSICIONES_EN_ALCANCE_V1 (lib/temario.ts) — validado al cargar
  introduccion: IntroduccionOposicion;
  retribuciones: FilaRetribucion[];
  participacion: ConvocatoriaParticipacion[];
  /** Solo las específicas de esta oposición — las comunes viven en faq-comunes.yaml (Decisión siguiente). */
  faqEspecificas: PreguntaFaq[];
};
```

- **Por qué `funciones` es un único `DatoOficial<string>` y no una lista:** según `investigacion-datos.md`, ninguna de las 4 oposiciones tiene esta información desglosada en fuente oficial accesible — modelarlo como lista de funciones individuales sería anticipar una estructura que no hay evidencia de que exista, y forzaría a `preparador-opos` a inventar un desglose para poder rellenar el campo. Un bloque de texto libre (que puede pasar a lista markdown el día que sí se confirme y tenga sentido desglosarlo) es lo mínimo necesario hoy.
- **Por qué la ratio aspirantes/plaza no se guarda como dato propio:** si se guardara, habría que mantenerla sincronizada a mano cada vez que se corrige `plazas` o `aspirantes` por separado — un cálculo derivado nunca debe vivir duplicado junto a sus operandos. Se calcula en `lib/perfil-oposicion.ts` (o directamente en el componente de UI) solo cuando ambos son `estado: "confirmado"`; si cualquiera de los dos está pendiente, la función devuelve `null` y la UI omite la celda (Requisito 5.2 por construcción, no por un `if` disperso en cada componente).
- **Satisface:** Requisito 1.1, 1.2, 1.3, 4.1, 4.2, 4.3, 5.1, 5.2, 5.3.

### Decisión: FAQ comunes en fichero propio, deduplicadas por construcción

- **Opción elegida:** `content/perfil-oposicion/faq-comunes.yaml` contiene una lista `PreguntaFaq[]` (mismo tipo de arriba) más un campo adicional `oposiciones: string[]` (subconjunto de `OPOSICIONES_EN_ALCANCE_V1` a las que aplica cada pregunta común — normalmente las 4, pero el campo existe por si una pregunta común no aplica literalmente a las 4, p. ej. algo específico de "turno libre" si algún día una de las 4 oposiciones no lo tuviera). Cada pregunta común se escribe **una sola vez**, en este único fichero — nunca se copia dentro de `faqEspecificas` de ningún `<oposicionId>.yaml`. Esto satisface el Requisito 2.4 por construcción del modelo de datos, no por una regla de negocio que alguien tenga que recordar aplicar al redactar contenido: no existe ningún sitio donde una pregunta común *pueda* duplicarse, porque el esquema de `faqEspecificas` de cada oposición y el de `faq-comunes.yaml` son colecciones separadas con responsabilidades distintas.
- **Alternativas consideradas:** un único fichero de FAQ con un campo `alcance: "comun" | oposicionId` por pregunta, en vez de dos colecciones separadas. Se descarta por preferencia de legibilidad — separar el fichero hace visualmente imposible mezclar por error una pregunta específica dentro del bloque "común" al editar a mano, mientras que un campo `alcance` sí lo permitiría por un simple error de tecleo sin que nada lo impida estructuralmente.
- **Satisface:** Requisito 2.3, 2.4.

### Decisión: `lib/perfil-oposicion.ts` — funciones de lectura, mismo patrón de caché que `lib/temario.ts`

- **Opción elegida:**
  ```ts
  export function getPerfilOposicion(oposicionId: string): PerfilOposicion | null;
  export function getFaqComunes(): PreguntaFaq[]; // ya resueltas de faq-comunes.yaml
  export function getFaqEspecificas(oposicionId: string): PreguntaFaq[]; // = getPerfilOposicion(id)?.faqEspecificas ?? []
  export function getRatioParticipacion(c: ConvocatoriaParticipacion): number | null; // null si plazas o aspirantes no están confirmados
  ```
  `getPerfilOposicion` devuelve `null` (no lanza excepción) cuando el fichero no existe todavía para una oposición del alcance — mismo criterio defensivo que `getContenidoConcepto` en `lib/contenido.ts` ("ese caso se maneja de forma explícita en la UI, nunca lanzando una excepción sin capturar"). Esto importa especialmente aquí porque, a diferencia de un concepto de temario, es razonable que `preparador-opos` redacte primero el perfil de una oposición (p. ej. DGA, la mejor documentada según `investigacion-datos.md`) antes que las otras tres — la página de oposición debe seguir funcionando (mostrando solo el listado de temas, como hoy) si su perfil todavía no existe, igual que ya hace con conceptos sin `.md`.
- **Satisface:** Requisito 1 (robustez de carga), coherencia con el patrón ya usado en `lib/contenido.ts`.

### Decisión: Comparativa de temario — calculada en `lib/temario.ts`, sin fichero de datos nuevo

- **Opción elegida:** dos funciones nuevas en `lib/temario.ts` (mismo fichero que ya calcula `esNucleoComun`, coherente con que ambas se derivan de la misma tabla de relación):
  ```ts
  export function getResumenNucleoComun(oposicionId: string): {
    totalTemas: number;
    nucleoComun: number;
    compartidoCon: { oposicion: Oposicion; conceptosComunes: number }[];
  };

  export function getComparativaTemario(): {
    concepto: Concepto;
    bloque: string; // bloque temático de referencia — el de la primera oposición que lo define, ver Riesgos
    porOposicion: Partial<Record<string, { num: number; tituloOficial: string }>>; // clave = oposicionId
  }[];
  ```
  Ambas se derivan por completo de `getConceptosEnAlcance()`/`getOposicionesDeConcepto()`, ya existentes — no se lee ningún fichero nuevo. `getComparativaTemario()` ordena por número de oposiciones que comparten el concepto (descendente) y luego alfabéticamente, según la decisión de `disenador-maquetador` (ver más abajo) de que el núcleo más compartido debe leerse primero.
- **Nota sobre "bloque temático" cuando difiere entre oposiciones:** `content/temario.yaml` permite que un mismo concepto tenga un `bloque` distinto según la oposición que lo define (agrupaciones temáticas propias de cada convocatoria). `getComparativaTemario()` usa el bloque de la primera fila encontrada como etiqueta de fila — es una simplificación consciente para la vista comparativa (que necesita una sola etiqueta por fila), sin alterar el dato original por oposición, que sigue disponible sin cambios vía `getTemasDeOposicion()`/`getOposicionesDeConcepto()`.
- **Satisface:** Requisito 3.1, 3.2, 3.3 (no introduce fuente de datos nueva, no duplica el temario).

### Decisión: UI/UX — decisiones de `disenador-maquetador`, incorporadas íntegras

Consultado explícitamente (responsabilidad suya según `CONSTITUTION.md`). Resumen de sus decisiones, remitiendo a la sesión completa para el detalle de clases/tokens exactos que `lead-developer` debe respetar al implementar:

1. **Introducción de oposición** (`app/estudio/oposicion/[oposicionId]/page.tsx`): se inserta como 7 subsecciones nuevas entre la cabecera y el `<ol>` de temas ya existente (ahora bajo su propio `<h2>Temario</h2>`), en este orden: franja de núcleo común → requisitos de acceso (`<dl>`) → funciones del puesto → retribución del puesto → plazas y participación → preguntas frecuentes → temario. Enlace `Ir directamente al temario ↓` bajo la cabecera para no obligar a hacer scroll a quien solo quiere el listado. Subsecciones de prosa mantienen el ancho de lectura `65–72ch`; las tabulares (retribución, participación) van a ancho completo del contenedor.
2. **`DatoPendiente`** (`components/estudio/DatoPendiente.tsx`, nuevo): tratamiento inline y ligero para un dato individual pendiente — tag pequeño (`rounded`, no `rounded-full`, borde discontinuo, tokens `bg-secundario`/`texto-secundario`, sin color de estado propio) más `nota` en texto plano al lado (nunca tooltip — el dispositivo principal es tablet táctil). Explícitamente distinto de `EstadoPendiente` (bloque de página completa) y `AvisoRevision` (banner de sección) — ver tabla comparativa en la sesión de diseño completa. Reutiliza `IconoPendiente` ya existente, a menor escala.
3. **FAQ**: página nueva `/estudio/faqs` con nav local pegajosa (Comunes + una pestaña por oposición) y preguntas como `<details>` nativo (mismo patrón que `FuenteNormativa`, cero JS nuevo), cerradas por defecto. La introducción de cada oposición muestra solo sus preguntas específicas y termina con un enlace a `/estudio/faqs#faq-comunes` — nunca repite el texto de una pregunta común (Requisito 2.4 satisfecho también a nivel de UI, no solo de datos). Nueva entrada `{ href: "/estudio/faqs", etiqueta: "FAQs", icono: "pregunta" }` en `lib/nav-items.ts`, con `IconoPregunta` nuevo en `components/nav/iconos.tsx` (mismo patrón `Base` que el resto de iconos del proyecto).
4. **Comparativa de temario**: ruta propia `/estudio/comparativa-temario` (no vive dentro de cada página de oposición — evita duplicarla 4 veces), enlazada desde la franja de núcleo común de la introducción, sin entrada propia en la navegación global (se considera prematuro frente al crecimiento ya previsto de `lib/nav-items.ts`). Tabla con cabecera sticky, columna identidad + 4 columnas de oposición (numeración propia como pill-enlace, `–` cuando la oposición no incluye ese concepto — nunca `DatoPendiente`, es un hecho estructural, no un dato sin verificar), `overflow-x-auto` con aviso de scroll solo en móvil estrecho.
5. **Tabla retributiva**: una tabla con filas agrupadas ("Retribución base" / "Complemento específico") y columnas Concepto/Importe/Año/Fuente siempre visibles (Requisito 4.3 explícito, sin deferir a un bloque colapsable). El grupo "Complemento específico" vacío usa `DatoPendiente` en la celda de importe **sin ningún color de advertencia** — es el caso esperado (Requisito 4.2), no una anomalía.
6. **Participación**: tabla Convocatoria/Plazas/Aspirantes/Ratio, una fila por convocatoria conocida (resuelve el histórico del Requisito 5.3 sin componente adicional). Celda "Aspirantes" pendiente usa `DatoPendiente`; celda "Ratio" en ese caso es un guión discreto (no un segundo `DatoPendiente` — sería redundante en la misma fila), resolviendo el Requisito 5.2 sin que se lea como error.

- **Satisface:** Requisito 1.1, 2.1, 2.3, 2.4, 3.1, 3.2, 4.1, 4.2, 4.3, 5.1, 5.2, 5.3.

## Componentes afectados

**Nuevos:**
- `lib/dato-oficial.ts` — tipos `DatoOficial<T>`, `Atribucion`.
- `lib/perfil-oposicion.ts` — carga y expone `content/perfil-oposicion/*.yaml`.
- `content/perfil-oposicion/ayto-zgz-aux-adm.yaml`, `dpz-aux-adm.yaml`, `dga-aux-adm.yaml`, `age-aux-general.yaml`, `faq-comunes.yaml` — datos (contenido real, a redactar por `preparador-opos`, ver sección siguiente).
- `components/estudio/DatoPendiente.tsx` — tag inline para dato individual pendiente.
- `components/nav/iconos.tsx` — se añade `IconoPregunta`.
- `app/estudio/faqs/page.tsx` — sección de FAQs.
- `app/estudio/comparativa-temario/page.tsx` — vista comparativa.

**Modificados:**
- `lib/temario.ts` — se añaden `getResumenNucleoComun`, `getComparativaTemario`.
- `app/estudio/oposicion/[oposicionId]/page.tsx` — reescritura con las 7 subsecciones nuevas.
- `lib/nav-items.ts` — nueva entrada "FAQs".

**Sin cambios:** `content/temario.yaml`, `lib/contenido.ts`, `components/estudio/Markdown.tsx` (se reutiliza tal cual para renderizar `funciones`, `requisitos.otros` y `respuesta` de FAQ — ya soporta el markdown enriquecido `<u>`/`<mark class="ink-...">` si algún día hiciera falta).

## Flujo de datos / interacción

```
content/perfil-oposicion/<id>.yaml ──┐
content/perfil-oposicion/faq-comunes.yaml ──┤
                                             ├─→ lib/perfil-oposicion.ts (parse + caché)
content/temario.yaml (ya existente) ────────┤        │
                                             │        ▼
                                     lib/temario.ts (getResumenNucleoComun,
                                     getComparativaTemario — nuevas, sobre
                                     datos ya existentes)
                                             │
                    ┌────────────────────────┼─────────────────────────┐
                    ▼                        ▼                         ▼
   app/estudio/oposicion/[id]/page.tsx  app/estudio/faqs/page.tsx  app/estudio/comparativa-temario/page.tsx
   (introducción + FAQ específicas +    (FAQ comunes + todas       (tabla concepto × oposición)
    retribución + participación +       las específicas,
    temario ya existente)               agrupadas y filtrables)
```

Todo el flujo es lectura server-side en tiempo de build/request (mismo patrón que `lib/temario.ts`/`lib/contenido.ts` hoy) — no hay escritura desde la UI, ni estado de usuario involucrado en esta spec.

## Qué necesita `preparador-opos` para redactar el contenido real

No es tarea de esta fase (ni de `lead-developer` escribirla), pero se deja explícito para cuando el diseño esté aprobado, a partir de `investigacion-datos.md`:

- Rellenar los 4 ficheros `content/perfil-oposicion/<oposicionId>.yaml` con el esquema de arriba: cada dato confirmado con su `fuente`/`fechaConsulta` tal cual aparece en `investigacion-datos.md`; cada hueco documentado ahí (funciones, aspirantes, y los demás "no encontrado"/"no confirmado" señalados) como `estado: "pendiente_confirmar"`, con `nota` opcional tomando el motivo ya investigado (p. ej. "Bloqueo SSL en dpz.es") en vez de dejarlo en blanco sin explicación.
- Redactar `faq-comunes.yaml` con las preguntas realmente transversales a las 4 (turno libre, bolsa de trabajo, periodicidad de convocatorias...) y las `faqEspecificas` de cada oposición con lo propio de su proceso selectivo (estructura de ejercicios, si genera bolsa, etc.) — usando el detalle de "Proceso selectivo" ya reunido por oposición en `investigacion-datos.md`, citando la fuente (`fuente:`, tipo `Atribucion`) cuando la respuesta dependa de un dato oficial concreto (Requisito 2.2), y dejándolo sin `fuente` cuando sea una explicación general.
- El bloqueo técnico de acceso a `dpz.es` (fin de `investigacion-datos.md`) sigue pendiente de resolver antes de poder rellenar buena parte del perfil de DPZ — puede quedar el fichero de esa oposición con casi todo `pendiente_confirmar` hasta entonces, la app debe (y ya está diseñada para) funcionar igual de bien con eso.

## Riesgos y mitigaciones

- **`content/temario.yaml` usa hoy, en al menos un caso (Ayuntamiento de Zaragoza), un `fuente` de academia (`vence.es`) para el campo `Oposicion.fuente`** (sourcing de la numeración del temario, no del contenido). No es una regresión de esta spec — ya existía — pero esta spec sí introduce el estándar más estricto de "solo fuente oficial" para `introduccion`/`retribuciones`/`participacion`/FAQ. Mitigación: no se toca `content/temario.yaml` en esta spec (fuera de alcance, Requisito 3.3), pero queda anotado aquí como candidato a revisión futura — si se aborda, es una spec propia, no un efecto colateral de esta.
- **Redundancia leve entre `Oposicion.subgrupo` (`content/temario.yaml`, ya existente, usado hoy en la cabecera de la página) y `IntroduccionOposicion.grupoSubgrupo` (nuevo, atribuido).** Mitigación: se documentan como campos de propósito distinto (identificador corto ya usado en toda la app vs. denominación oficial completa y atribuida) en el propio tipo; el riesgo real es que diverjan si se corrige uno sin el otro — bajo, porque el valor concreto ("C2") es estable y ya coincide en las 4 oposiciones según `investigacion-datos.md`.
- **`getComparativaTemario()` puede crecer a 60-100 filas** (todo el catálogo de conceptos en alcance) — el riesgo de rendimiento es mínimo (cálculo en memoria sobre un YAML ya cacheado, sin red ni base de datos), pero si la lista de conceptos crece mucho más allá de las 4 oposiciones actuales, convendría revisar si la tabla necesita paginación o agrupación por bloque colapsable — no es un problema hoy, se anota como candidato futuro.
- **Ficheros `perfil-oposicion/<id>.yaml` inexistentes o parcialmente vacíos durante la redacción progresiva de `preparador-opos`.** Mitigación ya incorporada al diseño: `getPerfilOposicion` devuelve `null` sin lanzar excepción, y cada subsección de la introducción debe tratar la ausencia total del perfil igual que ya trata hoy un tema sin `.md` — la página sigue siendo útil (listado de temas) aunque el perfil todavía no exista.

## Futuros evolutivos (no se implementan ahora)

- Si `016-convocatorias` se aborda después de esta spec, `DatoOficial<T>`/`Atribucion` (`lib/dato-oficial.ts`) son el candidato natural a reutilizar para su mismo criterio "pendiente de confirmar" — evita que cada spec invente su propio tipo para la misma idea. No se fuerza su adopción aquí; es una nota para cuando llegue esa spec.
- Un sparkline/gráfico de tendencia para participación histórica (Requisito 5.3) cuando alguna oposición acumule 4+ convocatorias con datos — hoy, con 1-3 filas por oposición según `investigacion-datos.md`, una tabla compacta ya es suficiente y no lo justifica (ver decisión de `disenador-maquetador`).
- Filtro "solo núcleo común" en la comparativa de temario — mejora señalada por `disenador-maquetador` como no bloqueante para el Requisito 3.2; puede añadirse sin cambiar el modelo de datos.
