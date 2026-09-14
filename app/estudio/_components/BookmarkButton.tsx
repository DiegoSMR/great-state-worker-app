import { toggleBookmark } from "../actions";

export function BookmarkButton({
  conceptoId,
  marcado,
}: {
  conceptoId: string;
  marcado: boolean;
}) {
  return (
    <form action={toggleBookmark.bind(null, conceptoId)}>
      <button
        type="submit"
        className={
          marcado
            ? "rounded-md border border-bookmark-texto/40 bg-bookmark-bg px-3 py-1.5 text-sm font-medium text-bookmark-texto hover:bg-bookmark-bg/80"
            : "rounded-md border border-borde px-3 py-1.5 text-sm font-medium text-texto-secundario hover:border-texto-secundario hover:text-texto-primario"
        }
      >
        {marcado ? "★ Marcado" : "☆ Marcar"}
      </button>
    </form>
  );
}
