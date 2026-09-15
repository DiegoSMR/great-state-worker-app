# Requirements: Anotaciones personales de lectura

Fase: 1 — Requirements. Estado: borrador, pendiente de aprobación de Diego.
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

## Fuera de alcance

- Sincronizar anotaciones entre dispositivos o guardarlas en base de datos.
- Exportar o compartir anotaciones.
- Anotar mientras está activo el modo concentración (se deja para una iteración futura si hace falta).
- Deshacer/rehacer con historial de cambios — basta con "quitar formato" sobre la selección.
- Cualquier cambio al texto enriquecido de autoría ya existente (`u`/`mark.ink-*` en `content/estudio/*.md`) — es un sistema aparte y no se toca.
