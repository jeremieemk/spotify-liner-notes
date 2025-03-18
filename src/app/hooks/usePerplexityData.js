import { useState, useEffect, useRef } from "react";

export function usePerplexityData(
  artist,
  song,
  album,
  lyrics,
  lyricsLoading,
  discogsCredits,
  discogsLoading,
  musicbrainzCredits,
  musicbrainzLoading
) {
  const [perplexityResponse, setPerplexityResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const requestedRef = useRef(false);
  const songArtistRef = useRef("");

  // Reset when song/artist changes
  useEffect(() => {
    if (artist && song) {
      const currentKey = `${artist}-${song}`;
      if (songArtistRef.current !== currentKey) {
        songArtistRef.current = currentKey;
        requestedRef.current = false;
        setPerplexityResponse(null);
      }
    }
  }, [artist, song]);

  useEffect(() => {
    async function fetchData() {
      // Exit if we don't have the required data or if we're still loading
      if (!artist || !song || lyricsLoading || discogsLoading || musicbrainzLoading) return;
      
      // Prevent duplicate requests for the same song
      if (requestedRef.current) return;
      
      requestedRef.current = true;
      setIsLoading(true);
      setError(null);

      try {
        // Process the credits object to ensure it's JSON-serializable
        const processedDiscogsCredits = discogsCredits ? JSON.parse(JSON.stringify(discogsCredits)) : null;
        const processedMusicbrainzCredits = musicbrainzCredits ? JSON.parse(JSON.stringify(musicbrainzCredits)) : null;
        
        const response = await fetch("/api/perplexity", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            artist, 
            song, 
            album, 
            lyrics, 
            discogsCredits: processedDiscogsCredits,
            musicbrainzCredits: processedMusicbrainzCredits
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
        // Reset so we can try again
        requestedRef.current = false;
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [lyricsLoading, discogsLoading, musicbrainzLoading]);

  return { perplexityResponse, isLoading, error };
}
