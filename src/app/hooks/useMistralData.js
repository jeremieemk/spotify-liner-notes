import { useState, useEffect } from "react";

export function useMistralData(artist, song, album) {
  const [mistralResponse, setMistralResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      if (!artist || !song) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/mistral", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ artist, song, album }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch Mistral data");
        }

        const data = await response.json();
        setMistralResponse(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [artist, song, album]);

  return { mistralResponse, isLoading, error };
}
