# Spec: Sección de Estudio

Estado: implementación completa (18/18 tareas), pendiente de revisión final de Diego antes de abrir el Pull Request hacia `development`
Última actualización: 2026-09-14

## Resumen

La sección donde el usuario accede a todo el material de estudio que necesita para preparar una oposición, sin salir de la app. El material vive organizado como un catálogo filtrable — por oposición o por tema — no como documentos separados, y el usuario puede marcar contenido para volver a él rápido.

## Historias de usuario

- Como usuario, quiero ver el material de estudio de un tema completo dentro de la app, para no depender de PDFs ni apuntes externos.
- Como usuario, quiero filtrar el material por una oposición concreta, para centrarme en lo que necesito para ese proceso específico.
- Como usuario, quiero navegar el material por tema/concepto en vez de por oposición, para estudiar de forma transversal lo que es común a varios procesos y no repetirlo.
- Como usuario, quiero ver claramente qué temas son núcleo común (los piden varias oposiciones a la vez) frente a los específicos de un solo proceso, para priorizar mi tiempo de estudio.
- Como usuario, quiero marcar (bookmark) un tema o un bloque de contenido para volver a él rápidamente más adelante.
- Como usuario, quiero tener una vista con todos mis marcadores guardados en un solo sitio.

## Alcance (v1)

- Grupo Administración, Auxiliar Administrativo, exclusivamente los procesos: Ayuntamiento de Zaragoza, Diputación de Zaragoza, Gobierno de Aragón (DGA) y AGE.
- Navegación por oposición y por tema/concepto (ambas vistas, intercambiables).
- Contenido de estudio real por concepto (no solo el título del tema), basado en fuentes primarias de dominio público o en resúmenes originales — ver principio 3 de `CONSTITUTION.md`.
- Sistema de bookmarks: marcar/desmarcar un tema, y una vista "Mis marcadores".

## Fuera de alcance

- El bloque específico sanitario de SALUD Aragón — se añade en una fase posterior, cuando se retome esa vía.
- El grupo de Informática (TAI, Ejecutivos de Informática DGA) — se añade en una fase posterior.
- Preguntas de test / autoevaluación — va en `specs/002-seccion-pruebas/`.
- Flashcards con repetición espaciada — es una posible ampliación del sistema de bookmarks/progreso, pero no entra en esta primera versión de la sección de Estudio (ver "Ideas futuras" más abajo).
- Multiusuario / login.
- Offline / PWA.

## Criterios de aceptación

- [ ] El usuario puede elegir entre navegar "por oposición" o "por tema" al entrar en la sección.
- [ ] Cada tema muestra: título, a qué oposición(es) pertenece (con su numeración oficial en cada una), si es núcleo común, y el contenido de estudio.
- [ ] El usuario puede marcar/desmarcar un tema como favorito desde la vista de estudio, sin salir de ella.
- [ ] Existe una vista "Mis marcadores" que lista todo lo guardado, con acceso directo a cada tema.
- [ ] El contenido mostrado para cada tema no reproduce material con copyright de editoriales de oposiciones (ver `CONSTITUTION.md`).

## Ideas futuras (fuera de esta spec, para no perderlas)

- Modo "repaso del núcleo común": vista que solo enseña los conceptos compartidos por varias oposiciones.
- Progreso visual por oposición: qué porcentaje del temario de cada proceso está "dominado".
- Notas personales por tema (campo de texto libre).
- Buscador de texto libre dentro del material de estudio.
- Exportar/imprimir un tema o un conjunto de marcadores a PDF.
- Pequeño glosario de términos legales/administrativos que se repiten entre temas.
- Historial de qué se ha estudiado y cuándo, no solo el estado actual.
- Etiqueta personal de dificultad por tema, para priorizar repaso.
- Vista de "última convocatoria conocida" junto al temario de cada oposición, cuando se complete la investigación de plazas/fechas (pendiente en `TEMARIOS.md`).

## Preguntas abiertas

Ninguna pendiente — resueltas el 2026-09-14: contenido manual tema a tema (ver `requirements.md` y `design.md`), bookmarks a nivel de tema completo.
