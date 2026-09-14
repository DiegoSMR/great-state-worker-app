# Spec: Sistema de diseño (legibilidad, navegación y temas)

Estado: aprobado (revisión 2 — incorpora `MEJORAS.md` y alineación con `PRODUCT-VISION.md`; ver detalle en `requirements.md`)
Última actualización: 2026-09-14

## Resumen

Esta es una feature **transversal**: no añade una sección nueva de contenido, sino que rediseña la base visual y de navegación de toda la app (empezando por `/estudio`, la única sección real hoy). Resuelve tres problemas verificados en el código actual: (1) la app es dolorosa a la vista porque el tema oscuro solo cambia el fondo del `body` vía `prefers-color-scheme` mientras el resto de textos y bordes quedan con colores fijos pensados para fondo claro, produciendo contraste roto; (2) no existe ningún patrón de navegación persistente (ni menú, ni barra, solo enlaces "← volver" sueltos), lo que dificulta moverse por la app en cualquier tamaño de pantalla, especialmente en tablet, el dispositivo principal de uso; (3) no hay un selector de tema explícito, solo lo que decida el sistema operativo, lo cual bloquea añadir más temas en el futuro.

## Historias de usuario

- Como usuario, quiero que el texto tenga siempre contraste suficiente frente al fondo, en cualquier tema, para poder leer contenido legal/normativo denso durante sesiones largas sin fatiga visual.
- Como usuario, quiero un menú de navegación persistente construido primero para funcionar bien en pantallas pequeñas y pulido con prioridad en tablet (mi dispositivo principal) y escritorio, para moverme por la app sin depender de enlaces "volver" sueltos.
- Como usuario, quiero elegir manualmente entre menú de navegación en modo hamburguesa, iconos o visible (expandido con texto), en cualquier tamaño de pantalla, para adaptar cuánto espacio ocupa la navegación a mi preferencia en cada momento.
- Como usuario, quiero poder ajustar el tamaño de letra del contenido de estudio, con margen para más ajustes de lectura en el futuro, para reducir la fatiga visual en sesiones largas.
- Como usuario, quiero elegir explícitamente entre tema claro y oscuro (no depender de la preferencia del sistema operativo), y que la app recuerde mi elección, para poder decidir cómo se ve la app independientemente de la configuración de mi dispositivo.
- Como usuario, quiero que el selector de temas esté preparado para añadir más opciones en el futuro, para no tener que rehacer el selector cuando llegue un tercer tema.
- Como usuario, quiero distinguir a simple vista si estoy leyendo el texto oficial transcrito, el material adaptado o el resumen de un concepto, y poder moverme entre las tres partes sin perderme, para orientarme dentro de un tema largo.
- Como usuario, quiero que el estado "contenido todavía sin escribir" sea inconfundible con un error o una página rota, para saber que es un hueco conocido y no un fallo de la app.
- Como usuario, quiero que, cuando la normativa de un concepto esté pendiente de revisión de vigencia, la vista me lo indique de forma visible pero tranquila, sin que parezca un error ni me impida seguir leyendo el contenido.
- Como usuario, quiero que los estados especiales (núcleo común, bookmark) se vean igual de claros y con buen contraste en ambos temas.
- Como usuario, quiero ver la estructura completa de un concepto (índice, esquema, resumen extenso) y volver rápidamente al principio, para orientarme tanto en primera lectura como en repaso.
- Como usuario, quiero una forma de reducir distracciones durante una sesión larga (modo concentración), sin perder de vista en qué concepto estoy.
- Como usuario, quiero continuar exactamente donde dejé la lectura de un concepto al volver a abrirlo.
- Como usuario, quiero poder ver de dónde viene el contenido normativo (norma, artículo, enlace oficial) cuando sea relevante, sin que cada página se convierta en una ficha burocrática.
- Como usuario, quiero que los controles sean usables con teclado y no dependan solo del color para comunicar estados, aunque la app no tenga hoy usuarios con necesidades de accesibilidad específicas.

## Alcance (v1)

- Tokens de color (fondo, texto primario/secundario, bordes) para tema claro y tema oscuro, con contraste verificado.
- Escala tipográfica y ancho de columna de lectura para contenido largo, aplicada a las tres secciones de un concepto.
- Componente de navegación persistente construido con metodología mobile-first (base definida primero para móvil), con tablet y escritorio recibiendo el mayor pulido visual por ser el uso real prioritario — no una copia reescalada de un único patrón.
- Menú de navegación con tres niveles de densidad seleccionables por el usuario (`collapsed`/`compact`/`expanded`; la materialización visual concreta —hamburguesa/rail/sidebar— se cierra en `design.md`), con un default razonable por tamaño de pantalla y posibilidad de cambiarlo manualmente en cualquiera, maquetado ya para 4-5 entradas futuras.
- Selector de tema explícito (claro / oscuro en v1), persistente entre sesiones, con un modelo de estado ya preparado para más de dos temas.
- Perfil de lectura (`readingSettings`) con tamaño de letra ajustable en v1, modelado como objeto extensible para futuros controles de lectura (interlineado, ancho de columna, etc.).
- Diferenciación visual y navegación (pestañas o anclas) entre texto oficial / material adaptado / resumen / esquema / resumen extenso dentro de la vista de un concepto, con índice de estructura y vuelta rápida al principio.
- Rediseño del estado "contenido pendiente de redactar" ya existente, conservando el lenguaje de borde discontinuo, con indicador de completitud para conceptos parciales.
- Diseño del estado nuevo "normativa en revisión", con un color propio distinto del ámbar de núcleo común y del gris de "sin escribir".
- Rediseño de los badges de núcleo común y bookmark con contraste correcto en ambos temas, conservando el significado estrecho del bookmark.
- Modo concentración construido completo (no solo diseñado), progreso de lectura (posición restaurada + indicador visual, por concepto) y trazabilidad de fuentes normativas — los tres aprobados como alcance firme de `003` (ver `requirements.md`, "Decisiones aprobadas por Diego, 2026-09-14").
- Checklist de accesibilidad mínima (foco visible, tamaño táctil, no depender solo del color, HTML semántico, `prefers-reduced-motion`, navegación por teclado en menús).
- Todo el diseño se documenta en esta carpeta (`spec.md`, `requirements.md`, `notas-de-diseno.md`); ningún fichero de `app/`, `components/` ni código fuente se modifica como parte de esta spec — eso corresponde a la Fase 2 (`design.md` técnico) y a la implementación posterior de `lead-developer`.

## Fuera de alcance

- Implementación en código de cualquiera de estas decisiones — esta spec produce diseño y requisitos, no cambios en `app/` ni `components/`.
- Temas adicionales más allá de claro/oscuro (alto contraste, sepia, etc.) — la v1 solo entrega dos temas, aunque el modelo debe quedar listo para añadir más sin rehacerlo.
- Rediseño de contenido o de la estructura de datos del temario — se trabaja sobre el modelo ya decidido en `specs/001-seccion-estudio/design.md`.
- Cualquier UI de `specs/002-seccion-pruebas/` (tests/exámenes) — esa sección todavía no tiene implementación sobre la que aplicar este sistema de diseño; se aplicará cuando esa spec avance.
- Multiusuario real (login, cuentas separadas) — fuera de alcance del proyecto en esta fase (ver `CONSTITUTION.md`), aunque el diseño del selector de tema debe dejar hueco para ese futuro (ver `notas-de-diseno.md`).
- Offline / PWA.
- Accesibilidad más allá del checklist mínimo (p. ej. soporte completo de lector de pantalla, auditoría WCAG completa) — no descartado a futuro, pero no es el foco de esta iteración.
- Progreso de aprendizaje/dominio, estados de revisión personal (estudiado/necesita repaso/dominado/duda), flashcards, repetición espaciada, planificación, estadísticas, recomendaciones, banco de preguntas, simulacros, convocatorias, búsqueda global avanzada — cada una con su propia spec futura (`PRODUCT-VISION.md` §5-§9); `003` solo evita bloquearlas.

## Criterios de aceptación

- [ ] Todo texto de cuerpo sobre su fondo, en ambos temas, cumple WCAG AA (≥4.5:1 texto normal, ≥3:1 texto grande).
- [ ] Existe un componente de navegación persistente visible en los tres tamaños de pantalla (móvil, tablet, escritorio), construido mobile-first y con tablet/escritorio recibiendo el mayor pulido visual.
- [ ] El menú de navegación ofrece tres niveles de densidad (`collapsed`/`compact`/`expanded`) con un default razonable por tamaño de pantalla, y el usuario puede cambiar de nivel manualmente en cualquier tamaño de pantalla.
- [ ] Existe un selector de tema explícito, accesible desde cualquier pantalla, con al menos las opciones "claro" y "oscuro"; la elección persiste entre sesiones sin depender de `prefers-color-scheme`.
- [ ] El modelo de datos/estado del selector de tema admite añadir un tercer tema (o más) sin cambiar su forma (no es un booleano claro/oscuro).
- [ ] Existe un panel de configuración de lectura con al menos control de tamaño de letra, persistente entre sesiones, con un modelo de estado preparado para más ajustes de lectura sin rehacerse.
- [ ] En la vista de un concepto, el usuario puede identificar en todo momento cuál de las tres partes del contenido está viendo (texto oficial / material adaptado / resumen) y moverse entre ellas sin recargar ni perder el contexto.
- [ ] El estado "contenido pendiente de redactar" es visualmente inconfundible con un error de carga o una página vacía, en ambos temas.
- [ ] Existe un estado visual "normativa en revisión" distinto del de "contenido pendiente de redactar", que no oculta el contenido existente y no usa lenguaje ni color de alarma/error.
- [ ] Los badges de núcleo común y bookmark cumplen WCAG AA en ambos temas.
- [ ] Existe navegación local que muestra la estructura del concepto (incluyendo esquema/resumen extenso) y permite volver rápidamente al principio.
- [ ] Se cumple el checklist de accesibilidad mínima del Requisito 12 de `requirements.md`.
- [ ] Ninguna decisión de esta spec (modelo de bookmark, de estados de contenido, de `readingSettings`, de menú) obliga a rehacer trabajo para dar soporte a progreso/flashcards/planificador cuando lleguen esas specs.

## Preguntas abiertas

- ¿Dónde exactamente viven el selector de tema y el panel de configuración de lectura en el layout de navegación (dentro del menú persistente vs. una esquina fija independiente)? Se resuelve como decisión concreta en `notas-de-diseno.md` (propuesta) y se cierra en el `design.md` técnico de Fase 2.
- El scope/namespace exacto de persistencia de las preferencias de interfaz (tema, modo de densidad del menú, ajustes de lectura — cookie, localStorage, tabla de Postgres ligada a `usuario_id`) es una decisión técnica de `lead-developer` en la Fase 2 — esta spec solo fija el requisito de que quede preparada para multiusuario futuro (ver `notas-de-diseno.md`, sección "Futuros evolutivos").
- Si el estado "normativa en revisión" debe mostrar además la fecha o el motivo de la revisión (p. ej. qué artículo cambió) — no viene definido por `verificador-vigencia-normativa` todavía; de momento se diseña solo el estado binario "en revisión / no en revisión".
