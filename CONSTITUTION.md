# Constitución del proyecto

Principios que no cambian de una sesión a otra. Cualquier spec o decisión técnica que los contradiga necesita revisar esto primero, no al revés.

Última actualización: 2026-09-14

## Cómo trabajamos: Spec-Driven Development

Se sigue la skill `anthropic-skills:spec-driven-development`. Cada funcionalidad vive en `specs/NNN-nombre-de-la-feature/` (número secuencial de 3 dígitos, nunca reutilizado ni adivinado) y pasa por 5 fases, cada una con aprobación explícita de Diego antes de avanzar a la siguiente:

0. **Encuadre** — qué feature es, qué carpeta le corresponde, qué problema resuelve en una frase.
1. **`requirements.md`** — QUÉ y POR QUÉ, sin decisiones técnicas. Historias de usuario con criterios de aceptación en formato EARS ("CUANDO... ENTONCES el sistema DEBERÁ..."), y una sección de "Fuera de alcance".
2. **`design.md`** — CÓMO. Decisiones técnicas concretas, cada una trazable a los requisitos que satisface, con alternativas consideradas.
3. **`tasks.md`** — lista ordenada de tareas atómicas y verificables, cada una señalando a qué requisito sirve.
4. **Implementación** — tareas una a una, marcándolas hechas al momento; si algo no encaja con el design, se para y se actualiza el documento antes de seguir.
5. **Verificación final** — repaso criterio a criterio de `requirements.md` con evidencia concreta de que se cumple.

Nunca se salta una fase para ir más rápido. `specs/_TEMPLATE/` tiene las plantillas de `requirements.md`, `design.md` y `tasks.md` para nuevas features.

## Flujo de ramas y commits (override del convenio global para este repo)

- Existe una rama `development` de forma continua — no se borra nunca. Es la rama de integración; `main` se actualiza desde ahí cuando corresponda.
- Cada spec nueva se implementa en su propia rama, creada desde `development` (no desde `main`) al empezar la Fase 4 (implementación) — nunca antes de tener `tasks.md` aprobado. Nombre de rama = carpeta de la spec (`NNN-nombre-de-la-feature`).
- Al cerrar la spec (Fase 5 completa), esa rama se fusiona en `development` y se borra.
- Durante la implementación, cada Requisito de `requirements.md` que se completa (todas sus tareas de `tasks.md` hechas) es su propio commit — no un commit gigante al final ni uno por tarea suelta. Las tareas de base técnica que no pertenecen a un requisito concreto también van en su propio commit al completarse.
- Esto sustituye, solo en este repo, a la sección "Una rama por feature" del `CLAUDE.md` global (que fusiona contra la rama por defecto): aquí la rama por defecto de trabajo es `development`, no `main`.

## Agentes especializados

`.claude/agents/` tiene agentes de Claude Code específicos de este proyecto — úsalos en vez de intentar cubrir su rol desde el agente general:

- **`preparador-opos`** — decide prioridades de preparación y evalúa oposiciones nuevas según el objetivo real de Diego (plaza en Aragón o destino bien conectado por AVE), y redacta el contenido de estudio.
- **`scrapeador-fuentes-primarias`** — localiza y transcribe texto oficial (BOE/BOA, leyes, EBEP) para que `preparador-opos` lo use como base. Nunca toca material de academias — ver principio 3 más abajo.
- **`disenador-maquetador`** — decisiones de UI/UX y maquetación, tablet-first.
- **`investigador-convocatorias`** — datos factuales de convocatorias (fechas, plazas, plazos) y radar de procesos nuevos.

## Principios del producto

1. **Aprendizaje antes que evaluación.** La sección de Estudio es prioritaria y se construye primero; la sección de Pruebas se aborda después, sobre una base de estudio ya sólida.
2. **Contenido real dentro de la app, no un índice que reenvía fuera.** El usuario tiene que poder estudiar sin salir a un PDF externo.
3. **Fuentes primarias, no material con copyright de academias.** El contenido que sirve la app se basa en textos oficiales de dominio público (Constitución, Estatuto de Autonomía de Aragón, leyes de procedimiento administrativo, Estatuto Básico del Empleado Público, BOE/BOA, etc.) o en resúmenes originales redactados para la app. No se reproduce contenido de editoriales de oposiciones (Adams, MAD, CEP y similares) — es material con derechos de autor, no de dominio público.
4. **El temario es un catálogo filtrable, no documentos separados por oposición ni por tema.** Cualquier unidad de contenido se puede consultar filtrando por oposición o navegando por concepto, sin duplicar el contenido que comparten varias oposiciones.
5. **Prioridad de alcance: Administración primero.** Concretamente Auxiliar Administrativo en Ayuntamiento de Zaragoza, Diputación de Zaragoza, Gobierno de Aragón (DGA) y AGE. El bloque específico sanitario de SALUD Aragón y el grupo de Informática (TAI, Ejecutivos de Informática DGA) quedan fuera del alcance hasta que se decida ampliar.
6. **Single-user ahora, arquitectura lista para multiusuario.** No se implementa login en esta fase, pero el modelo de datos no asume "un único usuario para siempre".
7. **Sin conexión offline / PWA.** Se asume conexión a internet normal.
8. **Sin presión de plazos.** Es un proyecto personal a largo plazo — se prioriza que el contenido y el diseño sean correctos y útiles de verdad, no la velocidad de entrega.

## Estado

Este documento sustituye como fuente de verdad de producto a las decisiones dispersas en `CONTEXT.md` (que se mantiene como registro histórico cronológico, no como spec vigente). El esqueleto estático de prueba de concepto (`index.html`, `temario.html`, `faq.html`, `study.html`) ya se ha retirado del repo; el primer volcado de `content/temario.yaml` se mantiene y sigue siendo la base de datos del temario.
