# Requirements: Sección de Estudio

Fase: 1 — Requirements. Estado: aprobado.
Última actualización: 2026-09-14

## Resumen

La sección donde Diego accede a todo el material de estudio necesario para preparar las oposiciones de Administración priorizadas (Auxiliar Administrativo: Ayuntamiento de Zaragoza, Diputación de Zaragoza, Gobierno de Aragón, AGE), organizado como catálogo filtrable por oposición o por tema, con un sistema de marcadores para volver rápido a lo importante.

## Requisito 1: Navegación por oposición o por tema

**Historia:** Como usuario, quiero elegir si navego el material por una oposición concreta o por tema/concepto transversal, para poder centrarme en un proceso o estudiar lo que es común a varios a la vez.

**Criterios de aceptación:**
1. CUANDO el usuario entra en la sección de Estudio ENTONCES el sistema DEBERÁ ofrecer dos modos de navegación: "por oposición" y "por tema".
2. CUANDO el usuario selecciona una oposición concreta ENTONCES el sistema DEBERÁ mostrar únicamente los temas de esa oposición, en su orden oficial numerado.
3. CUANDO el usuario navega "por tema" ENTONCES el sistema DEBERÁ mostrar el catálogo de conceptos sin repetir el contenido que comparten varias oposiciones.

## Requisito 2: Contenido de estudio real por tema

**Historia:** Como usuario, quiero ver el contenido de estudio completo de un tema dentro de la app, para no depender de PDFs ni apuntes externos.

**Criterios de aceptación:**
1. CUANDO el usuario abre un tema ENTONCES el sistema DEBERÁ mostrar: título, a qué oposición(es) pertenece con su numeración oficial en cada una, si es núcleo común, y el contenido de estudio del concepto, diferenciando visiblemente sus tres partes: el texto oficial transcrito, el material adaptado (desarrollo del tema) y el resumen (esquema de una página + resumen extenso).
2. CUANDO el contenido de un tema proviene de una fuente con copyright (material de academias de oposiciones) ENTONCES el sistema NUNCA DEBERÁ reproducirlo textualmente — solo se sirve texto de fuentes oficiales de dominio público o resúmenes originales redactados para la app.
3. CUANDO el usuario abre un tema cuyo contenido todavía no se ha redactado ENTONCES el sistema DEBERÁ mostrarlo con un estado claramente identificable de "contenido pendiente" — nunca como una página en blanco, rota, o indistinguible de un tema con contenido real.

## Requisito 3: Identificación del núcleo común

**Historia:** Como usuario, quiero ver claramente qué temas son núcleo común entre varias oposiciones, para priorizar mi tiempo de estudio hacia lo que desbloquea más procesos a la vez.

**Criterios de aceptación:**
1. CUANDO un tema/concepto es pedido por 2 o más de las oposiciones en alcance ENTONCES el sistema DEBERÁ marcarlo visualmente como "núcleo común" y listar qué oposiciones lo comparten.

## Requisito 4: Sistema de bookmarks

**Historia:** Como usuario, quiero marcar temas para volver a ellos rápido, y ver todos mis marcadores reunidos en un solo sitio.

**Criterios de aceptación:**
1. CUANDO el usuario está viendo un tema ENTONCES el sistema DEBERÁ permitir marcarlo o desmarcarlo como favorito sin salir de esa vista.
2. CUANDO el usuario accede a "Mis marcadores" ENTONCES el sistema DEBERÁ listar todos los temas marcados con acceso directo a cada uno.
3. CUANDO el usuario desmarca un tema desde "Mis marcadores" ENTONCES el sistema DEBERÁ quitarlo de la lista inmediatamente.

## Fuera de alcance

- El bloque específico sanitario de SALUD Aragón — se añade en una fase posterior.
- El grupo de Informática (TAI, Ejecutivos de Informática DGA) — se añade en una fase posterior.
- Preguntas de test / autoevaluación — feature separada, ver `specs/002-seccion-pruebas/` (diferida).
- Flashcards con repetición espaciada.
- Multiusuario / login.
- Offline / PWA.

## Ideas futuras (no son requisitos de esta feature, solo para no perderlas)

- Modo "repaso del núcleo común": vista que solo enseña los conceptos compartidos por varias oposiciones.
- Progreso visual por oposición: qué porcentaje del temario de cada proceso está "dominado".
- Notas personales por tema (campo de texto libre).
- Buscador de texto libre dentro del material de estudio.
- Exportar/imprimir un tema o un conjunto de marcadores a PDF.
- Pequeño glosario de términos legales/administrativos que se repiten entre temas.
- Historial de qué se ha estudiado y cuándo, no solo el estado actual.
- Etiqueta personal de dificultad por tema, para priorizar repaso.

## Decisiones (antes "Preguntas abiertas", resueltas 2026-09-14)

- **Origen del contenido real por concepto:** manual, tema a tema — Diego y Claude escriben/adaptan el contenido concepto a concepto a partir de fuentes primarias, sin pipeline de generación asistida en esta fase. Ver `design.md` para el formato de almacenamiento elegido.
- **Granularidad del bookmark:** solo tema completo (no sub-secciones) en v1. Modelo de datos simple: una relación usuario-tema.
