"use server";

import { cookies } from "next/headers";
import {
  PREFERENCIAS_COOKIE,
  parsearPreferencias,
  type Preferencias,
  type PreferenciasPatch,
} from "@/lib/preferencias";

const UN_ANO_EN_SEGUNDOS = 60 * 60 * 24 * 365;

/**
 * Fusiona `patch` sobre las preferencias actuales y las persiste en la
 * cookie `gsw_prefs`. No hace `revalidatePath` — el cambio ya se refleja al
 * instante en el cliente (ver PreferenciasProvider), esto solo persiste de
 * cara al próximo request (specs/003-sistema-de-diseno/design.md).
 */
export async function guardarPreferencias(patch: PreferenciasPatch): Promise<void> {
  const store = await cookies();
  const actuales = parsearPreferencias(store.get(PREFERENCIAS_COOKIE)?.value);

  const nuevas: Preferencias = {
    ...actuales,
    ...patch,
    lectura: { ...actuales.lectura, ...(patch.lectura ?? {}) },
  };

  store.set(PREFERENCIAS_COOKIE, JSON.stringify(nuevas), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: UN_ANO_EN_SEGUNDOS,
  });
}
