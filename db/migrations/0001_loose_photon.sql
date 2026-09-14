CREATE TABLE "bookmark" (
	"usuario_id" text NOT NULL,
	"concepto_id" text NOT NULL,
	"creado_en" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "bookmark_usuario_id_concepto_id_pk" PRIMARY KEY("usuario_id","concepto_id")
);
--> statement-breakpoint
ALTER TABLE "bookmark" ADD CONSTRAINT "bookmark_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;