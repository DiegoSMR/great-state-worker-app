import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex max-w-3xl flex-1 flex-col items-start justify-center px-4 py-10">
      <h1 className="text-2xl font-semibold">Great State Worker</h1>
      <p className="mt-2 text-neutral-600">
        App de estudio para preparar oposiciones.
      </p>
      <Link
        href="/estudio"
        className="mt-8 rounded-md border border-neutral-200 px-4 py-3 font-medium hover:border-neutral-400"
      >
        Ir a Estudio →
      </Link>
    </main>
  );
}
