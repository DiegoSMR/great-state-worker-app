"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db/client";
import { bookmark } from "@/db/schema";
import { USUARIO_ID } from "@/lib/usuario";

export async function isBookmarked(conceptoId: string): Promise<boolean> {
  const fila = await db.query.bookmark.findFirst({
    where: and(eq(bookmark.usuarioId, USUARIO_ID), eq(bookmark.conceptoId, conceptoId)),
  });
  return fila !== undefined;
}

export async function getBookmarks(): Promise<{ conceptoId: string; creadoEn: Date }[]> {
  const filas = await db.query.bookmark.findMany({
    where: eq(bookmark.usuarioId, USUARIO_ID),
  });
  return filas.map((f) => ({ conceptoId: f.conceptoId, creadoEn: f.creadoEn }));
}

export async function toggleBookmark(conceptoId: string): Promise<void> {
  const yaMarcado = await isBookmarked(conceptoId);

  if (yaMarcado) {
    await db
      .delete(bookmark)
      .where(and(eq(bookmark.usuarioId, USUARIO_ID), eq(bookmark.conceptoId, conceptoId)));
  } else {
    await db.insert(bookmark).values({ usuarioId: USUARIO_ID, conceptoId }).onConflictDoNothing();
  }

  revalidatePath(`/estudio/tema/${conceptoId}`);
  revalidatePath("/estudio/marcadores");
}
