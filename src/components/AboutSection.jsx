import { Church, HeartHandshake, Sparkles, SunMedium } from "lucide-react";

const cards = [
  {
    title: "Betekenis",
    text: "Verlichting en decoratie die verwijzen naar geloof, hoop en liefde.",
    icon: Church,
  },
  {
    title: "Sfeer",
    text: "Rustige, warme kerstbeleving met licht als centraal symbool.",
    icon: Sparkles,
  },
  {
    title: "Sociale impact",
    text: "Een deel van de winst gaat terug naar christelijke organisaties.",
    icon: HeartHandshake,
  },
  {
    title: "Gemeenschap",
    text: "Een platform dat herkenning en verbinding binnen de doelgroep stimuleert.",
    icon: SunMedium,
  },
];

export function AboutSection() {
  return (
    <section className="px-6 py-16 sm:px-10 lg:px-16" id="over-kryst">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display text-3xl text-amber-50 sm:text-4xl">
          Over Kryst
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-amber-50/80 sm:text-base">
          Kryst ontwikkelt betekenisvolle kerstverlichting en decoratie voor
          mensen die naast stijl ook inhoud zoeken. De focus ligt op geloof,
          sfeer en maatschappelijke impact: warm in uitstraling, helder in
          missie.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <article
                key={card.title}
                className="rounded-2xl border border-amber-100/20 bg-slate-900/45 p-5 shadow-[0_0_24px_rgba(255,214,120,0.08)] transition hover:-translate-y-0.5 hover:border-amber-100/40"
              >
                <Icon className="h-5 w-5 text-amber-200" />
                <h3 className="mt-3 text-lg font-semibold text-amber-50">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-amber-50/75">
                  {card.text}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
