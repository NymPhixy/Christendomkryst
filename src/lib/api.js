import { getSupabaseClient } from "../utils/supabase.js";

const API_BASE = "/api";

function addCount(target, name) {
  if (!name) return;
  target[name] = (target[name] || 0) + 1;
}

function toTopEntries(map, limit = 5) {
  return Object.entries(map)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

function percent(part, total) {
  if (!total) return 0;
  return Math.round((part / total) * 100);
}

function aggregateResponses(rows) {
  const totalResponses = rows.length;

  const productMap = {};
  const atmosphereMap = {};
  const conceptMap = {};
  let donationImportantCount = 0;
  let faithFreedomCount = 0;
  const openQuotes = [];

  for (const row of rows) {
    const response = row.response || {};
    const products = Array.isArray(response.productTypes)
      ? response.productTypes
      : [];
    const atmospheres = Array.isArray(response.desiredAtmosphere)
      ? response.desiredAtmosphere
      : [];

    products.forEach((product) => addCount(productMap, product));
    atmospheres.forEach((atmosphere) => addCount(atmosphereMap, atmosphere));
    addCount(conceptMap, response.conceptChoice);

    if (response.donationPositive === "Ja") donationImportantCount += 1;
    if (Number(response.showFaithFreedom) >= 4) faithFreedomCount += 1;

    if (response.trustSignals) openQuotes.push(response.trustSignals);
    if (response.extraRemarks) openQuotes.push(response.extraRemarks);
  }

  const conceptBreakdown = toTopEntries(conceptMap, 2);

  return {
    totalResponses,
    topProducts: toTopEntries(productMap),
    topAtmosphere: toTopEntries(atmosphereMap),
    donationImportantPercent: percent(donationImportantCount, totalResponses),
    faithFreedomPercent: percent(faithFreedomCount, totalResponses),
    topConcept: conceptBreakdown[0]?.name || "",
    conceptBreakdown,
    openQuotes: openQuotes.slice(0, 10),
  };
}

async function readJsonSafe(response) {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

async function submitSurveyToSupabase(payload) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error(
      "API route niet beschikbaar en frontend Supabase configuratie ontbreekt.",
    );
  }

  const { error } = await supabase.from("survey_responses").insert([
    {
      response: payload,
    },
  ]);

  if (error) {
    throw new Error(`Opslaan via Supabase is mislukt. (${error.message})`);
  }

  return { ok: true, fallback: "supabase" };
}

async function fetchResultsFromSupabase() {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error("Frontend Supabase configuratie ontbreekt.");
  }

  const { data, error } = await supabase
    .from("survey_responses")
    .select("response, created_at")
    .order("created_at", { ascending: false })
    .limit(5000);

  if (error) {
    throw new Error(
      `Resultaten ophalen via Supabase is mislukt. (${error.message})`,
    );
  }

  return aggregateResponses(data || []);
}

export async function submitSurvey(payload) {
  const response = await fetch(`${API_BASE}/submit-response`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await readJsonSafe(response);
  if (!response.ok) {
    const detail = data?.detail ? ` (${data.detail})` : "";
    const code = data?.code ? ` [${data.code}]` : "";
    const fullMessage = (data?.error || "Opslaan is mislukt.") + detail + code;

    if (response.status === 404) {
      try {
        return await submitSurveyToSupabase(payload);
      } catch {
        throw new Error(
          "API endpoint /api/submit-response niet gevonden. Start met `npm run dev:netlify` of configureer frontend Supabase variabelen.",
        );
      }
    }

    throw new Error(fullMessage);
  }

  return data || { ok: true };
}

export async function fetchResults() {
  const response = await fetch(`${API_BASE}/get-results`);
  const data = await response.json();

  if (!response.ok) {
    const detail = data.detail ? ` (${data.detail})` : "";
    const code = data.code ? ` [${data.code}]` : "";

    const fullMessage =
      (data.error || "Resultaten ophalen is mislukt.") + detail + code;

    if (
      fullMessage.includes("SUPABASE_URL") ||
      fullMessage.includes("SUPABASE_SERVICE_ROLE_KEY")
    ) {
      try {
        return await fetchResultsFromSupabase();
      } catch {
        throw new Error(fullMessage);
      }
    }

    throw new Error(fullMessage);
  }

  return data;
}
