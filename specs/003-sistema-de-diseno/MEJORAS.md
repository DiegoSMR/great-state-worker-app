# Mejoras propuestas: Sistema de diseño

**Estado:** incorporada a `requirements.md` (revisión 2) y `notas-de-diseno.md` (secciones 9-13) — pendiente de aprobación final de Diego sobre las 4 decisiones abiertas listadas en `requirements.md`.
**Última actualización:** 2026-09-14

## Objetivo de este documento

`requirements.md` ya identifica los problemas principales de legibilidad, navegación, temas, estados de contenido y configuración de lectura. Este documento propone cómo evolucionar esa spec antes de aprobarla y pasar a `design.md`.

La idea no es convertir el sistema de diseño en una colección de decisiones CSS. Debe definir la experiencia que queremos conseguir y dejar que `design.md` determine la solución técnica concreta.

La aplicación no debe sentirse como una web que contiene apuntes. Debe sentirse como una **herramienta de estudio diseñada para leer, comprender, repasar y volver rápidamente a información normativa**.

---

# 1. Cambios recomendados antes de aprobar `requirements.md`

## 1.1. Añadir explícitamente la experiencia de estudio

El sistema de diseño debería optimizar tres actividades diferentes:

### Primera pasada — comprender

El usuario lee el material adaptado y/o el texto oficial para construir una representación mental del concepto.

La interfaz debe favorecer:

- tipografía cómoda;
- ancho de línea controlado;
- interlineado generoso;
- jerarquía clara;
- separación suficiente entre bloques;
- navegación disponible sin invadir constantemente el contenido;
- ausencia de elementos decorativos innecesarios;
- acceso rápido a otras partes del concepto sin perder el contexto.

### Repaso — recuperar

El usuario ya conoce el concepto y quiere refrescarlo rápidamente.

La interfaz debe favorecer:

- esquema muy visible;
- resumen extenso fácilmente accesible;
- jerarquía de conceptos y subapartados;
- posibilidad de saltar directamente a una sección;
- marcadores y estados de revisión;
- lectura más compacta si el usuario así lo desea.

### Consulta rápida — localizar

El usuario recuerda que una información estaba en un tema y quiere encontrarla sin releerlo entero.

La interfaz debe favorecer:

- índice del concepto;
- navegación por secciones;
- búsqueda futura;
- indicadores claros de dónde se encuentra;
- enlaces a fuentes normativas;
- posibilidad de volver exactamente al punto donde estaba leyendo.

**Decisión recomendada:** estas tres actividades deben formar parte del objetivo del sistema de diseño, aunque no todas sus funcionalidades se implementen en esta spec.

---

# 2. Separar tema visual de perfil de lectura

Actualmente el requisito de lectura empieza por el tamaño de letra. Conviene dejar claro que esto es solo el primer ajuste de un futuro **perfil de lectura**.

El modelo conceptual debería ser equivalente a:

```text
readingSettings
├── fontSize
├── lineHeight
├── contentWidth
├── paragraphSpacing
└── ...futuro
```

No hace falta implementar todos estos controles ahora.

Lo importante es que `requirements.md` exija que el sistema pueda evolucionar sin convertir cada nuevo ajuste en una excepción independiente.

### Ajustes candidatos para futuras iteraciones

- tamaño de letra;
- interlineado;
- ancho máximo de lectura;
- separación entre párrafos;
- densidad de interfaz;
- tipografía de lectura;
- modo de lectura/concentración;
- eventualmente perfiles predefinidos.

### Presets futuros

Podrían existir perfiles como:

- **Cómodo:** lectura larga.
- **Equilibrado:** uso general.
- **Compacto:** repaso rápido.
- **Grande:** máxima legibilidad.

No deberían implementarse como obligación de v1; son una posible capa de UX posterior sobre los mismos ajustes.

---

# 3. Añadir modo concentración

Una aplicación de estudio debería tener una forma explícita de reducir distracciones.

El modo concentración debería poder:

- minimizar u ocultar la navegación global;
- mantener solo los controles necesarios para estudiar;
- aumentar el protagonismo del contenido;
- mantener accesibles los controles esenciales;
- conservar el contexto del tema;
- poder abandonarse fácilmente.

No debe ser simplemente `display: none` para todo lo que no sea contenido. Debe ser un estado de interfaz diseñado específicamente para lectura prolongada.

La implementación concreta queda para `design.md` o una spec posterior si adquiere suficiente entidad.

---

# 4. Navegación local dentro de un concepto

La navegación global resuelve «dónde estoy en la aplicación». Falta resolver «dónde estoy dentro de este tema».

Se recomienda exigir una navegación local que permita:

- ver la estructura del concepto;
- saltar a `Texto oficial`, `Material adaptado` y `Resumen`;
- saltar a `Esquema` o `Resumen extenso`;
- identificar la sección actual;
- volver rápidamente al principio;
- funcionar de forma cómoda en tablet y móvil.

La solución visual concreta no debería quedar fijada en requirements. Puede ser pestañas, navegación anclada, un índice desplegable, scrollspy o una combinación de estos patrones.

### Recomendación

En escritorio/tablet: índice local persistente o fácilmente desplegable.  
En móvil: control compacto tipo «Contenido del tema».

---

# 5. Añadir progreso de lectura

Hay que distinguir claramente entre:

- **progreso de lectura:** cuánto del contenido hemos recorrido;
- **progreso de aprendizaje:** cuánto dominamos un concepto;
- **estado de revisión:** si queremos volver a él;
- **bookmark:** acceso rápido al concepto.

No deben convertirse en una única señal.

El sistema de diseño debería estar preparado para mostrar un indicador de progreso de lectura y para recuperar la última posición de lectura.

### UX recomendada

Al volver a un concepto:

> «Continuar donde lo dejaste»

Esto puede ser tan sencillo como restaurar la posición de scroll y mostrar discretamente una pequeña indicación.

No conviene implementar todavía un sistema complejo de progreso de aprendizaje dentro de `003`.

---

# 6. No sobrecargar el concepto de bookmark

El bookmark actual significa esencialmente «quiero volver a este concepto».

Debe conservar ese significado.

En futuras funcionalidades deberían existir estados separados para cosas como:

- pendiente de estudiar;
- estudiado;
- necesita repaso;
- dominado;
- marcado para consulta;
- duda/punto difícil.

Esto será especialmente importante cuando lleguen estadísticas, flashcards y planificación.

---

# 7. Modelo de estados de contenido más rico

Los estados actuales son correctos pero pueden quedarse cortos.

Se recomienda distinguir conceptualmente:

### Estado de disponibilidad

- `empty` — no existe contenido;
- `partial` — existe solo una parte;
- `available` — contenido utilizable;
- `complete` — todas las piezas previstas están presentes.

### Estado de revisión normativa

- `not_checked`;
- `verified`;
- `needs_review`.

### Estado editorial futuro

- `draft`;
- `review`;
- `published`.

No hace falta implementar todo esto en `003`, pero el diseño debería evitar que un único booleano termine representando conceptos diferentes.

### Indicador de completitud recomendado

En un concepto parcial podría verse algo como:

```text
Texto oficial       ✓
Material adaptado   ✓
Esquema              …
Resumen extenso      …
```

Esto comunica mucho mejor el estado que una página parcialmente vacía.

---

# 8. Hacer que la normativa sea trazable para el usuario

La aplicación trabaja deliberadamente con fuentes primarias. La interfaz debería aprovechar esa ventaja.

Cuando sea relevante, el usuario debería poder identificar:

- fuente normativa;
- norma concreta;
- artículo o referencia relevante;
- enlace a la fuente oficial;
- estado de vigencia;
- última comprobación, cuando exista ese dato.

Esto encaja especialmente bien con el estado «normativa en revisión».

Ejemplo conceptual:

> **Fuente:** Ley X, artículo Y  
> **Vigencia:** verificada  
> **Última comprobación:** fecha

No significa que todos estos metadatos tengan que aparecer siempre en primer plano. La UI debe evitar convertir cada página de estudio en una ficha burocrática.

---

# 9. Mejorar la accesibilidad mínima

Aunque la accesibilidad completa pueda quedar fuera de la primera versión, no conviene diseñar componentes que luego sean difíciles de hacer accesibles.

Como mínimo, el sistema debería asumir:

- foco de teclado visible;
- controles suficientemente grandes para interacción táctil;
- no depender exclusivamente del color para comunicar estados;
- botones reales para acciones;
- HTML semántico;
- estados seleccionados identificables sin color;
- respeto por `prefers-reduced-motion` cuando existan animaciones;
- labels accesibles para iconos;
- navegación por teclado en menús y controles.

El soporte exhaustivo de lectores de pantalla puede mantenerse como trabajo posterior, pero la arquitectura de componentes debe permitirlo.

---

# 10. No fijar demasiado pronto la solución visual

Hay varios puntos de `requirements.md` que deberían describir comportamiento y no una implementación concreta.

## Navegación

En lugar de convertir «hamburguesa / iconos / visible» en una obligación estructural, conviene definir tres **niveles de densidad**:

- `collapsed`;
- `compact`;
- `expanded`.

`design.md` puede decidir si eso se materializa como hamburguesa, rail, sidebar u otra solución.

Esto mantiene el requisito estable aunque la UI evolucione.

## Las tres partes del contenido

Requirements debe exigir que sean diferenciables y navegables:

- texto oficial;
- material adaptado;
- resumen;
- esquema;
- resumen extenso.

Pero no debería exigir pestañas, tarjetas, colores concretos o scrollspy.

La decisión de UI pertenece a `design.md`.

---

# 11. La interfaz debe tener una jerarquía visual estable

Propuesta de jerarquía:

```text
Aplicación
└── Sección
    └── Tema / Concepto
        ├── Contexto y metadata
        ├── Texto oficial
        ├── Material adaptado
        └── Resumen
            ├── Esquema
            └── Resumen extenso
```

Los estados especiales, fuentes y controles deben complementar esta jerarquía, no competir con ella.

Una regla importante: **un aviso nunca debe parecer más importante que el contenido que el usuario ha venido a estudiar**, salvo que exista realmente un riesgo crítico.

---

# 12. Recomendación sobre colores

La propuesta actual de `notas-de-diseno.md` es una buena base: escala de grises independiente por tema y colores diferenciados para núcleo común, bookmark, contenido sin escribir y revisión normativa. fileciteturn15file0L1-L2

Antes de cerrar el diseño conviene validar no solo contraste de texto sino también:

- estados hover/focus/active;
- iconos;
- controles deshabilitados;
- enlaces;
- selección;
- indicadores de progreso;
- mensajes temporales;
- superficies anidadas;
- bordes que transmitan información.

Especialmente importante: **el color nunca debería ser la única diferencia entre dos estados semánticos**.

---

# 13. Propuesta de estructura definitiva para `design.md`

Cuando `requirements.md` esté aprobado, recomendaría que `design.md` siga aproximadamente esta estructura:

1. Visión de experiencia.
2. Principios de diseño.
3. Arquitectura visual de la aplicación.
4. Sistema de tokens.
5. Tipografía.
6. Escala y ritmo de espaciado.
7. Ancho y comportamiento de las columnas de lectura.
8. Navegación global responsive.
9. Navegación local del concepto.
10. Tema y preferencias de apariencia.
11. Perfil de lectura.
12. Componentes de contenido.
13. Estados de contenido.
14. Badges y estados de usuario.
15. Fuentes y vigencia normativa.
16. Accesibilidad.
17. Responsive/tablet.
18. Persistencia de preferencias.
19. Componentes afectados.
20. Flujo de datos e interacción.
21. Riesgos y mitigaciones.
22. Alternativas consideradas.

Esto evita que `design.md` se convierta únicamente en una lista de colores y componentes.

---

# 14. Qué NO haría ahora

No intentaría meter en `003`:

- sistema completo de estadísticas;
- algoritmo de repetición espaciada;
- motor de recomendaciones;
- calendario de estudio;
- banco de preguntas;
- simulacros;
- autenticación;
- PWA/offline;
- editor CMS completo;
- búsqueda global avanzada.

Son funcionalidades válidas, pero deben tener sus propias specs y aprovechar este sistema de diseño cuando llegue el momento.

---

# 15. Resultado que buscamos

La prueba de que `003` está bien diseñada no debería ser «la aplicación ahora tiene un tema oscuro bonito».

Debería ser algo más parecido a esto:

> Puedo estudiar durante una sesión larga sin que la interfaz me moleste; sé siempre dónde estoy; puedo cambiar cómo leo; puedo distinguir fuente oficial, explicación y repaso; puedo volver exactamente al punto donde estaba; sé si un contenido está pendiente, incompleto o en revisión; y puedo moverme por el temario sin perder contexto.

Ese es el estándar que debería guiar las decisiones posteriores.
