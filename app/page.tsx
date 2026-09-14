import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex max-w-3xl flex-1 flex-col items-start justify-center px-4 py-10">
      <h1 className="text-2xl font-semibold text-texto-primario">Great State Worker</h1>
      <p className="mt-2 text-texto-secundario">
        App de estudio para preparar oposiciones.
      </p>
      <Link
        href="/estudio"
        className="mt-8 rounded-md border border-borde px-4 py-3 font-medium text-texto-primario hover:border-texto-secundario"
      >
        Ir a Estudio →
      </Link>
    </main>
  );
}
