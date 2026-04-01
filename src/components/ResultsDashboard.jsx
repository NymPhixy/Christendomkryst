import { useMemo, useState } from "react";

function StatCard({ label, value }) {
  return (
    <article className="rounded-2xl border border-amber-100/20 bg-slate-900/45 p-4">
      <p className="text-xs uppercase tracking-[0.15em] text-amber-100/70">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-amber-50">{value}</p>
    </article>
  );
}

export function ResultsDashboard({ data, loading, error }) {
  const [quoteIndex, setQuoteIndex] = useState(0);

  const quotes = useMemo(() => data?.openQuotes || [], [data]);
  const activeQuote =
    quotes[quoteIndex] || "Nog geen open antwoorden beschikbaar.";

  const nextQuote = () => {
    if (quotes.length < 2) return;
    setQuoteIndex((current) => (current + 1) % quotes.length);
  };

  const previousQuote = () => {
    if (quotes.length < 2) return;
    setQuoteIndex((current) => (current - 1 + quotes.length) % quotes.length);
  };

  return (
    <section className="px-6 pb-20 pt-8 sm:px-10 lg:px-16" id="resultaten">
      <div className="mx-auto max-w-6xl rounded-3xl border border-amber-100/20 bg-slate-950/60 p-6 sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl text-amber-50">
              Live resultaten
            </h2>
            <p className="mt-2 text-sm text-amber-50/70">
              Inzichten op basis van binnengekomen reacties.
            </p>
          </div>
          <a
            href="/api/export-csv"
            className="rounded-full border border-amber-100/30 px-4 py-2 text-xs uppercase tracking-[0.15em] text-amber-50 hover:border-amber-100/70"
          >
            Export CSV
          </a>
        </div>

        {loading ? (
          <p className="mt-6 text-sm text-amber-50/70">Resultaten laden...</p>
        ) : null}
        {error ? (
          <p className="mt-6 rounded-xl border border-red-300/30 bg-red-500/10 p-3 text-sm text-red-100">
            {error}
          </p>
        ) : null}

        {!loading && !error && data ? (
          <>
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Totaal reacties" value={data.totalResponses} />
              <StatCard
                label="Donatie belangrijk"
                value={`${data.donationImportantPercent}%`}
              />
              <StatCard
                label="Vrij om geloof te tonen"
                value={`${data.faithFreedomPercent}%`}
              />
              <StatCard
                label="Populairst concept"
                value={data.topConcept || "-"}
              />
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              <article className="rounded-2xl border border-amber-100/20 bg-slate-900/45 p-4">
                <h3 className="text-sm font-semibold text-amber-50">
                  Top productvoorkeuren
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-amber-50/80">
                  {(data.topProducts || []).map((entry) => (
                    <li key={entry.name} className="flex justify-between gap-3">
                      <span>{entry.name}</span>
                      <span>{entry.count}</span>
                    </li>
                  ))}
                </ul>
              </article>

              <article className="rounded-2xl border border-amber-100/20 bg-slate-900/45 p-4">
                <h3 className="text-sm font-semibold text-amber-50">
                  Meest gekozen sfeerwoorden
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-amber-50/80">
                  {(data.topAtmosphere || []).map((entry) => (
                    <li key={entry.name} className="flex justify-between gap-3">
                      <span>{entry.name}</span>
                      <span>{entry.count}</span>
                    </li>
                  ))}
                </ul>
              </article>

              <article className="rounded-2xl border border-amber-100/20 bg-slate-900/45 p-4">
                <h3 className="text-sm font-semibold text-amber-50">
                  A/B conceptvergelijking
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-amber-50/80">
                  {(data.conceptBreakdown || []).map((entry) => (
                    <li key={entry.name} className="flex justify-between gap-3">
                      <span>{entry.name}</span>
                      <span>{entry.count}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </div>

            <article className="mt-6 rounded-2xl border border-amber-100/20 bg-slate-900/45 p-5">
              <h3 className="text-sm font-semibold text-amber-50">
                Open antwoorden
              </h3>
              <blockquote className="mt-3 text-sm italic leading-relaxed text-amber-50/80">
                "{activeQuote}"
              </blockquote>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={previousQuote}
                  className="rounded-full border border-amber-100/30 px-3 py-1.5 text-xs text-amber-50 hover:border-amber-100/70"
                >
                  Vorige
                </button>
                <button
                  type="button"
                  onClick={nextQuote}
                  className="rounded-full border border-amber-100/30 px-3 py-1.5 text-xs text-amber-50 hover:border-amber-100/70"
                >
                  Volgende
                </button>
              </div>
            </article>
          </>
        ) : null}
      </div>
    </section>
  );
}
