/**
 * Trazabilidad por dato individual (specs/018-perfil-oposicion/design.md).
 * Pensado como patrón reutilizable, no solo para esta spec — candidato
 * natural para specs/016-convocatorias cuando se aborde (ver "Futuros
 * evolutivos" de design.md).
 */

/** Un dato concreto que puede estar confirmado con fuente oficial o pendiente. */
export type DatoOficial<T> =
  | { estado: "confirmado"; valor: T; fuente: string; fechaConsulta: string }
  | { estado: "pendiente_confirmar"; nota?: string };

/**
 * Igual que DatoOficial pero sin `valor` propio — para atribuir una fuente a
 * contenido que ya existe por sí mismo (p. ej. la respuesta de una FAQ), no
 * a un dato que haya que mostrar.
 */
export type Atribucion =
  | { estado: "confirmado"; fuente: string; fechaConsulta: string }
  | { estado: "pendiente_confirmar"; nota?: string };
