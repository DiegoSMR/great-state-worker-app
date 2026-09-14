# Product Vision — Great State Worker App

**Estado:** documento de visión y planificación de producto  
**Última actualización:** 2026-09-14

## 1. Visión

Great State Worker App debe ser una herramienta personal de preparación de oposiciones centrada en una idea:

> **Convertir el temario en un sistema que ayude a aprender, recordar, practicar y mejorar, no simplemente en un repositorio de apuntes.**

La aplicación debe permitir pasar de la fuente normativa y el contenido de estudio a una preparación progresiva:

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
ANALIZAR RESULTADOS
   ↓
MEJORAR EL PLAN
   ↺
```

El producto debe crecer alrededor de este ciclo.

---

# 2. Principios de producto

## 2.1. Aprendizaje antes que evaluación

La aplicación debe construir primero una base de estudio sólida. Tests y simulacros deben apoyarse en el conocimiento que el usuario ha estudiado, no sustituirlo.

## 2.2. El contenido es el núcleo

El temario no es un conjunto de PDFs externos. Los conceptos deben poder estudiarse directamente dentro de la aplicación.

## 2.3. Un concepto, una fuente de verdad

Cuando un concepto aparece en varias oposiciones, el contenido debe reutilizarse. La relación con cada oposición determina dónde aparece, pero no obliga a duplicarlo.

## 2.4. Fuentes primarias

El contenido normativo debe basarse prioritariamente en fuentes oficiales. Los materiales adaptados y resúmenes deben ser originales.

## 2.5. La aplicación debe enseñar al usuario qué hacer después

Una buena aplicación de estudio no debería limitarse a mostrar datos. Cuando sea posible, debe responder:

- ¿Qué debería estudiar ahora?
- ¿Qué debería repasar?
- ¿Qué conceptos tengo débiles?
- ¿Qué estoy dejando atrás?
- ¿Cómo voy respecto a mi planificación?

## 2.6. La interfaz debe desaparecer durante el estudio

La UI debe facilitar la concentración. Durante una sesión larga, el contenido debe ser protagonista y los controles secundarios.

---

# 3. Modelo conceptual del producto

El eje central debe ser el **concepto de estudio**.

```text
Oposición
   │
   └── Temario
          │
          └── Concepto
                ├── Texto oficial
                ├── Material adaptado
                ├── Esquema
                ├── Resumen
                ├── Fuentes
                ├── Flashcards
                ├── Preguntas
                ├── Progreso
                ├── Historial de estudio
                ├── Errores
                └── Notas
```

A partir de este núcleo se construyen las funcionalidades posteriores.

Esto evita diseñar aplicaciones independientes de:

- temario;
- flashcards;
- tests;
- planificación;
- estadísticas.

Todas deben hablar sobre los mismos conceptos.

---

# 4. Arquitectura funcional propuesta

La aplicación madura debería organizarse aproximadamente en estas áreas:

```text
Inicio / Dashboard
│
├── Estudio
│   ├── Por oposición
│   ├── Por tema
│   ├── Por concepto
│   ├── Marcadores
│   └── Continuar estudiando
│
├── Repaso
│   ├── Flashcards
│   ├── Repaso programado
│   ├── Errores
│   └── Conceptos débiles
│
├── Pruebas
│   ├── Preguntas
│   ├── Tests
│   ├── Simulacros
│   └── Historial
│
├── Planificación
│   ├── Calendario
│   ├── Objetivos
│   ├── Sesiones
│   └── Progreso
│
├── Estadísticas
│   ├── Progreso
│   ├── Rendimiento
│   ├── Fortalezas
│   └── Debilidades
│
└── Información
    ├── Convocatorias
    ├── Normativa
    └── Fuentes
```

No significa que todas estas secciones deban existir desde el principio.

---

# 5. Orden de implementación recomendado

## Fase 1 — Sistema de diseño

**Spec:** `003-sistema-de-diseno`

Objetivo: crear la base visual y de interacción sobre la que crecerá todo el producto.

Debe resolver:

- legibilidad;
- tablet-first;
- navegación;
- temas;
- perfil de lectura;
- estados de contenido;
- componentes comunes;
- accesibilidad básica;
- navegación local;
- modo concentración como evolución prevista.

**Dependencias:** ninguna.

---

## Fase 2 — Sección de estudio

**Spec:** `001-seccion-estudio`

Objetivo: tener un temario realmente estudiable.

Debe permitir:

- seleccionar oposición;
- navegar por temas;
- consultar conceptos;
- leer contenido oficial;
- leer material adaptado;
- consultar esquemas y resúmenes;
- distinguir estados de contenido;
- marcar conceptos;
- navegar cómodamente entre conceptos.

**Dependencias:** sistema de diseño.

---

## Fase 3 — Progreso de estudio

**Nueva spec sugerida:** `004-progreso-estudio`

Objetivo: empezar a registrar el aprendizaje sin introducir todavía algoritmos complejos.

Debe distinguir:

- contenido visto;
- tiempo/sesiones;
- última posición;
- conceptos estudiados;
- conceptos pendientes;
- estado de revisión.

Importante:

> Ver un concepto no significa dominarlo.

El modelo debe permitir evolucionar posteriormente hacia una estimación de dominio.

**Dependencias:** estudio + estado de usuario.

---

## Fase 4 — Flashcards

**Nueva spec sugerida:** `005-flashcards`

Objetivo: convertir el contenido estudiado en recuperación activa.

Debe contemplar:

- flashcards asociadas a conceptos;
- respuesta antes de revelar solución;
- valoración del recuerdo;
- historial;
- selección de tarjetas;
- sesiones de repaso.

Inicialmente puede utilizar un sistema sencillo.

**Dependencias:** conceptos + progreso.

---

## Fase 5 — Repaso inteligente

**Nueva spec sugerida:** `006-repaso-inteligente`

Objetivo: decidir qué merece ser repasado.

Debe considerar progresivamente:

- dificultad;
- último repaso;
- rendimiento;
- errores;
- frecuencia de repaso;
- dominio estimado.

Aquí puede introducirse repetición espaciada, pero no antes de tener datos suficientes.

**Dependencias:** progreso + flashcards.

---

## Fase 6 — Sesiones de estudio

**Nueva spec sugerida:** `007-sesiones-estudio`

Objetivo: convertir acciones aisladas en sesiones medibles.

Una sesión puede contener:

```text
Sesión
├── duración
├── conceptos estudiados
├── flashcards
├── preguntas
└── resultado
```

Esto permitirá posteriormente responder qué tipo de estudio funciona mejor.

**Dependencias:** progreso + flashcards.

---

## Fase 7 — Dashboard

**Nueva spec sugerida:** `008-dashboard`

Objetivo: ofrecer una visión inmediata del estado de preparación.

Debe responder:

- ¿Qué estudié recientemente?
- ¿Qué tengo pendiente?
- ¿Qué debería repasar?
- ¿Dónde estoy progresando?
- ¿Qué conceptos necesitan atención?

El dashboard no debe convertirse en una colección de gráficos sin utilidad.

Cada elemento debería conducir a una acción.

**Dependencias:** progreso + sesiones + repaso.

---

## Fase 8 — Planificador

**Nueva spec sugerida:** `009-planificador`

Objetivo: transformar objetivos de preparación en un plan ejecutable.

Debe contemplar:

- objetivos;
- calendario;
- sesiones previstas;
- tiempo disponible;
- prioridades;
- seguimiento;
- reajuste del plan.

La planificación debería poder adaptarse a la realidad.

Si un día no se estudia, no debería simplemente aparecer todo como "incumplido": el sistema debería permitir reorganizar.

**Dependencias:** progreso + sesiones + dashboard.

---

# 6. Segunda gran etapa: evaluación

## Fase 9 — Banco de preguntas

**Nueva spec sugerida:** `010-banco-de-preguntas`

Objetivo: disponer de preguntas asociadas a conceptos concretos.

Cada pregunta debería poder relacionarse con:

- concepto;
- oposición;
- materia;
- dificultad;
- fuente;
- explicación;
- respuesta correcta;
- errores frecuentes.

Esto permitirá conectar las preguntas con el temario.

---

## Fase 10 — Tests

**Nueva spec sugerida:** `011-tests`

Objetivo: realizar sesiones de preguntas configurables.

Ejemplos:

- por oposición;
- por tema;
- por conceptos débiles;
- preguntas aleatorias;
- preguntas nuevas;
- preguntas falladas;
- dificultad;
- número de preguntas.

---

## Fase 11 — Sistema de errores

**Nueva spec sugerida:** `012-errores-y-repaso`

Objetivo: convertir los errores en conocimiento.

Un error debería poder producir:

```text
Pregunta fallada
      ↓
Concepto relacionado
      ↓
Debilidad detectada
      ↓
Repaso recomendado
      ↓
Nueva pregunta
      ↓
Comprobar mejora
```

Esta puede ser una de las funcionalidades con más valor de toda la aplicación.

---

## Fase 12 — Simulacros

**Nueva spec sugerida:** `013-simulacros`

Objetivo: reproducir condiciones de examen.

Debe permitir:

- número de preguntas;
- tiempo;
- reglas del examen;
- puntuación;
- penalizaciones;
- resultado;
- análisis posterior.

El simulacro debe reutilizar el banco de preguntas y el motor de tests.

---

# 7. Tercera gran etapa: inteligencia sobre el aprendizaje

## Fase 13 — Estadísticas

**Nueva spec sugerida:** `014-estadisticas`

No debería limitarse a:

> Has estudiado 37 horas.

Debería responder preguntas útiles:

- ¿Qué temas domino?
- ¿Qué temas estoy olvidando?
- ¿Qué oposición tengo más avanzada?
- ¿Dónde cometo más errores?
- ¿Qué materias tienen peor rendimiento?
- ¿Estoy mejorando?
- ¿Estoy dedicando demasiado tiempo a algo que ya domino?

---

## Fase 14 — Recomendaciones

**Nueva spec sugerida:** `015-recomendaciones`

Aquí la aplicación empieza a comportarse como un preparador auxiliar.

Ejemplos:

> Repasa hoy estos 3 conceptos: han empeorado en los últimos repasos.

> Tienes buen rendimiento en Constitución, pero llevas 12 días sin repasarla.

> Estás fallando preguntas relacionadas con X. Revisa primero el resumen del concepto.

> Esta semana has dedicado mucho tiempo a temas que ya dominas.

Las recomendaciones deben ser explicables.

No debería existir una "IA mágica" que simplemente diga qué hacer sin explicar por qué.

---

# 8. Cuarta gran etapa: planificación real de oposición

## Fase 15 — Radar de convocatorias

**Nueva spec sugerida:** `016-convocatorias`

Debe permitir:

- consultar convocatorias;
- fechas;
- plazas;
- organismos;
- requisitos;
- estado;
- enlaces oficiales;
- alertas.

Debe utilizar fuentes oficiales siempre que sea posible.

---

## Fase 16 — Vincular convocatorias con preparación

Una convocatoria debería poder responder:

```text
Convocatoria
   ↓
Oposición
   ↓
Temario
   ↓
Conceptos
   ↓
Progreso actual
   ↓
Preparación pendiente
```

Esto permite algo mucho más útil que un simple calendario.

Ejemplo:

> Quedan X días y tienes estudiado el Y% del contenido relevante para esta convocatoria.

---

# 9. Funcionalidades posteriores

Estas funcionalidades pueden aportar mucho valor, pero no deberían adelantarse a las anteriores.

## Búsqueda global

Buscar por:

- concepto;
- artículo;
- palabra;
- norma;
- oposición;
- fuente.

## Herramienta normativa

Una vista especializada para navegar legislación y relacionarla con conceptos.

## Notas personales

Notas vinculadas a:

- conceptos;
- preguntas;
- flashcards;
- sesiones.

## Etiquetas personales

Por ejemplo:

- importante;
- difícil;
- memorizar;
- revisar;
- duda.

## Comparación entre oposiciones

Mostrar qué partes del temario son comunes entre dos oposiciones.

## Importación/exportación

Posibilidad futura de exportar:

- estadísticas;
- flashcards;
- planificación;
- datos personales.

## Multiusuario

No es necesario ahora, pero la arquitectura debe evitar bloquearlo.

---

# 10. Funcionalidades que deliberadamente NO priorizaría

No construiría pronto:

- red social;
- rankings;
- gamificación agresiva;
- logros sin utilidad educativa;
- chat de IA como protagonista;
- generación indiscriminada de contenido;
- PWA/offline;
- aplicación móvil nativa;
- CMS complejo;
- sistema de cuentas completo;
- personalización visual excesiva.

La IA debe ayudar a estudiar, no convertirse en el producto.

---

# 11. El papel de la IA

La IA puede aportar mucho valor, pero debería aparecer progresivamente.

## Etapa inicial

Uso interno para:

- ayudar a redactar material adaptado;
- revisar contenido;
- localizar fuentes;
- detectar cambios normativos;
- proponer flashcards;
- proponer preguntas.

## Etapa intermedia

Asistencia al usuario:

- explicar conceptos;
- reformular;
- crear ejemplos;
- generar preguntas de práctica;
- detectar posibles lagunas.

## Etapa avanzada

Preparador personalizado:

```text
Datos del usuario
      +
Contenido
      +
Historial
      +
Resultados
      +
Plan
      ↓
Recomendación
```

La IA no debería sustituir los datos deterministas cuando estos sean suficientes.

Por ejemplo, si sabemos que una norma ha cambiado, no necesitamos un LLM para decidir si la fecha de la convocatoria ha pasado.

---

# 12. Principio fundamental: cada funcionalidad debe alimentar el sistema

Una característica nueva debería preguntarse:

> ¿Qué dato produce y qué funcionalidades posteriores pueden aprovecharlo?

Ejemplo:

```text
Flashcard
   ↓
Resultado
   ↓
Progreso
   ↓
Dominio estimado
   ↓
Repaso
   ↓
Planificación
   ↓
Estadísticas
```

Si una funcionalidad genera datos aislados que ninguna otra parte utiliza, probablemente haya que cuestionar su diseño.

---

# 13. Orden global recomendado

```text
003 Sistema de diseño
        ↓
001 Sección de estudio
        ↓
004 Progreso de estudio
        ↓
005 Flashcards
        ↓
006 Repaso inteligente
        ↓
007 Sesiones de estudio
        ↓
008 Dashboard
        ↓
009 Planificador
        ↓
010 Banco de preguntas
        ↓
011 Tests
        ↓
012 Errores y repaso
        ↓
013 Simulacros
        ↓
014 Estadísticas
        ↓
015 Recomendaciones
        ↓
016 Convocatorias
        ↓
017 Preparación por convocatoria
        ↓
Búsqueda / normativa / notas / herramientas
```

Este orden no debe considerarse definitivo. Es una propuesta inicial para que Claude pueda revisarla críticamente.

---

# 14. Dependencias importantes

La arquitectura debería intentar respetar estas relaciones:

```text
                 ┌──────────────┐
                 │   TEMARIO    │
                 └──────┬───────┘
                        ↓
                 ┌──────────────┐
                 │   ESTUDIO    │
                 └──────┬───────┘
                        ↓
                 ┌──────────────┐
                 │   PROGRESO   │
                 └──────┬───────┘
                        ↓
              ┌─────────┴─────────┐
              ↓                   ↓
        ┌───────────┐       ┌───────────┐
        │ FLASHCARDS│       │  SESIONES │
        └─────┬─────┘       └─────┬─────┘
              ↓                   ↓
              └─────────┬─────────┘
                        ↓
                ┌───────────────┐
                │    REPASO     │
                └───────┬───────┘
                        ↓
                ┌───────────────┐
                │  PLANIFICADOR │
                └───────────────┘

        TEMARIO
           ↓
    BANCO DE PREGUNTAS
           ↓
         TESTS
           ↓
        ERRORES
           ↓
        REPASO
```

---

# 15. Criterio de calidad del producto

Una versión madura de la aplicación debería permitir contestar afirmativamente a estas preguntas:

### Contenido

- ¿Puedo estudiar el temario completo dentro de la aplicación?
- ¿Puedo distinguir fuente oficial, explicación y resumen?
- ¿Sé cuándo un contenido está incompleto o necesita revisión?
- ¿Puedo encontrar rápidamente una información concreta?

### Estudio

- ¿Puedo continuar exactamente donde lo dejé?
- ¿Puedo estudiar cómodamente durante una sesión larga?
- ¿La interfaz se adapta a cómo quiero leer?
- ¿Puedo concentrarme sin distracciones?

### Aprendizaje

- ¿La aplicación sabe qué he estudiado?
- ¿Puede distinguir estudiar de dominar?
- ¿Me ayuda a recordar activamente?
- ¿Detecta mis debilidades?

### Evaluación

- ¿Puedo practicar por temas?
- ¿Puedo practicar sobre mis puntos débiles?
- ¿Puedo analizar mis errores?
- ¿Puedo realizar simulacros realistas?

### Planificación

- ¿Puedo convertir un objetivo en sesiones concretas?
- ¿El plan se adapta cuando no cumplo una sesión?
- ¿Puedo saber si llego preparado a una convocatoria?

### Inteligencia

- ¿Las recomendaciones están basadas en mis datos?
- ¿Puedo entender por qué me recomienda algo?
- ¿La IA complementa el sistema en vez de ocultar su funcionamiento?

---

# 16. Documento destinado a revisión por Claude

Este documento **no debe considerarse una arquitectura definitiva ni una lista cerrada de specs**.

Su propósito es servir como propuesta inicial para que Claude realice una revisión exhaustiva.

Claude debería analizar:

1. si el orden de implementación es realmente óptimo;
2. qué funcionalidades faltan;
3. qué funcionalidades sobran;
4. qué funcionalidades deberían dividirse;
5. qué funcionalidades deberían fusionarse;
6. qué dependencias de datos existen;
7. qué decisiones deben tomarse antes de crear determinadas specs;
8. qué partes deberían ser cross-cutting;
9. qué riesgos existen en el modelo de datos;
10. qué decisiones tomadas demasiado pronto podrían limitar el producto;
11. qué funcionalidades tienen mayor impacto real en el aprendizaje;
12. qué debería simplificarse para mantener el proyecto sostenible;
13. cómo debería evolucionar el modelo de dominio;
14. qué métricas deberían registrarse desde el principio;
15. qué elementos conviene preparar ahora aunque se implementen mucho más tarde.

La revisión debería ser crítica. No se busca que Claude confirme esta propuesta, sino que intente encontrar sus errores antes de convertirla en trabajo de implementación.

---

# 17. Resultado esperado de la revisión

El resultado ideal de la siguiente sesión de planificación sería obtener:

```text
PRODUCT-VISION.md
        ↓
Mapa de funcionalidades
        ↓
Dependencias
        ↓
Orden revisado
        ↓
Especificaciones propuestas
        ↓
Prioridad
        ↓
Riesgos
        ↓
Decisiones arquitectónicas previas
        ↓
Roadmap definitivo
```

Solo después de esa revisión debería empezarse a convertir cada bloque en `requirements.md → design.md → tasks.md`.
