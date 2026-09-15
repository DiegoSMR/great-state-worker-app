"use client";

import { useEffect, useState } from "react";

/**
 * Ratio de scroll leído (0..1) — extraído de `ProgresoLectura` para que
 * también lo consuma `ProgresoLecturaLateral` (Requisito 4, ajuste tras
 * feedback de Diego) sin duplicar el cálculo. El cambio de pestaña en
 * `SeccionesConcepto` dispara un evento "resize" manual (no hay reflow real
 * al ocultar/mostrar secciones con `hidden`), que es justo lo que este hook
 * ya escucha — no hace falta ningún cableado adicional para que ambos
 * consumidores se recalculen al cambiar de pestaña.
 */
export function useProgresoLectura(): number {
  const [progreso, setProgreso] = useState(0);

  useEffect(() => {
    function calcular() {
      const alto = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = alto > 0 ? window.scrollY / alto : 0;
      setProgreso(Math.min(1, Math.max(0, ratio)));
    }
    calcular();
    window.addEventListener("scroll", calcular, { passive: true });
    window.addEventListener("resize", calcular);
    return () => {
      window.removeEventListener("scroll", calcular);
      window.removeEventListener("resize", calcular);
    };
  }, []);

  return progreso;
}
