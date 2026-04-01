export function FlyerPreview() {
  return (
    <section className="px-6 py-8 sm:px-10 lg:px-16" id="flyer">
      <div className="mx-auto max-w-6xl rounded-3xl border border-amber-100/20 bg-slate-950/60 p-6 sm:p-8">
        <h2 className="font-display text-2xl text-amber-50 sm:text-3xl">
          Flyer preview met QR
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-amber-50/75">
          Gebruik dit mini-voorbeeld voor drukwerk. Plaats je echte QR-code over
          de placeholder en link naar deze pagina.
        </p>

        <div className="mt-6 grid gap-5 md:grid-cols-[1.1fr_220px]">
          <article className="rounded-2xl border border-amber-100/20 bg-[linear-gradient(145deg,rgba(35,43,76,0.85),rgba(16,20,35,0.95))] p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-amber-200/90">
              Kryst winteronderzoek
            </p>
            <h3 className="mt-2 font-display text-3xl text-amber-50">
              Kerst met betekenis
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-amber-50/80">
              Deel uw mening over sfeer, geloof en kerstdecoratie. Uw input
              helpt ons om producten met inhoud en impact te ontwikkelen.
            </p>
            <p className="mt-4 text-xs text-amber-100/75">
              Anoniem • 2-3 minuten • direct via mobiel
            </p>
          </article>

          <aside className="flex items-center justify-center rounded-2xl border border-dashed border-amber-100/35 bg-slate-900/70 p-4">
            <div className="h-40 w-40 rounded-xl border border-amber-100/50 bg-[linear-gradient(45deg,#111827_25%,#f9e7b1_25%,#f9e7b1_50%,#111827_50%,#111827_75%,#f9e7b1_75%)] bg-size-[20px_20px]" />
          </aside>
        </div>
      </div>
    </section>
  );
}
