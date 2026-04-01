import { getSupabaseClient, jsonResponse } from "./_lib/supabase.js";

function sanitizeResponse(payload) {
  const source = payload || {};

  return {
    ageRange: source.ageRange || "",
    gender: source.gender || "",
    activeBeliever: source.activeBeliever || "",
    faithImportance: Number(source.faithImportance) || 0,
    household: source.household || "",
    buyMotivation: source.buyMotivation || "",
    desiredAtmosphere: Array.isArray(source.desiredAtmosphere)
      ? source.desiredAtmosphere
      : [],
    appealElements: Array.isArray(source.appealElements)
      ? source.appealElements
      : [],
    placement: source.placement || "",
    showFaithFreedom: Number(source.showFaithFreedom) || 0,
    buyToExpressFaith: Number(source.buyToExpressFaith) || 0,
    messageWanted: source.messageWanted || "",
    barriers: source.barriers || "",
    productTypes: Array.isArray(source.productTypes) ? source.productTypes : [],
    stylePreference: source.stylePreference || "",
    conceptChoice: source.conceptChoice || "",
    conceptReason: source.conceptReason || "",
    transparencyImportance: Number(source.transparencyImportance) || 0,
    donationPositive: source.donationPositive || "",
    trustKryst: Number(source.trustKryst) || 0,
    trustSignals: source.trustSignals || "",
    buyIntent: Number(source.buyIntent) || 0,
    extraRemarks: source.extraRemarks || "",
  };
}

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { error: "Method not allowed." });
  }

  try {
    const payload = JSON.parse(event.body || "{}");
    const response = sanitizeResponse(payload);

    if (!response.ageRange || !response.gender || !response.buyMotivation) {
      return jsonResponse(400, { error: "Verplichte velden ontbreken." });
    }

    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from("survey_responses")
      .insert([{ response }]);

    if (error) {
      return jsonResponse(500, { error: "Opslaan in database is mislukt." });
    }

    return jsonResponse(200, { ok: true });
  } catch {
    return jsonResponse(500, { error: "Onverwachte fout tijdens verzenden." });
  }
}
