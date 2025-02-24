import { useState, useEffect } from "react";

export function usePerplexityData(artist, song, album, lyrics, lyricsLoading) {
  const [perplexityResponse, setPerplexityResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      // Wait until lyricsLoading is false, but do not check for lyrics being null.
      if (!artist || !song || lyricsLoading) return;
      console.log('Fetching perplexity data lyricsLoading:', lyricsLoading);

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/perplexity", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ artist, song, album, lyrics }),
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
  }, [lyrics, lyricsLoading]);

  return { perplexityResponse, isLoading, error };
}
