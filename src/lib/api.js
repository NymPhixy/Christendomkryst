const API_BASE = "/api";

export async function submitSurvey(payload) {
  const response = await fetch(`${API_BASE}/submit-response`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Opslaan is mislukt.");
  }

  return data;
}

export async function fetchResults() {
  const response = await fetch(`${API_BASE}/get-results`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Resultaten ophalen is mislukt.");
  }

  return data;
}
