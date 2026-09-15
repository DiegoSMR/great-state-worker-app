/**
 * Progreso de lectura (posición y continuidad, Requisito 10) — client-only,
 * `localStorage` por concepto, no la cookie `gsw_prefs`. El número de
 * conceptos crece con el temario (potencialmente cientos); una cookie
 * acumulando una entrada por concepto rompería el límite práctico de ~4KB y
 * viajaría entera en cada request aunque la ruta no la necesite —
 * localStorage no tiene ese problema a esta escala (ver
 * specs/003-sistema-de-diseno/design.md).
 */

const PREFIJO_CLAVE = "gsw_progreso:";

type PosicionGuardada = {
  scrollY: number;
  // Qué pestaña estaba activa (id de SECCIONES en SeccionesConcepto) —
  // desde que las secciones son pestañas de verdad que se ocultan entre sí
  // (feedback de Diego probando la app), un scrollY suelto ya no basta para
  // "continuar leyendo": hay que saber también dentro de qué pestaña vale
  // ese scroll. Opcional para no romper entradas guardadas antes de este
  // cambio.
  seccion?: string;
  actualizadoEn: number;
};

export function guardarPosicion(conceptoId: string, scrollY: number, seccion: string): void {
  try {
    const valor: PosicionGuardada = { scrollY, seccion, actualizadoEn: Date.now() };
    window.localStorage.setItem(`${PREFIJO_CLAVE}${conceptoId}`, JSON.stringify(valor));
  } catch {
    // localStorage puede no estar disponible (modo privado, cuota agotada) —
    // no es motivo para romper la lectura, simplemente no se persiste.
  }
}

export function leerPosicion(conceptoId: string): { scrollY: number; seccion: string | null } | null {
  try {
    const raw = window.localStorage.getItem(`${PREFIJO_CLAVE}${conceptoId}`);
    if (!raw) return null;
    const valor = JSON.parse(raw) as Partial<PosicionGuardada>;
    if (typeof valor.scrollY !== "number") return null;
    return { scrollY: valor.scrollY, seccion: typeof valor.seccion === "string" ? valor.seccion : null };
  } catch {
    return null;
  }
}
