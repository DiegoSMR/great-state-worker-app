import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import type { Options as SanitizeOptions } from "rehype-sanitize";

/**
 * Texto enriquecido de autoría (notas-de-diseno.md §14): `<u>` para
 * subrayado de énfasis y `<mark class="ink-...">` para resaltado con fondo,
 * embebidos como HTML crudo dentro de content/estudio/*.md. `react-markdown`
 * limpia el HTML embebido por defecto, así que hace falta `rehype-raw` para
 * que se parseé.
 *
 * Decisión de implementación (no bloqueante según la propia spec, pero
 * documentada aquí): en vez de aceptar cualquier HTML crudo, se restringe
 * con `rehype-sanitize` a la lista cerrada de la spec — el esquema por
 * defecto de `rehype-sanitize` (que ya cubre los elementos normales de
 * markdown: p, listas, tablas, etc. — GFM incluido) más `u` y `mark`, y en
 * `mark` solo se admite `class` con uno de los 6 valores `ink-*` de la
 * tabla de §14. content/estudio/*.md solo lo escriben nuestros propios
 * agentes (no hay superficie de XSS real, la propia spec lo señala), así
 * que esto no es por seguridad — es para que un typo del agente que genera
 * el contenido (una clase mal escrita, una etiqueta que no toca) no cuele
 * HTML/clases arbitrarias que rompan el layout en silencio; con este
 * esquema, cualquier cosa fuera de la lista simplemente no se renderiza.
 */
const CLASES_INK_PERMITIDAS = [
  "ink-importante",
  "ink-ejemplo",
  "ink-excepcion",
  "ink-mnemonico",
  "ink-atencion",
  "ink-info",
] as const;

const esquemaTextoEnriquecido: SanitizeOptions = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames ?? []), "u", "mark"],
  attributes: {
    ...defaultSchema.attributes,
    mark: [["className", ...CLASES_INK_PERMITIDAS]],
  },
};

/**
 * Wrapper de ReactMarkdown con la escala tipográfica de
 * notas-de-diseno.md §2 (h1/h2/h3 vía modificadores `prose-h*` en vez de
 * pelear con la especificidad del plugin de tipografía) y los tokens de
 * color ya enchufados a las variables `--tw-prose-*` en globals.css — así
 * que no hace falta `prose-invert`/`dark:` (que dependerían de
 * prefers-color-scheme, no de nuestro `data-theme`).
 */
export function Markdown({ texto, compacto = false }: { texto: string; compacto?: boolean }) {
  return (
    <div
      className={
        compacto
          ? "prose prose-sm max-w-none prose-h1:text-[1.75rem] prose-h2:text-[1.375rem] prose-h3:text-[1.125rem] prose-headings:font-semibold"
          : "prose max-w-none prose-h1:text-[1.75rem] prose-h2:text-[1.375rem] prose-h3:text-[1.125rem] prose-headings:font-semibold"
      }
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, [rehypeSanitize, esquemaTextoEnriquecido]]}
      >
        {texto || "_(vacío)_"}
      </ReactMarkdown>
    </div>
  );
}
