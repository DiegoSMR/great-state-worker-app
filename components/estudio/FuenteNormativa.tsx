import { extraerEnlaceFuente } from "@/lib/contenido";

/**
 * `<details>` nativo con las fuentes normativas del concepto (Requisito 11)
 * — colapsado por defecto salvo que el concepto esté "en revisión"
 * (AvisoRevision enlaza aquí, Requisito 11.2). Server Component: no
 * necesita más interactividad que la que ya da `<details>`/`<summary>`.
 */
export function FuenteNormativa({
  fuentes,
  abiertoPorDefecto = false,
}: {
  fuentes: string[];
  abiertoPorDefecto?: boolean;
}) {
  if (fuentes.length === 0) return null;

  return (
    <details
      id="fuente-normativa"
      open={abiertoPorDefecto}
      className="mt-4 scroll-mt-24 text-sm text-texto-secundario"
    >
      <summary className="cursor-pointer select-none font-medium text-texto-secundario hover:text-texto-primario">
        Fuente{fuentes.length > 1 ? "s" : ""} normativa{fuentes.length > 1 ? "s" : ""}
      </summary>
      <ul className="mt-2 space-y-2">
        {fuentes.map((fuente) => {
          const enlace = extraerEnlaceFuente(fuente);
          return (
            <li key={fuente}>
              {enlace ? (
                <a
                  href={enlace}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="underline underline-offset-2 hover:text-texto-primario"
                >
                  {fuente}
                </a>
              ) : (
                fuente
              )}
            </li>
          );
        })}
      </ul>
    </details>
  );
}
