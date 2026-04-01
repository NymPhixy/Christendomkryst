import { useCallback, useEffect, useState } from "react";
import { AboutSection } from "./components/AboutSection";
import { FlyerPreview } from "./components/FlyerPreview";
import { HeroSection } from "./components/HeroSection";
import { ResultsDashboard } from "./components/ResultsDashboard";
import { SurveyWizard } from "./components/SurveyWizard";
import { fetchResults } from "./lib/api";

function App() {
  const [results, setResults] = useState(null);
  const [loadingResults, setLoadingResults] = useState(false);
  const [resultsError, setResultsError] = useState("");

  const refreshResults = useCallback(async () => {
    setLoadingResults(true);
    try {
      const data = await fetchResults();
      setResults(data);
      setResultsError("");
    } catch (error) {
      setResultsError(error.message);
    } finally {
      setLoadingResults(false);
    }
  }, []);

  useEffect(() => {
    refreshResults();
    const intervalId = window.setInterval(refreshResults, 20000);
    return () => window.clearInterval(intervalId);
  }, [refreshResults]);

  return (
    <div
      className="min-h-screen text-amber-50"
      style={{ backgroundColor: "#05070f" }}
    >
      <main className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(254,240,138,0.1),transparent_45%),linear-gradient(180deg,#05070f,#0d1327_45%,#070b17)]" />
        <HeroSection />
        <AboutSection />
        <SurveyWizard onSubmitted={refreshResults} />
        <FlyerPreview />
        <ResultsDashboard
          data={results}
          loading={loadingResults}
          error={resultsError}
        />
      </main>
    </div>
  );
}

export default App;
