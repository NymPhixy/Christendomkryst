import { getSupabaseClient, jsonResponse } from "./_lib/supabase.js";

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

export async function handler() {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("survey_responses")
      .select("response, created_at")
      .order("created_at", { ascending: false })
      .limit(5000);

    if (error) {
      return jsonResponse(500, { error: "Resultaten ophalen is mislukt." });
    }

    const rows = data || [];
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

    return jsonResponse(200, {
      totalResponses,
      topProducts: toTopEntries(productMap),
      topAtmosphere: toTopEntries(atmosphereMap),
      donationImportantPercent: percent(donationImportantCount, totalResponses),
      faithFreedomPercent: percent(faithFreedomCount, totalResponses),
      topConcept: conceptBreakdown[0]?.name || "",
      conceptBreakdown,
      openQuotes: openQuotes.slice(0, 10),
    });
  } catch {
    return jsonResponse(500, {
      error: "Onverwachte fout tijdens resultaten ophalen.",
    });
  }
}
