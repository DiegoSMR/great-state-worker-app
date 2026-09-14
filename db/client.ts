import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Inicialización perezosa: Next.js importa este módulo al recopilar datos de
// página en build (antes de que las env vars de runtime estén disponibles).
// Si `neon()` se llamara al importar el módulo, el build fallaría aunque la
// ruta nunca se ejecute en build time. Ver Vercel deploy fallido en el PR de
// specs/001-seccion-estudio.
let dbInstancia: ReturnType<typeof drizzle<typeof schema>> | undefined;

export function getDb() {
  if (!dbInstancia) {
    if (!process.env.DATABASE_URL) {
      throw new Error("Falta DATABASE_URL — ver .env.example");
    }
    const sql = neon(process.env.DATABASE_URL);
    dbInstancia = drizzle(sql, { schema });
  }
  return dbInstancia;
}
