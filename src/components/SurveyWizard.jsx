import { useMemo, useState } from "react";
import { submitSurvey } from "../lib/api";

const initialState = {
  ageRange: "",
  gender: "",
  activeBeliever: "",
  faithImportance: 3,
  household: "",
  buyMotivation: "",
  desiredAtmosphere: [],
  appealElements: [],
  placement: "",
  showFaithFreedom: 3,
  buyToExpressFaith: 3,
  messageWanted: "",
  barriers: "",
  productTypes: [],
  stylePreference: "",
  conceptChoice: "",
  conceptReason: "",
  transparencyImportance: 3,
  donationPositive: "",
  trustKryst: 3,
  trustSignals: "",
  buyIntent: 3,
  extraRemarks: "",
};

const atmosphereOptions = [
  "Warm en huiselijk",
  "Rustig en ingetogen",
  "Feestelijk en licht",
  "Traditioneel",
  "Modern clean",
];
const elementOptions = [
  "Licht",
  "Religieuze symbolen",
  "Natuur",
  "Warmte",
  "Modern",
  "Klassiek",
];
const productOptions = [
  "Raamdecoratie",
  "Tuinverlichting",
  "Sterren",
  "Kerststal",
  "Lichtfiguren",
];

const stepMeta = [
  { key: "A", title: "Basis en doelgroep" },
  { key: "B", title: "Kerstbeleving" },
  { key: "C", title: "Geloof en zichtbaarheid" },
  { key: "D", title: "Product en voorkeur" },
  { key: "E", title: "Kryst als platform" },
  { key: "F", title: "Afronding" },
];

function toggleArrayValue(values, value) {
  return values.includes(value)
    ? values.filter((entry) => entry !== value)
    : [...values, value];
}

function Likert({ value, onChange, label }) {
  return (
    <div>
      <label className="mb-2 block text-sm text-amber-50/85">{label}</label>
      <div className="flex flex-wrap gap-2">
        {[1, 2, 3, 4, 5].map((score) => (
          <button
            key={score}
            type="button"
            onClick={() => onChange(score)}
            className={`h-9 w-9 rounded-full border text-sm transition ${
              score === value
                ? "border-amber-200 bg-amber-200 text-slate-950"
                : "border-amber-50/25 bg-slate-900/60 text-amber-50 hover:border-amber-100/60"
            }`}
          >
            {score}
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs text-amber-50/55">1 = laag, 5 = hoog</p>
    </div>
  );
}

function StepTitle({ step }) {
  return (
    <header className="mb-6">
      <p className="text-xs uppercase tracking-[0.2em] text-amber-200/90">
        Blok {stepMeta[step].key}
      </p>
      <h3 className="mt-2 text-2xl font-semibold text-amber-50">
        {stepMeta[step].title}
      </h3>
    </header>
  );
}

function ConceptCard({ selected, title, subtitle, onClick, variant }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border p-4 text-left transition ${
        selected
          ? "border-amber-100 bg-amber-100/10"
          : "border-amber-50/20 bg-slate-900/45 hover:border-amber-100/45"
      }`}
    >
      <div
        className={`h-32 rounded-xl border border-amber-100/20 ${
          variant === "A"
            ? "bg-[radial-gradient(circle_at_20%_15%,rgba(254,240,138,0.65),transparent_40%),linear-gradient(135deg,#1f2948,#101827)]"
            : "bg-[radial-gradient(circle_at_80%_15%,rgba(254,215,170,0.6),transparent_40%),linear-gradient(135deg,#2f3746,#151923)]"
        }`}
      />
      <h4 className="mt-3 text-sm font-semibold text-amber-50">{title}</h4>
      <p className="text-xs text-amber-50/70">{subtitle}</p>
    </button>
  );
}

export function SurveyWizard({ onSubmitted }) {
  const [formData, setFormData] = useState(initialState);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const progress = useMemo(() => ((step + 1) / stepMeta.length) * 100, [step]);

  function updateField(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function isCurrentStepValid() {
    if (step === 0)
      return (
        formData.ageRange &&
        formData.gender &&
        formData.activeBeliever &&
        formData.household
      );
    if (step === 1)
      return (
        formData.buyMotivation &&
        formData.desiredAtmosphere.length > 0 &&
        formData.placement
      );
    if (step === 2) return formData.messageWanted.trim().length > 0;
    if (step === 3)
      return (
        formData.productTypes.length > 0 &&
        formData.stylePreference &&
        formData.conceptChoice
      );
    if (step === 4)
      return (
        formData.donationPositive && formData.trustSignals.trim().length > 0
      );
    return true;
  }

  function nextStep() {
    if (!isCurrentStepValid()) {
      setError("Vul eerst de belangrijkste vragen in voordat u doorgaat.");
      return;
    }
    setError("");
    setStep((current) => Math.min(current + 1, stepMeta.length - 1));
  }

  function previousStep() {
    setError("");
    setStep((current) => Math.max(current - 1, 0));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await submitSurvey(formData);
      setSuccessMessage("Dank u wel. Uw antwoorden zijn veilig ontvangen.");
      setFormData(initialState);
      setStep(0);
      onSubmitted();
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="enquete" className="px-6 py-16 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-4xl rounded-3xl border border-amber-100/20 bg-slate-950/65 p-6 shadow-[0_0_40px_rgba(255,214,120,0.12)] sm:p-8">
        <h2 className="font-display text-3xl text-amber-50">Enquete Kryst</h2>
        <p className="mt-2 text-sm text-amber-50/75">
          Helpt u ons met 2-3 minuten inzicht in sfeer, geloof en voorkeuren.
        </p>

        <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-slate-900/80">
          <div
            className="h-full rounded-full bg-linear-to-r from-amber-300 to-yellow-100 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-right text-xs text-amber-50/65">
          Stap {step + 1} van {stepMeta.length}
        </p>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          {step === 0 && (
            <div className="space-y-5">
              <StepTitle step={step} />
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="field">
                  Leeftijd
                  <select
                    value={formData.ageRange}
                    onChange={(event) =>
                      updateField("ageRange", event.target.value)
                    }
                  >
                    <option value="">Kies</option>
                    <option>18-24</option>
                    <option>25-34</option>
                    <option>35-44</option>
                    <option>45-54</option>
                    <option>55+</option>
                  </select>
                </label>

                <label className="field">
                  Geslacht
                  <select
                    value={formData.gender}
                    onChange={(event) =>
                      updateField("gender", event.target.value)
                    }
                  >
                    <option value="">Kies</option>
                    <option>Vrouw</option>
                    <option>Man</option>
                    <option>Non-binair</option>
                    <option>Liever niet zeggen</option>
                  </select>
                </label>

                <label className="field">
                  Actief gelovig
                  <select
                    value={formData.activeBeliever}
                    onChange={(event) =>
                      updateField("activeBeliever", event.target.value)
                    }
                  >
                    <option value="">Kies</option>
                    <option>Ja</option>
                    <option>Nee</option>
                    <option>Twijfel</option>
                  </select>
                </label>

                <label className="field">
                  Woonsituatie
                  <select
                    value={formData.household}
                    onChange={(event) =>
                      updateField("household", event.target.value)
                    }
                  >
                    <option value="">Kies</option>
                    <option>Alleen</option>
                    <option>Met partner</option>
                    <option>Gezin</option>
                    <option>Anders</option>
                  </select>
                </label>
              </div>
              <Likert
                value={formData.faithImportance}
                onChange={(value) => updateField("faithImportance", value)}
                label="Hoe belangrijk is geloof in uw dagelijks leven?"
              />
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <StepTitle step={step} />
              <label className="field">
                Wat motiveert u het meest om kerstdecoratie te kopen?
                <select
                  value={formData.buyMotivation}
                  onChange={(event) =>
                    updateField("buyMotivation", event.target.value)
                  }
                >
                  <option value="">Kies</option>
                  <option>Sfeer in huis</option>
                  <option>Gezin en traditie</option>
                  <option>Geloof en betekenis</option>
                  <option>Esthetiek/design</option>
                  <option>Cadeau of delen met anderen</option>
                </select>
              </label>

              <fieldset>
                <legend className="text-sm text-amber-50/85">
                  Welke sfeer zoekt u tijdens kerst?
                </legend>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {atmosphereOptions.map((option) => (
                    <label key={option} className="checkbox-pill">
                      <input
                        type="checkbox"
                        checked={formData.desiredAtmosphere.includes(option)}
                        onChange={() =>
                          updateField(
                            "desiredAtmosphere",
                            toggleArrayValue(
                              formData.desiredAtmosphere,
                              option,
                            ),
                          )
                        }
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className="text-sm text-amber-50/85">
                  Welke elementen spreken u aan?
                </legend>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  {elementOptions.map((option) => (
                    <label key={option} className="checkbox-pill">
                      <input
                        type="checkbox"
                        checked={formData.appealElements.includes(option)}
                        onChange={() =>
                          updateField(
                            "appealElements",
                            toggleArrayValue(formData.appealElements, option),
                          )
                        }
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <label className="field">
                Plaatst u decoratie vooral binnen, buiten of beide?
                <select
                  value={formData.placement}
                  onChange={(event) =>
                    updateField("placement", event.target.value)
                  }
                >
                  <option value="">Kies</option>
                  <option>Binnen</option>
                  <option>Buiten</option>
                  <option>Beide</option>
                </select>
              </label>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <StepTitle step={step} />
              <Likert
                value={formData.showFaithFreedom}
                onChange={(value) => updateField("showFaithFreedom", value)}
                label="Voelt u zich vrij om uw geloof te tonen via decoratie?"
              />
              <Likert
                value={formData.buyToExpressFaith}
                onChange={(value) => updateField("buyToExpressFaith", value)}
                label="Koopt u decoratie bewust om geloof uit te dragen?"
              />

              <label className="field">
                Welke boodschap wilt u uitstralen met uw kerstdecoratie?
                <textarea
                  value={formData.messageWanted}
                  onChange={(event) =>
                    updateField("messageWanted", event.target.value)
                  }
                  rows={3}
                  placeholder="Bijvoorbeeld hoop, vrede, verbondenheid..."
                />
              </label>

              <label className="field">
                Welke belemmeringen ervaart u hierbij?
                <textarea
                  value={formData.barriers}
                  onChange={(event) =>
                    updateField("barriers", event.target.value)
                  }
                  rows={3}
                  placeholder="Bijvoorbeeld prijs, reacties van omgeving, beperkt aanbod..."
                />
              </label>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <StepTitle step={step} />
              <fieldset>
                <legend className="text-sm text-amber-50/85">
                  Welke productsoorten spreken u aan?
                </legend>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {productOptions.map((option) => (
                    <label key={option} className="checkbox-pill">
                      <input
                        type="checkbox"
                        checked={formData.productTypes.includes(option)}
                        onChange={() =>
                          updateField(
                            "productTypes",
                            toggleArrayValue(formData.productTypes, option),
                          )
                        }
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <label className="field">
                Welke stijl past het best?
                <select
                  value={formData.stylePreference}
                  onChange={(event) =>
                    updateField("stylePreference", event.target.value)
                  }
                >
                  <option value="">Kies</option>
                  <option>Sfeervol</option>
                  <option>Rustig</option>
                  <option>Uitgesproken christelijk</option>
                  <option>Modern</option>
                  <option>Minimalistisch</option>
                </select>
              </label>

              <div>
                <p className="text-sm text-amber-50/85">
                  Welk visueel concept spreekt u het meest aan?
                </p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <ConceptCard
                    selected={formData.conceptChoice === "A"}
                    title="Concept A - Warm licht"
                    subtitle="Huiselijk, zacht en contemplatief"
                    variant="A"
                    onClick={() => updateField("conceptChoice", "A")}
                  />
                  <ConceptCard
                    selected={formData.conceptChoice === "B"}
                    title="Concept B - Rustig modern"
                    subtitle="Helder, strak en symbolisch"
                    variant="B"
                    onClick={() => updateField("conceptChoice", "B")}
                  />
                </div>
              </div>

              <label className="field">
                Waarom kiest u dit concept?
                <textarea
                  value={formData.conceptReason}
                  onChange={(event) =>
                    updateField("conceptReason", event.target.value)
                  }
                  rows={3}
                />
              </label>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5">
              <StepTitle step={step} />
              <Likert
                value={formData.transparencyImportance}
                onChange={(value) =>
                  updateField("transparencyImportance", value)
                }
                label="Hoe belangrijk is transparantie over missie en doelen?"
              />

              <label className="field">
                Geeft winst doneren aan christelijke organisaties een positiever
                gevoel?
                <select
                  value={formData.donationPositive}
                  onChange={(event) =>
                    updateField("donationPositive", event.target.value)
                  }
                >
                  <option value="">Kies</option>
                  <option>Ja</option>
                  <option>Neutraal</option>
                  <option>Nee</option>
                </select>
              </label>

              <Likert
                value={formData.trustKryst}
                onChange={(value) => updateField("trustKryst", value)}
                label="In welke mate zou u Kryst vertrouwen als platform?"
              />

              <label className="field">
                Wat moet Kryst uitstralen om betrouwbaar en prettig aan te
                voelen?
                <textarea
                  value={formData.trustSignals}
                  onChange={(event) =>
                    updateField("trustSignals", event.target.value)
                  }
                  rows={3}
                />
              </label>

              <Likert
                value={formData.buyIntent}
                onChange={(value) => updateField("buyIntent", value)}
                label="Zou u eerder kopen bij een platform dat sfeer, betekenis en impact combineert?"
              />
            </div>
          )}

          {step === 5 && (
            <div className="space-y-5">
              <StepTitle step={step} />
              <label className="field">
                Extra opmerkingen
                <textarea
                  value={formData.extraRemarks}
                  onChange={(event) =>
                    updateField("extraRemarks", event.target.value)
                  }
                  rows={4}
                  placeholder="Wilt u nog iets meegeven?"
                />
              </label>

              <p className="rounded-xl border border-amber-100/20 bg-slate-900/60 p-4 text-sm text-amber-50/75">
                Dank voor uw tijd. Uw antwoorden helpen ons om kerstdecoratie
                met meer betekenis en impact te ontwikkelen.
              </p>
            </div>
          )}

          {error ? (
            <p className="rounded-xl border border-red-300/30 bg-red-500/10 p-3 text-sm text-red-100">
              {error}
            </p>
          ) : null}
          {successMessage ? (
            <p className="rounded-xl border border-emerald-300/30 bg-emerald-500/10 p-3 text-sm text-emerald-100">
              {successMessage}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={previousStep}
              className="rounded-full border border-amber-100/30 px-5 py-2.5 text-sm text-amber-50 transition hover:border-amber-100/70"
              disabled={step === 0 || loading}
            >
              Vorige
            </button>

            {step < stepMeta.length - 1 ? (
              <button
                type="button"
                onClick={nextStep}
                className="rounded-full bg-linear-to-r from-amber-300 to-yellow-100 px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:brightness-110"
              >
                Volgende stap
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-linear-to-r from-amber-300 to-yellow-100 px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Bezig met verzenden..." : "Enquete verzenden"}
              </button>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
