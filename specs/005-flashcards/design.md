# Design: Flashcards

## Visión general

Se apoya en `004-progreso-estudio` (relación usuario↔concepto) y en el catálogo de conceptos de `001-seccion-estudio`. Las flashcards son contenido editorial, igual que el texto de estudio: originales o basadas en fuentes primarias, no generadas por el usuario final ni por IA sin revisión en v1.

## Decisiones clave

### Decisión: Autoría de flashcards en v1

- **Opción elegida:** flashcards como contenido editorial — Diego y Claude las escriben por concepto, igual que el contenido de `001-seccion-estudio`, sin pipeline de generación asistida en esta fase.
- **Alternativas consideradas:** editor de flashcards dentro de la app para que el usuario final cree las suyas. Descartado para v1 — añade UI y validación no esenciales; se puede incorporar más adelante si aporta valor real.
- **Satisface:** Requisito 1.

### Decisión: Valoración binaria, no escala de dificultad

- **Opción elegida:** "lo sabía" / "no lo sabía" como única valoración en v1.
- **Alternativas consideradas:** escala 1-5 al estilo Anki/SM-2. Descartado hasta que exista repetición espaciada real (`006-repaso-inteligente`), que es cuando ese matiz empieza a aportar valor; introducirlo antes añadiría complejidad sin uso.
- **Satisface:** Requisito 2.

## Componentes afectados

- Tabla `flashcards` (`concepto_id`, `pregunta`, `respuesta`, `tipo`).
- Tabla `flashcard_valoraciones` (`usuario_id`, `flashcard_id`, `valoracion`, `fecha`).
- Vista de sesión de repaso (recorrido secuencial + resumen final).
- Contenido editorial nuevo, en paralelo a `content/estudio/` (p. ej. `content/flashcards/`).

## Flujo de datos / interacción

```text
Usuario entra en "Practicar con flashcards" de un concepto/tema/oposición
        ↓
Sistema construye la cola de tarjetas de esa selección
        ↓
Por cada tarjeta: mostrar pregunta → usuario revela → usuario valora
        ↓
Guardar valoración (flashcard_valoraciones)
        ↓
Al terminar la cola: resumen (sabía / no sabía)
```

## Riesgos y mitigaciones

- Si el volumen de flashcards por concepto crece sin criterio, las sesiones de repaso se vuelven largas y poco útiles. Mitigación: empezar con pocas tarjetas de alto valor por concepto (2-4), no cobertura exhaustiva, igual que el criterio editorial de `001-seccion-estudio`.
