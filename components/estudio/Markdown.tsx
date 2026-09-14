import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{texto || "_(vacío)_"}</ReactMarkdown>
    </div>
  );
}
