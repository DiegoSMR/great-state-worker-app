# Requirements: Perfil de oposición

Fase: 1 — Requirements. Estado: borrador, pendiente de aprobación de Diego.
Última actualización: 2026-09-15

## Resumen

Antes de entrar en el temario, el usuario quiere una vista de conjunto de cada oposición: qué es, quién puede presentarse, cómo es el proceso, qué cubre el temario comparado con las otras oposiciones en alcance, cuánto paga el puesto y cuánta competencia hay. Hoy la página de oposición (`app/estudio/oposicion/[oposicionId]/page.tsx`) es solo un listado de temas — este requisito añade una introducción por oposición con FAQ, comparativa de temario, datos retributivos y de participación. Las FAQ, además de aparecer dentro de la introducción de cada oposición, tienen también su propia sección navegable (Requisito 2.3) que las agrupa todas.

Se apoya en el agente `investigador-convocatorias` para los datos factuales y reutiliza los datos ya modelados por `016-convocatorias` (plazas, fechas, estado de la convocatoria activa) en vez de duplicarlos — este requisito cubre lo que es estable entre convocatorias (retribución del puesto, estructura del temario, preguntas frecuentes), no lo que cambia con cada convocatoria concreta.

## Requisito 1: Introducción general de la oposición

**Historia:** Como usuario, quiero una introducción clara de cada oposición en alcance, para entender qué es y decidir cuánto priorizarla sin tener que buscarlo fuera de la app.

**Criterios de aceptación:**
1. CUANDO el usuario abre la página de una oposición ENTONCES el sistema DEBERÁ mostrar, antes del listado de temas, una introducción con: organismo convocante, cuerpo/escala y grupo/subgrupo, funciones típicas del puesto, y requisitos de acceso (titulación, edad, nacionalidad, otros).
2. CUANDO un dato de la introducción proviene de una fuente oficial (BOE/BOA, bases de la convocatoria, EBEP) ENTONCES el sistema DEBERÁ referenciar esa fuente, con el mismo criterio de trazabilidad ya usado en `content/estudio/*.md` (frontmatter `fuentes:`) y en `016-convocatorias`.
3. CUANDO un dato de la introducción todavía no está verificado con una fuente oficial ENTONCES el sistema DEBERÁ mostrarlo como "pendiente de confirmar" en vez de inventar o aproximar un valor (mismo criterio que Requisito 1.3 de `016-convocatorias`).

## Requisito 2: Preguntas frecuentes (FAQ)

**Historia:** Como usuario, quiero respuestas a las dudas más habituales sobre una oposición, para no tener que rastrearlas por foros o academias.

**Criterios de aceptación:**
1. CUANDO el usuario consulta la introducción de una oposición ENTONCES el sistema DEBERÁ mostrar una lista de preguntas frecuentes específicas de esa oposición (p. ej. cómo es el proceso selectivo, cuántos ejercicios tiene y de qué tipo, si hay fase de concurso además de oposición, si hay bolsa de trabajo derivada, cada cuánto suele convocarse).
2. CUANDO una respuesta de la FAQ depende de un dato oficial (número de ejercicios, tipo de prueba, sistema de puntuación) ENTONCES el sistema DEBERÁ basarla en las bases de la convocatoria o normativa citada, nunca en descripciones de academias (principio 3 de `CONSTITUTION.md`).
3. CUANDO el usuario quiere consultar las FAQ sin entrar primero en una oposición concreta ENTONCES el sistema DEBERÁ ofrecer una sección de FAQs propia y navegable (nueva entrada en `lib/nav-items.ts`, no solo un bloque enterrado dentro de la página de cada oposición), que agrupe las preguntas de las 4 oposiciones en alcance y permita filtrar/saltar por oposición.
4. CUANDO una pregunta de la FAQ es común a varias oposiciones (p. ej. "¿qué es el turno libre?", "¿qué es una bolsa de trabajo?") ENTONCES el sistema DEBERÁ mostrarla una sola vez en la sección general de FAQs en vez de duplicarla por oposición (mismo principio de "una fuente de verdad" que el núcleo común de temario, `001-seccion-estudio`).

## Requisito 3: Comparativa de temario entre oposiciones en alcance

**Historia:** Como usuario que prepara varias oposiciones a la vez, quiero ver qué parte del temario comparten entre sí, para priorizar lo que rentabiliza el tiempo de estudio en varias oposiciones a la vez.

**Criterios de aceptación:**
1. CUANDO el usuario consulta la introducción de una oposición ENTONCES el sistema DEBERÁ mostrar cuántos temas de su temario oficial son núcleo común (ver `esNucleoComun()`, `001-seccion-estudio`) y con qué otras oposiciones de `OPOSICIONES_EN_ALCANCE_V1` los comparte.
2. CUANDO el usuario quiere comparar el temario completo de dos o más oposiciones ENTONCES el sistema DEBERÁ ofrecer una vista comparativa (p. ej. tabla) que muestre, por bloque temático, qué oposiciones incluyen ese bloque y con qué numeración propia.
3. Esta comparativa se calcula a partir de `content/temario.yaml`, ya existente — no introduce una fuente de datos nueva ni duplica el temario por oposición (principio 4 de `CONSTITUTION.md`).

## Requisito 4: Datos retributivos

**Historia:** Como usuario, quiero saber cuánto se cobra en cada puesto, para valorar el atractivo real de cada oposición además del número de plazas.

**Criterios de aceptación:**
1. CUANDO el usuario consulta la introducción de una oposición ENTONCES el sistema DEBERÁ mostrar una tabla retributiva oficial del puesto (retribuciones base según grupo/subgrupo — sueldo, trienios, pagas extra — más complementos específicos del organismo cuando estén publicados).
2. CUANDO el complemento específico de un organismo concreto (Ayuntamiento de Zaragoza, Diputación de Zaragoza, DGA, AGE) no esté publicado en una fuente oficial verificable ENTONCES el sistema DEBERÁ mostrar únicamente la retribución base común (tablas salariales del grupo/subgrupo en la función pública, EBEP/Ley de Presupuestos) marcando el complemento específico como "pendiente de confirmar", en vez de estimarlo.
3. CUANDO se muestre cualquier cifra retributiva ENTONCES el sistema DEBERÁ indicar el ejercicio/año al que corresponde y su fuente — las tablas salariales cambian cada año con la Ley de Presupuestos, y una cifra sin fecha puede quedar desfasada sin que se note.

## Requisito 5: Datos de participación (plazas y aspirantes)

**Historia:** Como usuario, quiero saber cuánta competencia hay realmente en cada proceso, para calibrar el esfuerzo de preparación necesario.

**Criterios de aceptación:**
1. CUANDO el usuario consulta la introducción de una oposición ENTONCES el sistema DEBERÁ mostrar, si están publicados oficialmente, el número de plazas y el número de aspirantes presentados de la convocatoria (o convocatorias) más reciente(s), y la ratio aspirantes/plaza resultante.
2. CUANDO no exista un dato oficial publicado de aspirantes presentados para una convocatoria concreta ENTONCES el sistema DEBERÁ omitir la ratio para esa convocatoria en vez de estimarla, dejando constancia explícita de que el dato no está disponible.
3. CUANDO existan datos de varias convocatorias pasadas de la misma oposición ENTONCES el sistema DEBERÁ poder mostrar más de un dato histórico (no solo el último), para que el usuario perciba tendencia en vez de un único número aislado.

## Fuera de alcance

- Sustituir o duplicar la ficha de convocatoria activa de `016-convocatorias` (fechas, plazo de inscripción, estado) — este requisito solo cubre información estable entre convocatorias.
- Proyecciones o estimaciones propias de plazas/aspirantes futuros — solo datos ya publicados.
- Comparativa retributiva frente a la empresa privada u otros sectores — el alcance es entre las oposiciones ya cubiertas por la app.
- Traducir la comparativa de temario en una recomendación automática de qué estudiar primero — eso pertenece a una spec de recomendaciones (`015-recomendaciones`) o priorización, no a esta.
