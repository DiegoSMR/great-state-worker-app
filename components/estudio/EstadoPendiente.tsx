import { IconoPendiente } from "@/components/nav/iconos";

/**
 * Estado "contenido pendiente de redactar" (Requisito 5) — extraído del
 * antiguo inline de app/estudio/tema/[conceptoId]/page.tsx, retocado con
 * tokens. Borde discontinuo conservado deliberadamente (lenguaje ya
 * validado): comunica "hueco conocido", nunca error — icono neutro, nunca
 * un triángulo de alerta.
 */
export function EstadoPendiente() {
  return (
    <div className="mt-10 flex flex-col items-center gap-2 rounded-md border border-dashed border-borde bg-bg-secundario px-4 py-10 text-center">
      <IconoPendiente aria-hidden width="1.6em" height="1.6em" className="text-texto-secundario" />
      <p className="font-medium text-texto-primario">Contenido pendiente de redactar</p>
      <p className="text-sm text-texto-secundario">
        Este tema todavía no tiene material de estudio en la app.
      </p>
    </div>
  );
}
