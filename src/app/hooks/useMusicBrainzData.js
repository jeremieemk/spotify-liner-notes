"use client";

import { useState, useEffect } from "react";

export function useMusicBrainzData({ artist, song, album }) {
  const [musicBrainzData, setMusicBrainzData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Reset states when inputs change
    setMusicBrainzData(null);
    setError(null);
    setLoading(false);
    
    if (!artist || !song) return;
    
    let isCanceled = false;
    
    async function fetchMusicBrainzData() {
      setLoading(true);
      
      try {
        const queryParams = new URLSearchParams({
          artist,
          song,
          album: album || ''
        });
        
        const response = await fetch(`/api/musicbrainz?${queryParams}`);
        const data = await response.json();
        
        if (isCanceled) return;
        
        if (response.ok) {
          setMusicBrainzData(data.musicBrainzData);
        } else {
          setError(data.error || "Failed to fetch data from MusicBrainz");
        }
      } catch (fetchError) {
        if (!isCanceled) {
          console.error("API Request Error:", fetchError);
          setError(`Request Error: ${fetchError.message}`);
        }
      } finally {
        if (!isCanceled) {
          setLoading(false);
        }
      }
    }

    // Respect rate-limiting with a 1-second delay
    const timeoutId = setTimeout(() => {
      if (artist && song) {
        fetchMusicBrainzData();
      }
    }, 1000);

    return () => {
      isCanceled = true;
      clearTimeout(timeoutId);
    };
  }, [artist, song, album]);

  return { musicBrainzData, loading, error };
}
