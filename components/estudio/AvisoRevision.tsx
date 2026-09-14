import { IconoInformacion } from "@/components/nav/iconos";

/**
 * Aviso "normativa en revisión" (Requisito 6) — tono informativo y
 * tranquilo, nunca lenguaje/color de error: borde sólido (nunca
 * discontinuo, ese lenguaje queda para "sin escribir"), token `revision-*`
 * propio. Server Component, sin interactividad más que el enlace de anclaje.
 */
export function AvisoRevision({ conFuente }: { conFuente: boolean }) {
  return (
    <div
      role="status"
      className="flex items-start gap-2 rounded-md border border-revision-texto/30 bg-revision-bg px-4 py-3 text-sm text-revision-texto"
    >
      <IconoInformacion aria-hidden className="mt-0.5 shrink-0" />
      <p>
        Esta normativa está pendiente de una revisión de vigencia — el
        contenido sigue disponible.
        {conFuente && (
          <>
            {" "}
            <a href="#fuente-normativa" className="underline underline-offset-2">
              Ver fuente
            </a>
            .
          </>
        )}
      </p>
    </div>
  );
}
