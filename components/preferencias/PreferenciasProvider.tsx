"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import { guardarPreferencias } from "@/app/_actions/preferencias";
import type { NavDensidad, Preferencias, Tema, TamanoLetra } from "@/lib/preferencias";

type PreferenciasContextValue = {
  tema: Tema;
  navDensidad: NavDensidad | null;
  tamanoLetra: TamanoLetra;
  /** Estado de sesión, no persistente — se reinicia a false en cada carga (ver design.md). */
  concentracion: boolean;
  setTema: (tema: Tema) => void;
  setNavDensidad: (navDensidad: NavDensidad | null) => void;
  setTamanoLetra: (tamanoLetra: TamanoLetra) => void;
  toggleConcentracion: () => void;
};

const PreferenciasContext = createContext<PreferenciasContextValue | null>(null);

/**
 * Context Client Component que expone las preferencias de interfaz al resto
 * de la app. Se inicializa con el valor ya resuelto server-side (leído de la
 * cookie en app/layout.tsx) — el cliente nunca "adivina" el estado inicial,
 * así que no hay flash entre lo que pintó el servidor y la primera
 * hidratación (specs/003-sistema-de-diseno/design.md, decisión de anti-flash).
 */
export function PreferenciasProvider({
  preferenciasIniciales,
  children,
}: {
  preferenciasIniciales: Preferencias;
  children: ReactNode;
}) {
  const [tema, setTemaState] = useState<Tema>(preferenciasIniciales.tema);
  const [navDensidad, setNavDensidadState] = useState<NavDensidad | null>(
    preferenciasIniciales.navDensidad
  );
  const [tamanoLetra, setTamanoLetraState] = useState<TamanoLetra>(
    preferenciasIniciales.lectura.tamanoLetra
  );
  const [concentracion, setConcentracion] = useState(false);
  const [, startTransition] = useTransition();

  // Aplicación instantánea vía atributos en <html> — actualización visual
  // inmediata por CSS, sin esperar respuesta de red (Requisito 3.2, 8.2).
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", tema);
  }, [tema]);

  useEffect(() => {
    document.documentElement.setAttribute("data-tamano-letra", tamanoLetra);
  }, [tamanoLetra]);

  function persistir(patch: Partial<Preferencias>) {
    startTransition(() => {
      void guardarPreferencias(patch);
    });
  }

  function setTema(nuevoTema: Tema) {
    setTemaState(nuevoTema);
    persistir({ tema: nuevoTema });
  }

  function setNavDensidad(nuevaDensidad: NavDensidad | null) {
    setNavDensidadState(nuevaDensidad);
    persistir({ navDensidad: nuevaDensidad });
  }

  function setTamanoLetra(nuevoTamano: TamanoLetra) {
    setTamanoLetraState(nuevoTamano);
    persistir({ lectura: { tamanoLetra: nuevoTamano } });
  }

  function toggleConcentracion() {
    setConcentracion((activo) => !activo);
  }

  return (
    <PreferenciasContext.Provider
      value={{
        tema,
        navDensidad,
        tamanoLetra,
        concentracion,
        setTema,
        setNavDensidad,
        setTamanoLetra,
        toggleConcentracion,
      }}
    >
      {children}
    </PreferenciasContext.Provider>
  );
}

export function usePreferencias(): PreferenciasContextValue {
  const contexto = useContext(PreferenciasContext);
  if (!contexto) {
    throw new Error("usePreferencias debe usarse dentro de <PreferenciasProvider>");
  }
  return contexto;
}
