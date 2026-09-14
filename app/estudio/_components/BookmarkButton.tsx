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
            ? "rounded-md border border-amber-400 bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-800 hover:bg-amber-100"
            : "rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:border-neutral-400"
        }
      >
        {marcado ? "★ Marcado" : "☆ Marcar"}
      </button>
    </form>
  );
}
