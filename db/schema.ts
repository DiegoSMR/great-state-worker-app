import { pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";

// v1: una sola fila fija — ver CONSTITUTION.md, principio 6 (single-user ahora,
// arquitectura lista para multiusuario). No se hardcodea "un único usuario" en
// el resto del esquema: todo lo demás referencia usuario_id como si pudiera
// haber varios.
export const usuarios = pgTable("usuarios", {
  id: text("id").primaryKey(),
  nombre: text("nombre").notNull(),
});

// concepto_id referencia el id de content/temario.yaml como string, sin FK
// real — el temario vive como datos versionados en git, no en la base de
// datos (ver design.md de specs/001-seccion-estudio).
export const bookmark = pgTable(
  "bookmark",
  {
    usuarioId: text("usuario_id")
      .notNull()
      .references(() => usuarios.id),
    conceptoId: text("concepto_id").notNull(),
    creadoEn: timestamp("creado_en").notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.usuarioId, t.conceptoId] })]
);
