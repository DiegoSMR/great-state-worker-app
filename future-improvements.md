# Future improvements — Great State Worker App

**Estado:** propuesta de producto / backlog estratégico  
**Última actualización:** 2026-09-14

## Propósito

Este documento recoge funcionalidades y evoluciones que deberían estudiarse después de consolidar la base de la aplicación.

La prioridad no es acumular features. La prioridad es construir una **máquina de aprender**: una aplicación que convierta el temario en conocimiento mediante lectura, comprensión, recuperación, práctica, repaso y planificación.

Cada bloque importante debería convertirse en una spec independiente cuando llegue su momento, siguiendo el flujo definido en `CONSTITUTION.md`.

---

# 1. Principios que deberían guiar las futuras specs

1. **Aprendizaje antes que evaluación.** La app debe ayudar primero a aprender y después a medir.
2. **La unidad fundamental es el concepto.** Tests, flashcards, progreso y estadísticas deberían poder relacionarse con conceptos del temario.
3. **El contenido y el estado del usuario son cosas distintas.** El contenido oficial/adaptado se versiona como producto editorial; el progreso pertenece al usuario.
4. **No confundir actividad con aprendizaje.** Leer un tema no significa dominarlo.
5. **La aplicación debe cerrar el ciclo:** aprender → practicar → detectar debilidades → repasar → volver a practicar.
6. **La información normativa debe ser trazable.** Siempre que sea posible, las afirmaciones importantes deben poder relacionarse con fuentes primarias.
7. **La interfaz debe minimizar fricción.** El usuario debería poder pasar de «quiero estudiar» a estar estudiando en pocos pasos.
8. **Las futuras funcionalidades deben integrarse con el modelo de conceptos**, no crear sistemas paralelos desconectados.

---

# 2. Orden global recomendado

## Fase A — Base de estudio

1. `003-sistema-de-diseno`
2. Completar `001-seccion-estudio`
3. Mejorar navegación, lectura y estados
4. Progreso básico de lectura
5. Búsqueda y localización de contenido

## Fase B — Primera máquina de aprendizaje

6. `004-progreso-de-estudio`
7. `005-flashcards`
8. Sistema de repaso basado en dificultad/recuerdo
9. Sesiones de estudio
10. Dashboard personal

## Fase C — Planificación

11. `006-planificador`
12. Objetivos y planificación semanal
13. Motor de recomendaciones
14. Adaptación del plan según rendimiento real

## Fase D — Evaluación

15. `007-banco-de-preguntas`
16. `008-sesiones-de-test`
17. `009-simulacros`
18. Revisión inteligente de errores

## Fase E — Inteligencia y mantenimiento

19. `010-estadisticas`
20. `011-recomendaciones`
21. `012-convocatorias`
22. Verificación periódica de normativa
23. Automatización de mantenimiento del contenido

---

# 3. `004-progreso-de-estudio` — Progreso real del aprendizaje

Esta debería ser probablemente la siguiente gran spec después de consolidar Estudio.

## Objetivo

Saber qué conceptos se han estudiado, cuáles necesitan repaso y cuáles están razonablemente dominados.

## Conceptos que debería distinguir

- nunca estudiado;
- en aprendizaje;
- estudiado;
- necesita repaso;
- difícil;
- dominado;
- abandonado / pendiente.

No conviene empezar con demasiados estados. El modelo interno puede ser más rico que la representación visual.

## Información potencial

Por concepto:

- número de sesiones;
- última sesión;
- tiempo aproximado;
- última valoración de dificultad;
- resultado de prácticas relacionadas;
- fecha recomendada de repaso;
- tendencia reciente.

## Regla fundamental

El progreso no debe ser simplemente una casilla «estudiado / no estudiado».

---

# 4. `005-flashcards` — Recuperación activa

Las flashcards son una de las funcionalidades núcleo ya decididas en el contexto del proyecto.

## Objetivo

Convertir el contenido del temario en oportunidades de recuperación activa, no limitarse a releer.

## Tipos iniciales

- pregunta → respuesta;
- concepto → definición;
- artículo → contenido esencial;
- lista → elementos;
- diferencia entre conceptos;
- verdadero/falso cuando tenga sentido;
- completar hueco, si posteriormente aporta valor.

## Integración con contenido

Cada tarjeta debería poder relacionarse con:

- concepto;
- sección del concepto;
- fuente normativa cuando proceda.

## Futuro sistema de repetición

No hace falta elegir desde el principio un algoritmo concreto, pero la arquitectura debería permitir implementar posteriormente repetición espaciada.

---

# 5. Sistema de repaso inteligente

Una vez existan progreso y flashcards, la app debería poder responder:

> «¿Qué debería repasar hoy?»

El sistema podría priorizar según:

- tiempo desde el último repaso;
- dificultad declarada;
- errores recientes;
- importancia del concepto;
- proximidad de examen/convocatoria;
- frecuencia histórica de fallos;
- cantidad de contenido pendiente.

La recomendación debe ser explicable. El usuario debería poder entender por qué se le está proponiendo un concepto.

---

# 6. Sesiones de estudio

En lugar de limitarse a navegar por páginas, la app podría ofrecer sesiones estructuradas.

Ejemplos:

- «20 minutos de repaso»;
- «Estudiar 3 conceptos nuevos»;
- «Repasar conceptos débiles»;
- «10 flashcards»;
- «Repasar legislación administrativa».

Una sesión debería poder combinar lectura + flashcards + preguntas cuando existan.

---

# 7. Dashboard personal

La pantalla inicial debería responder rápidamente a:

- ¿qué tengo pendiente?
- ¿qué debería hacer hoy?
- ¿qué estudié recientemente?
- ¿qué conceptos tengo débiles?
- ¿por qué oposición estoy estudiando?
- ¿cuál es mi progreso?
- ¿dónde me quedé?

No debería convertirse en un dashboard lleno de gráficas. La métrica principal debe ser **qué acción útil puedo hacer ahora**.

---

# 8. `006-planificador` — Planificación del estudio

## Objetivo

Convertir objetivos abstractos («quiero preparar esta oposición») en trabajo concreto.

## Funcionalidades potenciales

- calendario;
- objetivos semanales;
- objetivos mensuales;
- sesiones planificadas;
- temas previstos;
- flashcards previstas;
- tests previstos;
- días de descanso;
- reprogramación de tareas pendientes.

## Punto importante

El planificador no debería asumir que el usuario cumple perfectamente su calendario.

Debe adaptarse cuando una sesión se pierde.

---

# 9. Motor de recomendaciones

Una evolución natural sería que la app aprendiese qué necesita el usuario.

Ejemplo:

> «Llevas 8 días sin repasar procedimiento administrativo y tus últimos resultados han bajado. Te recomiendo 15 minutos de repaso antes de continuar con contenido nuevo.»

El sistema debería poder combinar:

- progreso;
- rendimiento;
- planificación;
- dificultad;
- fechas importantes;
- contenido pendiente.

Primero deberían existir datos fiables; el motor de recomendaciones debe llegar después de progreso + práctica + planificación.

---

# 10. `007-banco-de-preguntas`

## Objetivo

Crear una base de preguntas de oposición reutilizable y relacionada con el temario.

## Modelo conceptual

Una pregunta debería poder tener:

- enunciado;
- opciones;
- respuesta correcta;
- explicación;
- concepto relacionado;
- fuente normativa;
- dificultad;
- etiquetas;
- procedencia;
- año/convocatoria si es una pregunta real;
- estado de revisión.

## Procedencia

Debe distinguirse claramente entre:

- pregunta oficial de una convocatoria/examen;
- pregunta original creada para la app;
- pregunta adaptada a partir de una fuente permitida.

No reproducir material protegido de academias/editoriales.

---

# 11. `008-sesiones-de-test`

Una vez exista el banco de preguntas, crear una experiencia de test completa.

## Modos posibles

- test por oposición;
- test por tema;
- test por concepto;
- preguntas falladas;
- preguntas difíciles;
- preguntas nuevas;
- test mixto;
- número de preguntas configurable;
- tiempo opcional.

## UX importante

La revisión posterior es casi tan importante como el test.

Después de responder debería poder verse:

- respuesta elegida;
- respuesta correcta;
- explicación;
- fuente;
- concepto relacionado;
- por qué se ha fallado;
- posibilidad de marcar para repaso.

---

# 12. `009-simulacros`

Los simulacros deberían llegar después de que el banco de preguntas y las sesiones de test estén maduros.

Podrían reproducir condiciones de examen:

- distribución de preguntas;
- tiempo límite;
- penalizaciones;
- bloques;
- pausa o ausencia de pausa según modo;
- revisión únicamente al finalizar.

El resultado debe integrarse en estadísticas y progreso, no ser una experiencia aislada.

---

# 13. Revisión inteligente de errores

No basta con guardar que una pregunta fue incorrecta.

La app debería detectar patrones:

> «Estás fallando repetidamente preguntas sobre recursos administrativos.»

Y traducirlos a conceptos del temario:

> «Te recomiendo repasar el concepto X y después hacer 5 preguntas relacionadas.»

Esto es una de las piezas que más puede diferenciar la aplicación de un simple banco de tests.

---

# 14. `010-estadisticas`

Las estadísticas deben servir para tomar decisiones, no solo para enseñar números.

## Métricas posibles

### Estudio

- conceptos completados;
- conceptos en progreso;
- tiempo de estudio;
- sesiones;
- cobertura del temario.

### Memoria

- retención estimada;
- rendimiento en flashcards;
- conceptos olvidados;
- tiempo desde el último repaso.

### Tests

- porcentaje de acierto;
- evolución temporal;
- rendimiento por oposición;
- rendimiento por tema;
- rendimiento por concepto;
- tipos de error.

### Planificación

- sesiones previstas vs. realizadas;
- objetivos cumplidos;
- retrasos;
- carga futura.

## Principio

Una estadística es buena si responde «¿qué debería hacer ahora?». Si solo es decorativa, probablemente no merece existir.

---

# 15. `011-recomendaciones`

Cuando existan suficientes datos, crear una capa de recomendaciones transversal.

Ejemplos:

- estudiar un concepto nuevo;
- repasar un concepto olvidado;
- hacer flashcards;
- hacer preguntas;
- revisar errores;
- actualizar contenido normativo;
- reajustar el plan.

La recomendación debería incluir siempre una acción directa.

---

# 16. `012-convocatorias` — Radar de oposiciones

Ya existe un agente especializado para investigar convocatorias. La app podría convertir esa información en una funcionalidad de producto.

## Información potencial

- convocatoria;
- organismo;
- oposición;
- plazas;
- turno;
- fecha de publicación;
- plazo de inscripción;
- estado del proceso;
- fechas de examen cuando estén disponibles;
- enlaces oficiales;
- temario asociado.

## Integración con estudio

Una convocatoria debería poder modificar las prioridades del planificador:

> «El examen de esta oposición se acerca → aumentar prioridad de estos conceptos.»

La fuente oficial debe ser la referencia principal.

---

# 17. Vigencia normativa continua

El agente `verificador-vigencia-normativa` ya tiene un papel definido en el proyecto.

La evolución natural es pasar de una comprobación manual a un sistema de mantenimiento controlado.

Posibles estados:

- verificado;
- pendiente de comprobación;
- necesita revisión;
- revisado;
- afectado por reforma.

No debería actualizar automáticamente contenido normativo sin revisión humana. La automatización puede detectar y proponer cambios; la publicación debería seguir un flujo controlado.

---

# 18. Búsqueda global

La aplicación necesitará eventualmente una búsqueda transversal.

Debe poder encontrar:

- conceptos;
- artículos;
- términos;
- flashcards;
- preguntas;
- errores;
- fuentes.

Futuro avanzado:

- búsqueda semántica;
- sugerencias;
- resultados agrupados por concepto;
- salto directo al fragmento relevante.

No implementaría búsqueda semántica antes de tener una búsqueda textual excelente.

---

# 19. Sistema de notas personales

Podría ser muy útil, pero debe diseñarse con cuidado.

Posibles tipos:

- nota libre;
- duda;
- regla mnemotécnica;
- error frecuente;
- comentario sobre una pregunta.

Las notas deberían estar vinculadas a un concepto o fragmento, no existir únicamente como un bloc global.

---

# 20. Marcado de dificultad / «esto me cuesta»

El bookmark no debería absorber esta función.

Se puede añadir un estado específico:

> «Me cuesta»

Esto alimentaría:

- repaso;
- recomendaciones;
- estadísticas;
- selección de preguntas.

---

# 21. Sistema de etiquetas

Además de la relación oposición↔concepto, podrían existir etiquetas transversales:

- constitucional;
- procedimiento administrativo;
- personal;
- contratación;
- administración electrónica;
- legislación autonómica;
- difícil;
- frecuente;
- etc.

Las etiquetas deben usarse para mejorar navegación y recomendaciones, no convertirse en una taxonomía excesivamente compleja.

---

# 22. Contenido multimedia, solo si aporta aprendizaje

Posibles incorporaciones futuras:

- diagramas;
- esquemas visuales;
- mapas conceptuales;
- tablas comparativas;
- líneas temporales;
- audio de repaso.

No añadir multimedia por decoración. En una aplicación de oposiciones, un buen esquema textual puede ser más útil que una ilustración bonita.

---

# 23. Comparadores y herramientas específicas para legislación

Hay oportunidades de producto especialmente interesantes para normativa.

Ejemplos:

- comparar dos artículos;
- mostrar modificaciones legislativas;
- visualizar estructura de una ley;
- índice de artículos;
- localizar referencias cruzadas;
- mostrar definiciones relacionadas;
- navegar entre normas citadas.

Esto podría convertirse en una de las funcionalidades diferenciales de la aplicación.

---

# 24. Sistema de referencias cruzadas

Un concepto debería poder indicar:

> «Relacionado con: X, Y, Z»

Y las normas podrían enlazarse entre sí.

Esto permitiría convertir el temario en una red de conocimiento en vez de una colección de páginas independientes.

---

# 25. Arquitectura de aprendizaje basada en el concepto

A largo plazo, el concepto debería ser la entidad que conecta todo:

```text
                    ┌── contenido
                    ├── fuentes
                    ├── flashcards
Concepto ───────────┼── preguntas
                    ├── progreso
                    ├── errores
                    ├── notas
                    ├── planificación
                    └── estadísticas
```

Esto debería considerarse una decisión arquitectónica importante antes de implementar demasiadas features independientes.

---

# 26. Preparación para multiusuario

No es necesario implementar login en v1.

Sí conviene mantener separados:

- contenido global;
- configuración del usuario;
- progreso;
- bookmarks;
- notas;
- estadísticas;
- planificación.

La arquitectura ya tiene como principio estar preparada para multiusuario futuro.

---

# 27. Qué NO priorizar

No priorizaría, salvo que aparezca una necesidad real:

- PWA/offline;
- aplicación móvil nativa;
- gamificación agresiva;
- rankings sociales;
- logros por completar contenido sin relación con aprendizaje;
- animaciones complejas;
- personalización estética excesiva;
- IA conversacional como fin en sí mismo;
- generación masiva automática de contenido sin verificación.

El producto debe optimizar aprendizaje, no cantidad de funcionalidades.

---

# 28. Roadmap resumido

| Orden | Spec / área | Prioridad | Motivo |
|---:|---|---|---|
| 1 | 003 Sistema de diseño | 🔴 Crítica | Base transversal de toda la UX |
| 2 | 001 Sección de estudio | 🔴 Crítica | Núcleo del producto |
| 3 | Progreso de lectura | 🟠 Alta | Mejora inmediata de la experiencia |
| 4 | Progreso de estudio | 🔴 Crítica | Necesario para construir aprendizaje adaptativo |
| 5 | Flashcards | 🔴 Crítica | Recuperación activa |
| 6 | Repaso inteligente | 🔴 Crítica | Convierte datos en aprendizaje |
| 7 | Sesiones de estudio | 🟠 Alta | Reduce fricción |
| 8 | Dashboard | 🟠 Alta | Punto de entrada accionable |
| 9 | Planificador | 🔴 Crítica | Convierte objetivos en trabajo |
| 10 | Banco de preguntas | 🟠 Alta | Base de evaluación |
| 11 | Tests | 🟠 Alta | Práctica específica de oposición |
| 12 | Revisión de errores | 🔴 Crítica | Conecta evaluación con aprendizaje |
| 13 | Simulacros | 🟡 Media | Preparación específica de examen |
| 14 | Estadísticas | 🟠 Alta | Diagnóstico |
| 15 | Recomendaciones | 🟠 Alta | Personalización |
| 16 | Convocatorias | 🟠 Alta | Contexto real de preparación |
| 17 | Vigencia normativa | 🟠 Alta | Fiabilidad del contenido |
| 18 | Búsqueda avanzada | 🟡 Media | Escala del contenido |
| 19 | Notas | 🟡 Media | Personalización |
| 20 | Herramientas legislativas | 🟢 Evolutiva | Diferenciación del producto |

---

# 29. Principio final

La aplicación debería evolucionar en este orden:

```text
TEMARIO
   ↓
COMPRENDER
   ↓
RECORDAR
   ↓
PRACTICAR
   ↓
DETECTAR DEBILIDADES
   ↓
REPASAR
   ↓
PLANIFICAR
   ↓
SIMULAR EXAMEN
   ↓
MEJORAR EL PLAN
   ↺
```

Si una nueva funcionalidad no mejora claramente uno de estos pasos o la conexión entre ellos, debería cuestionarse antes de entrar en el roadmap.
