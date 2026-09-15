# Requirements: Anotaciones personales de lectura

Fase: 1 — Requirements (aprobado, implementado en Fase 4/5). Ver "Extensión" al final: ajuste tras revisión de Diego probando la app ya en marcha.
Última actualización: 2026-09-15

## Resumen

Diego quiere poder marcar visualmente (negrita, subrayado, resaltado) partes del contenido de estudio mientras lo lee, como una anotación personal — no como una edición del contenido real. Esto es distinto del texto enriquecido de autoría que ya existe (`<u>`/`<mark class="ink-*">` escrito a mano en `content/estudio/*.md` por los agentes que redactan contenido, `specs/003-sistema-de-diseno` §14): aquello es contenido compartido y versionado en git; esto es una marca privada de lectura, del mismo tipo que el progreso de lectura (`lib/progreso-lectura.ts`) — vive en el dispositivo, no en el contenido ni en base de datos.

## Requisito 1: Modo edición de anotaciones

**Historia:** Como usuario, quiero activar un "modo edición" en la página de un concepto, para poder aplicar formato personal (negrita, subrayado, resaltado) al texto mientras lo leo.

**Criterios de aceptación:**
1. CUANDO el usuario abre la página de un concepto con contenido ENTONCES el sistema DEBERÁ mostrar un botón para activar/desactivar el modo edición.
2. CUANDO el modo edición está activo ENTONCES el sistema DEBERÁ permitir seleccionar texto dentro de cualquiera de las secciones de contenido (texto oficial, material adaptado, esquema, resumen extenso) y aplicarle negrita, subrayado o resaltado mediante una barra de herramientas.
3. CUANDO el modo edición está desactivado ENTONCES el sistema DEBERÁ mostrar el contenido en modo solo lectura, igual que hoy (sin cursor de edición ni posibilidad de seleccionar-y-formatear).

## Requisito 2: Persistencia local, no compartida

**Historia:** Como usuario, quiero que mis anotaciones se conserven al volver a un tema, para no rehacerlas cada vez, pero sin que afecten al contenido real de la app.

**Criterios de aceptación:**
1. CUANDO el usuario aplica una anotación ENTONCES el sistema DEBERÁ guardarla en el navegador (`localStorage`), nunca en `content/estudio/*.md` ni en base de datos.
2. CUANDO el usuario vuelve a abrir el mismo concepto en el mismo navegador ENTONCES el sistema DEBERÁ restaurar sus anotaciones previas sobre el contenido actual.
3. CUANDO el contenido real de una sección (`content/estudio/<concepto-id>.md`) ha cambiado respecto a la versión que tenía cuando se guardó la anotación ENTONCES el sistema DEBERÁ descartar la anotación desactualizada de esa sección y mostrar el contenido nuevo sin formato personal, en vez de mezclarlos de forma inconsistente o tapar en silencio una corrección de contenido.
4. CUANDO el usuario abre el mismo concepto desde otro dispositivo o navegador ENTONCES el sistema NO DEBERÁ mostrar las anotaciones hechas en otro sitio (son locales al dispositivo, mismo criterio que `progreso-lectura`).

## Requisito 3: Alternar entre vista con anotaciones y vista limpia

**Historia:** Como usuario, quiero poder ver el contenido con mis anotaciones o sin ellas, para poder repasar la versión oficial limpia cuando lo necesite (por ejemplo, antes de un examen) sin perder las anotaciones que ya tengo guardadas.

**Criterios de aceptación:**
1. CUANDO el usuario está en la página de un concepto ENTONCES el sistema DEBERÁ ofrecer un control (checkbox/switch) para elegir entre "con mis anotaciones" y "sin anotaciones".
2. CUANDO el control está en "con mis anotaciones" ENTONCES el sistema DEBERÁ mostrar el contenido con el formato personal aplicado, si existe alguno guardado para ese concepto.
3. CUANDO el control está en "sin anotaciones" ENTONCES el sistema DEBERÁ mostrar el contenido tal cual viene de `content/estudio/*.md`, sin aplicar ningún formato personal guardado.
4. CUANDO el usuario cambia entre una vista y otra ENTONCES el sistema NO DEBERÁ borrar ni modificar las anotaciones guardadas — es un control de visualización, no de borrado.
5. CUANDO el usuario activa el modo edición (Requisito 1) ENTONCES el sistema DEBERÁ forzar la vista a "con mis anotaciones" (no tiene sentido editar sin verlas).

## Fuera de alcance

- Sincronizar anotaciones entre dispositivos o guardarlas en base de datos.
- Exportar o compartir anotaciones.
- Anotar mientras está activo el modo concentración (se deja para una iteración futura si hace falta).
- Deshacer/rehacer con historial de cambios — basta con "quitar formato" sobre la selección.
- Cualquier cambio al texto enriquecido de autoría ya existente (`u`/`mark.ink-*` en `content/estudio/*.md`) — es un sistema aparte y no se toca.
- Persistir la elección de "con/sin anotaciones" entre sesiones — se reinicia a "con mis anotaciones" en cada carga de página (mismo criterio que modo concentración, `ARCHITECTURE.md`).

## Extensión (2026-09-15): ajuste tras revisión de Diego con la app ya en marcha

Probando la implementación real, Diego pidió dos cambios que amplían/corrigen Requisitos 1 y 3 (no reabren Requisito 2 ni el resto de `Fuera de alcance`):

1. **Requisito 1.2 se restringe:** "seleccionar texto... y aplicarle negrita, subrayado o resaltado" nunca pretendía permitir escribir/borrar texto libre, pero la implementación original (`contentEditable`) sí lo permitía de hecho — y el navegador reestructuraba listas/citas del contenido al teclear dentro (bug visual real, visto en la propia app). Criterio de aceptación añadido: **el sistema NO DEBERÁ permitir editar el texto en sí (escribir, borrar, Intro) en ninguna sección anotable, solo aplicar/quitar formato sobre una selección existente mediante la barra de herramientas.**
2. **Requisito 3 se resuelve de otra forma para el texto oficial:** en vez de un checkbox que alterna "con/sin anotaciones" en el mismo sitio, el texto oficial anotado vive en su **propia pestaña, "Material oficial anotado"**, entre "Texto oficial" y "Material adaptado" — la pestaña "Texto oficial" pasa a mostrar siempre el original, sin ninguna anotación ni posibilidad de aplicarla ahí. El checkbox de Requisito 3 se mantiene, pero pasa a gobernar solo material adaptado y resumen (esquema + resumen extenso), que sí siguen alternando in-place.

Detalle técnico completo (por qué `contentEditable` no era necesario para que la Range API funcionase, y cómo se reparte "texto-oficial" entre dos pestañas) en `design.md`.
