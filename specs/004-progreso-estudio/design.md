# Design: Progreso de Estudio

## Visión general

Se apoya directamente en el patrón ya construido en `001-seccion-estudio` para bookmarks (relación usuario↔concepto vía Server Action + tabla Drizzle/Postgres). Progreso añade una segunda relación usuario↔concepto, esta vez con estado, en vez de un simple booleano de marcado.

## Decisiones clave

### Decisión: Modelo de estados simple, no acumulativo

- **Opción elegida:** un campo `estado` (implícito "no_estudiado" por ausencia de fila | `visto` | `estudiado` | `necesita_repaso`) por fila usuario+concepto, con un timestamp de visto y otro de última actualización manual.
- **Alternativas consideradas:** histórico completo de eventos (log de cada apertura). Descartado para v1 por complejidad innecesaria — no aporta valor hasta que exista repaso inteligente (`006`), que sí lo necesitará; en ese momento se puede añadir sin romper este modelo.
- **Satisface:** Requisito 1, 2.

### Decisión: "Visto" se registra al abrir, no tras permanencia mínima

- **Opción elegida:** registrar visto inmediatamente al renderizar la vista de concepto (server-side), igual que el patrón de bookmarks de `001`.
- **Alternativas consideradas:** temporizador de permanencia mínima en cliente (p. ej. 10s) para evitar "vistos" accidentales. Descartado: añade complejidad de cliente y el dato de "visto" no es crítico — el usuario marca "estudiado" manualmente cuando de verdad quiere que cuente.
- **Satisface:** Requisito 1.

## Componentes afectados

- Nueva tabla `progreso_concepto` (`usuario_id`, `concepto_id`, `estado`, `visto_en`, `actualizado_en`) — esquema Drizzle, mismo patrón que la tabla de bookmarks.
- Server Action `actualizarProgreso` (análoga a `toggleBookmark` de `001`).
- Actualización de las vistas de listado por oposición y por tema para mostrar el badge de estado.
- Nuevo componente "Continuar estudiando" en la entrada de la sección Estudio (y más adelante en el dashboard de `008`).

## Flujo de datos / interacción

```text
Usuario abre concepto
        ↓
¿Contenido pendiente? → si sí, no se registra nada
        ↓ no
Server Action registra/actualiza "visto"
        ↓
Usuario marca manualmente "estudiado" o "necesita repaso" (opcional)
        ↓
Server Action sobrescribe estado
        ↓
Listados y "Continuar estudiando" leen progreso_concepto
```

## Riesgos y mitigaciones

- Sin un modelo de "dominio" real, el estado manual puede quedar desactualizado (el usuario lo marca "estudiado" y nunca lo revisa). Mitigación: `006-repaso-inteligente` resolverá esto combinando este dato con resultados de flashcards/tests; por ahora el estado es solo informativo, no se usa todavía para decisiones automáticas.
