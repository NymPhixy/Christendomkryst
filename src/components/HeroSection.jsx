import { Star } from "lucide-react";

export function HeroSection() {
  return (
    <section
      className="relative overflow-hidden px-6 pb-20 pt-12 sm:px-10 lg:px-16 lg:pt-16"
      id="top"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-8 top-16 h-40 w-40 rounded-full bg-amber-200/20 blur-3xl" />
        <div className="absolute right-0 top-8 h-56 w-56 rounded-full bg-yellow-100/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-52 w-52 rounded-full bg-orange-200/15 blur-3xl" />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-2">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-amber-200/30 bg-amber-100/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-amber-100">
            <Star className="h-3.5 w-3.5" />
            Kerstonderzoek 2026
          </p>
          <h1 className="mt-5 font-display text-4xl text-amber-50 sm:text-5xl lg:text-6xl">
            Kryst
          </h1>
          <p className="mt-3 text-lg text-amber-100/90">
            Kerstverlichting met betekenis
          </p>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-amber-50/85 sm:text-base">
            Voor een studieproject onderzoeken wij hoe christelijke consumenten
            kerstverlichting en decoratie met betekenis ervaren. Met deze
            enquete willen we beter begrijpen welke stijl, boodschap en beleving
            aansluiten bij de doelgroep.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#enquete"
              className="rounded-full bg-linear-to-r from-amber-300 to-yellow-100 px-7 py-3 text-sm font-semibold text-slate-900 shadow-[0_0_30px_rgba(255,216,118,0.35)] transition hover:brightness-110"
            >
              Start enquete
            </a>
            <span className="text-xs text-amber-50/70">
              Uw antwoorden worden anoniem verwerkt • 2-3 minuten
            </span>
          </div>
        </div>

        <div className="relative">
          <div className="relative mx-auto aspect-4/5 w-full max-w-md overflow-hidden rounded-3xl border border-amber-100/20 bg-[radial-gradient(circle_at_20%_20%,rgba(255,238,176,0.3),transparent_50%),linear-gradient(145deg,rgba(25,30,54,0.85),rgba(8,11,20,0.92))] p-6 shadow-2xl shadow-black/40">
            <div className="h-full rounded-2xl border border-amber-100/20 bg-[url('https://images.unsplash.com/photo-1512389098783-66b81f86e199?auto=format&fit=crop&w=900&q=80')] bg-cover bg-center" />
            <div className="absolute inset-0 rounded-3xl bg-linear-to-t from-slate-950/45 via-transparent to-amber-100/10" />
          </div>
        </div>
      </div>
    </section>
  );
}
