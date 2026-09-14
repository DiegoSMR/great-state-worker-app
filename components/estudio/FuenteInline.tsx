import { extraerEnlaceFuente } from "@/lib/contenido";

/**
 * Fuente + fecha de un DatoOficial/Atribucion confirmado, como nota corta
 * bajo el valor al que atribuye procedencia (specs/018-perfil-oposicion) —
 * mismo criterio de trazabilidad que FuenteNormativa, en formato compacto
 * para usarse junto a un dato suelto en vez de en un bloque `<details>`.
 */
export function FuenteInline({ fuente, fechaConsulta }: { fuente: string; fechaConsulta: string }) {
  const enlace = extraerEnlaceFuente(fuente);
  return (
    <span className="mt-0.5 block text-xs text-texto-secundario">
      Fuente:{" "}
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
      )}{" "}
      ({fechaConsulta})
    </span>
  );
}
