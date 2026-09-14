import { pgTable, text } from "drizzle-orm/pg-core";

// v1: una sola fila fija — ver CONSTITUTION.md, principio 6 (single-user ahora,
// arquitectura lista para multiusuario). No se hardcodea "un único usuario" en
// el resto del esquema: todo lo demás referencia usuario_id como si pudiera
// haber varios.
export const usuarios = pgTable("usuarios", {
  id: text("id").primaryKey(),
  nombre: text("nombre").notNull(),
});
