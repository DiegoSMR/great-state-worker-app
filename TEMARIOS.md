# Temario: cómo está organizado

El contenido real del temario **no vive en este documento** — vive como datos en [`content/temario.yaml`](./content/temario.yaml), para poder filtrarlo por oposición o por tema en vez de tener un documento distinto por cada proceso.

Última actualización: 2026-09-14

## El modelo

`content/temario.yaml` tiene tres partes:

- **`oposiciones`** — los 7 procesos objetivo (Ayuntamiento de Zaragoza, Diputación de Zaragoza, DGA Auxiliar Administrativa, SALUD, AGE, TAI, Ejecutivos de Informática DGA).
- **`conceptos`** — las unidades reales de contenido a estudiar (~67 conceptos). Un concepto se escribe una sola vez aunque lo pidan varias oposiciones.
- **`temario`** — la tabla de relación: cada fila dice "en la oposición X, el concepto Y es el tema oficial número N, dentro de este bloque". Es la que permite filtrar.

Filtros típicos sobre `temario`:
- **Temario oficial de una oposición** → filas donde `op == X`, ordenadas por `num`. Reconstruye exactamente el índice numerado de esa convocatoria.
- **Todo lo que cubre un concepto, venga de donde venga** → filas donde `concepto == Y`. Por ejemplo, filtrar por `procedimiento-administrativo-comun` devuelve las 5 oposiciones que lo piden, cada una con su numeración oficial distinta.
- **Núcleo común de Administración** → conceptos que aparecen en ≥2 de las 5 oposiciones del grupo `administracion`.
- **Solapamiento en Informática** → conceptos que aparecen en las 2 oposiciones del grupo `informatica` (TAI y Ejecutivos de Informática DGA).

Un mismo concepto puede aparecer varias veces dentro de la misma oposición cuando esa convocatoria lo trocea en más de un tema oficial (p. ej. el Ayuntamiento de Zaragoza divide "Procedimiento Administrativo Común" en 5 temas oficiales; la DGA lo mete en uno). El dato queda fiel a la convocatoria real, y el contenido de estudio se escribe una sola vez por concepto.

## Qué se ha encontrado (resumen)

**Grupo Administración** (Ayuntamiento de Zaragoza, DPZ, DGA, SALUD, AGE): hay un núcleo transversal de ~10 conceptos que se repite en los 5 procesos (Constitución, Estatuto de Autonomía de Aragón, Procedimiento Administrativo Común, Estatuto Básico del Empleado Público, igualdad/violencia de género, prevención de riesgos laborales, protección de datos, ofimática básica). Lo que diferencia a cada proceso es su bloque específico: régimen local para Zaragoza/DPZ/DGA, organización estatal para AGE, bloque sanitario propio (y más extenso) para SALUD.

**Grupo Informática** (TAI, Ejecutivos de Informática DGA): el bloque técnico (bases de datos/SQL, programación orientada a objetos, arquitectura cliente-servidor, desarrollo web, redes, seguridad) se solapa mucho entre los dos procesos.

## Pendiente

- **SALUD Aragón**: los temas 11-47 solo se conocen agrupados por bloque temático, sin numeración exacta tema a tema — pendiente de completar con una fuente más detallada.
- **Ejecutivos de Informática DGA**: los temas 1-15 (materias generales) están sin confirmar — el PDF oficial de aragon.es no es accesible de forma automática. Confirmados los temas 16-30 (materias específicas técnicas).
- Contrastar todos los temarios con la convocatoria vigente de cada proceso antes de darlos por definitivos — algunas fuentes consultadas pueden llevar 1-2 años sin actualizarse.
- Revisar la asignación de `concepto` de cada fila: se ha hecho con criterio razonable pero sin verificación exhaustiva línea a línea.

Fuentes usadas para cada oposición: ver el campo `fuente` de cada entrada en `oposiciones` dentro de `content/temario.yaml`.
