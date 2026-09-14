"use client";

import { useEffect, useState } from "react";

/**
 * Barra fina de progreso de lectura (Requisito 10.2) — color neutro
 * (`--borde`), nunca uno de los colores de estado, para no confundirse con
 * núcleo común/bookmark/revisión (Requisito 13). Puramente informativa:
 * `aria-hidden`, no lleva foco.
 */
export function ProgresoLectura() {
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

  return (
    <div aria-hidden="true" className="h-[3px] w-full bg-bg-secundario">
      <div
        className="h-full bg-borde motion-safe:transition-[width] motion-safe:duration-150"
        style={{ width: `${progreso * 100}%` }}
      />
    </div>
  );
}
