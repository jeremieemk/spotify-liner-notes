// hooks/usePerplexityData.ts
import { useState, useEffect } from "react";

export function usePerplexityData(artist, song, album) {
  const [perplexityResponse, setPerplexityResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      if (!artist || !song) return;

      setIsLoading(true);
      setError(null);

      console.log("Fetching Perplexity data", artist, song, album );

      try {
        const response = await fetch("/api/perplexity", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ artist, song, album }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch Perplexity data");
        }

        const data = await response.json();
        setPerplexityResponse(data.data.choices[0].message.content);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [artist, song, album]);

  return { perplexityResponse, isLoading, error };
}
