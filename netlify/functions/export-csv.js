import { getSupabaseClient, jsonResponse } from "./_lib/supabase.js";

function csvEscape(value) {
  const stringValue = `${value ?? ""}`;
  if (
    stringValue.includes(",") ||
    stringValue.includes('"') ||
    stringValue.includes("\n")
  ) {
    return `"${stringValue.replaceAll('"', '""')}"`;
  }
  return stringValue;
}

export async function handler(event) {
  if (event?.httpMethod && event.httpMethod !== "GET") {
    return jsonResponse(405, { error: "Method not allowed." });
  }

  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("survey_responses")
      .select("created_at, response")
      .order("created_at", { ascending: false })
      .limit(5000);

    if (error) {
      return jsonResponse(500, {
        error: "CSV export mislukt.",
        detail: error.message,
        code: error.code || null,
      });
    }

    const rows = data || [];
    const headers = [
      "created_at",
      "ageRange",
      "gender",
      "activeBeliever",
      "faithImportance",
      "buyMotivation",
      "placement",
      "stylePreference",
      "conceptChoice",
      "donationPositive",
      "trustKryst",
      "buyIntent",
      "trustSignals",
      "extraRemarks",
    ];

    const lines = [headers.join(",")];

    for (const row of rows) {
      const response = row.response || {};
      const values = [
        row.created_at,
        response.ageRange,
        response.gender,
        response.activeBeliever,
        response.faithImportance,
        response.buyMotivation,
        response.placement,
        response.stylePreference,
        response.conceptChoice,
        response.donationPositive,
        response.trustKryst,
        response.buyIntent,
        response.trustSignals,
        response.extraRemarks,
      ];

      lines.push(values.map(csvEscape).join(","));
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition":
          'attachment; filename="kryst-survey-results.csv"',
      },
      body: lines.join("\n"),
    };
  } catch (caughtError) {
    return jsonResponse(500, {
      error: "Onverwachte fout tijdens CSV export.",
      detail: caughtError?.message || "Geen extra details beschikbaar.",
    });
  }
}
