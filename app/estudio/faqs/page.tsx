import { getFaqComunes, getFaqEspecificas } from "@/lib/perfil-oposicion";
import { getOposicionesEnAlcance } from "@/lib/temario";
import { PreguntaFaqDetails } from "@/components/estudio/PreguntaFaqDetails";

/**
 * Sección de FAQs propia y navegable (Requisito 2.3) — agrupa las preguntas
 * comunes a las 4 oposiciones en alcance más las específicas de cada una, sin
 * duplicar ninguna pregunta común dentro de una pestaña de oposición
 * (Requisito 2.4). Nav local pegajosa + `<details>` nativo, cero JS nuevo
 * (specs/018-perfil-oposicion/design.md, decisión de disenador-maquetador).
 */
export default function FaqsPage() {
  const oposiciones = getOposicionesEnAlcance();
  const faqComunes = getFaqComunes();

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-texto-primario">Preguntas frecuentes</h1>
      <p className="mt-2 text-texto-secundario">
        Dudas comunes a las oposiciones en alcance, más las propias de cada proceso selectivo.
      </p>

      <nav
        aria-label="Ir a una sección de FAQs"
        className="sticky top-0 z-10 mt-6 flex flex-wrap gap-2 border-b border-borde bg-bg-primario py-3"
      >
        <a
          href="#faq-comunes"
          className="rounded-md px-3 py-1.5 text-sm text-texto-secundario hover:bg-bg-secundario hover:text-texto-primario"
        >
          Comunes
        </a>
        {oposiciones.map((o) => (
          <a
            key={o.id}
            href={`#faq-${o.id}`}
            className="rounded-md px-3 py-1.5 text-sm text-texto-secundario hover:bg-bg-secundario hover:text-texto-primario"
          >
            {o.nombre} ({o.organismo})
          </a>
        ))}
      </nav>

      <section id="faq-comunes" aria-labelledby="faq-comunes-titulo" className="mt-8 scroll-mt-16">
        <h2 id="faq-comunes-titulo" className="text-lg font-medium text-texto-primario">
          Comunes
        </h2>
        <p className="mt-1 text-sm text-texto-secundario">
          Aplican por igual a las oposiciones en alcance.
        </p>
        <div className="mt-3 space-y-2">
          {faqComunes.map((faq) => (
            <PreguntaFaqDetails key={faq.id} item={faq} />
          ))}
        </div>
      </section>

      {oposiciones.map((o) => {
        const especificas = getFaqEspecificas(o.id);
        return (
          <section key={o.id} id={`faq-${o.id}`} aria-labelledby={`faq-${o.id}-titulo`} className="mt-8 scroll-mt-16">
            <h2 id={`faq-${o.id}-titulo`} className="text-lg font-medium text-texto-primario">
              {o.nombre} ({o.organismo})
            </h2>
            {especificas.length === 0 ? (
              <p className="mt-1 text-sm text-texto-secundario">
                Todavía no hay preguntas específicas redactadas para esta oposición.
              </p>
            ) : (
              <div className="mt-3 space-y-2">
                {especificas.map((faq) => (
                  <PreguntaFaqDetails key={faq.id} item={faq} />
                ))}
              </div>
            )}
          </section>
        );
      })}
    </main>
  );
}
