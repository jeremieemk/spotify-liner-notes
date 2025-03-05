import { useState, useEffect } from "react";

export function usePerplexityData(
  artist,
  song,
  album,
  lyrics,
  lyricsLoading,
  credits,
  discogsLoading
) {
  const [perplexityResponse, setPerplexityResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      console.log('discogsLoading', discogsLoading);

      if (!artist || !song || lyricsLoading || discogsLoading) return;

      setIsLoading(true);
      setError(null);

      try {
        // Process the credits object to ensure it's JSON-serializable
        const processedCredits = credits ? JSON.parse(JSON.stringify(credits)) : null;
        console.log('processedCredits', processedCredits);
        
        const response = await fetch("/api/perplexity", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            artist, 
            song, 
            album, 
            lyrics, 
            credits: processedCredits 
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch Perplexity data");
        }

        const data = await response.json();
        setPerplexityResponse(data.data.choices[0].message.content);
      } catch (err) {
        console.error("Error with Perplexity request:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [lyrics, lyricsLoading, discogsLoading]);

  return { perplexityResponse, isLoading, error };
}
