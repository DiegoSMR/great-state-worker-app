/**
 * Modelo de preferencias de interfaz (tema, densidad de navegación, ajustes
 * de lectura) — specs/003-sistema-de-diseno/design.md, "Persistencia de
 * tema, densidad de navegación y configuración de lectura".
 *
 * Vive en una única cookie (`PREFERENCIAS_COOKIE`), no en Postgres: son
 * preferencias de dispositivo/navegador (CONSTITUTION.md, principio 6), no
 * estado de usuario que deba sincronizarse entre dispositivos todavía — no
 * hay login. `parsearPreferencias`/`guardarPreferencias` (este último en
 * app/_actions/preferencias.ts) son la única frontera entre este tipo y su
 * mecanismo de persistencia: el día que exista multiusuario real, solo esas
 * dos piezas deberían cambiar, no los componentes de UI.
 */

export const PREFERENCIAS_COOKIE = "gsw_prefs";

/** "papel" añadido en la tercera revisión (notas-de-diseno.md §16) — el
 * modelo de tema ya se diseñó como string extensible (Requisito 3.4)
 * precisamente para este caso, así que solo se añade el valor nuevo. */
export type Tema = "claro" | "oscuro" | "papel";
export type NavDensidad = "hamburguesa" | "iconos" | "visible";
export type TamanoLetra = "pequeno" | "mediano" | "grande";
/** Modo de texto "Manuscrito" (notas-de-diseno.md §15). */
export type EstiloTexto = "digital" | "manuscrito";
/** Solo relevante cuando estiloTexto === "manuscrito". */
export type IntensidadManuscrito = "ligera" | "media" | "intensa";

/**
 * Ajustes de lectura como objeto extensible (Requisito 8.4) — tamaño de
 * letra es la primera propiedad; candidatos futuros (interlineado, ancho de
 * columna, densidad de interfaz...) se añaden aquí sin migrar lo ya
 * guardado. `estiloTexto`/`intensidadManuscrito` (§15) son el primer
 * ejemplo real de esa extensión.
 */
export type ReadingSettings = {
  tamanoLetra: TamanoLetra;
  estiloTexto: EstiloTexto;
  intensidadManuscrito: IntensidadManuscrito;
};

export type Preferencias = {
  /** No es un booleano: admite un tercer tema en el futuro sin cambiar de forma (Requisito 3.4). */
  tema: Tema;
  /** null = sin elección manual, se aplica el default por breakpoint (Requisito 2.4). */
  navDensidad: NavDensidad | null;
  lectura: ReadingSettings;
};

/**
 * Forma de los parches que aceptan `guardarPreferencias` (server action) y
 * `persistir` (PreferenciasProvider): como `ReadingSettings` es un objeto
 * con varios campos, un cambio de un único ajuste de lectura (p. ej. solo
 * `tamanoLetra`) no debe obligar a repetir los demás — `lectura` admite un
 * parche parcial, fusionado sobre el valor actual en vez de reemplazado.
 */
export type PreferenciasPatch = Partial<Omit<Preferencias, "lectura">> & {
  lectura?: Partial<ReadingSettings>;
};

export const PREFERENCIAS_POR_DEFECTO: Preferencias = {
  tema: "claro",
  navDensidad: null,
  lectura: { tamanoLetra: "mediano", estiloTexto: "digital", intensidadManuscrito: "media" },
};

const TEMAS_VALIDOS: readonly Tema[] = ["claro", "oscuro", "papel"];
const NAV_DENSIDADES_VALIDAS: readonly NavDensidad[] = ["hamburguesa", "iconos", "visible"];
const TAMANOS_LETRA_VALIDOS: readonly TamanoLetra[] = ["pequeno", "mediano", "grande"];
const ESTILOS_TEXTO_VALIDOS: readonly EstiloTexto[] = ["digital", "manuscrito"];
const INTENSIDADES_MANUSCRITO_VALIDAS: readonly IntensidadManuscrito[] = ["ligera", "media", "intensa"];

function esTema(valor: unknown): valor is Tema {
  return typeof valor === "string" && (TEMAS_VALIDOS as readonly string[]).includes(valor);
}

function esNavDensidad(valor: unknown): valor is NavDensidad {
  return typeof valor === "string" && (NAV_DENSIDADES_VALIDAS as readonly string[]).includes(valor);
}

function esTamanoLetra(valor: unknown): valor is TamanoLetra {
  return typeof valor === "string" && (TAMANOS_LETRA_VALIDOS as readonly string[]).includes(valor);
}

function esEstiloTexto(valor: unknown): valor is EstiloTexto {
  return typeof valor === "string" && (ESTILOS_TEXTO_VALIDOS as readonly string[]).includes(valor);
}

function esIntensidadManuscrito(valor: unknown): valor is IntensidadManuscrito {
  return (
    typeof valor === "string" &&
    (INTENSIDADES_MANUSCRITO_VALIDAS as readonly string[]).includes(valor)
  );
}

/**
 * Parsea el valor crudo de la cookie con validación defensiva campo a
 * campo — un valor corrupto, ausente o de una versión futura del esquema
 * cae al default en vez de romper el render (nunca se lanza una excepción
 * sin capturar desde aquí).
 */
export function parsearPreferencias(cookieValue: string | undefined): Preferencias {
  if (!cookieValue) return PREFERENCIAS_POR_DEFECTO;

  try {
    const datos: unknown = JSON.parse(cookieValue);
    if (typeof datos !== "object" || datos === null) return PREFERENCIAS_POR_DEFECTO;

    const d = datos as Record<string, unknown>;
    const lectura =
      typeof d.lectura === "object" && d.lectura !== null
        ? (d.lectura as Record<string, unknown>)
        : {};

    return {
      tema: esTema(d.tema) ? d.tema : PREFERENCIAS_POR_DEFECTO.tema,
      navDensidad: d.navDensidad === null || esNavDensidad(d.navDensidad) ? (d.navDensidad as NavDensidad | null) : null,
      lectura: {
        tamanoLetra: esTamanoLetra(lectura.tamanoLetra)
          ? lectura.tamanoLetra
          : PREFERENCIAS_POR_DEFECTO.lectura.tamanoLetra,
        estiloTexto: esEstiloTexto(lectura.estiloTexto)
          ? lectura.estiloTexto
          : PREFERENCIAS_POR_DEFECTO.lectura.estiloTexto,
        intensidadManuscrito: esIntensidadManuscrito(lectura.intensidadManuscrito)
          ? lectura.intensidadManuscrito
          : PREFERENCIAS_POR_DEFECTO.lectura.intensidadManuscrito,
      },
    };
  } catch {
    return PREFERENCIAS_POR_DEFECTO;
  }
}
