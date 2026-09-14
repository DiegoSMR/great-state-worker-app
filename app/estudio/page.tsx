import Link from "next/link";
import { getOposicionesEnAlcance } from "@/lib/temario";

export default function EstudioPage() {
  const oposiciones = getOposicionesEnAlcance();

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Estudio</h1>
      <p className="mt-2 text-neutral-600">
        Elige cómo quieres navegar el material.
      </p>

      <div className="mt-8 grid gap-8 sm:grid-cols-2">
        <section>
          <h2 className="text-lg font-medium">Por oposición</h2>
          <p className="mt-1 text-sm text-neutral-600">
            El temario oficial completo de un proceso concreto, en su numeración.
          </p>
          <ul className="mt-4 space-y-2">
            {oposiciones.map((o) => (
              <li key={o.id}>
                <Link
                  href={`/estudio/oposicion/${o.id}`}
                  className="block rounded-md border border-neutral-200 px-4 py-3 hover:border-neutral-400"
                >
                  <span className="font-medium">{o.nombre}</span>
                  <span className="block text-sm text-neutral-600">
                    {o.organismo} · {o.subgrupo}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-medium">Por tema</h2>
          <p className="mt-1 text-sm text-neutral-600">
            El catálogo de conceptos, sin repetir lo que comparten varias
            oposiciones.
          </p>
          <Link
            href="/estudio/tema"
            className="mt-4 block rounded-md border border-neutral-200 px-4 py-3 hover:border-neutral-400"
          >
            Ver catálogo de temas
          </Link>
        </section>
      </div>
    </main>
  );
}
