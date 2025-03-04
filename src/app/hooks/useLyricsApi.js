"use client";

import { useState, useEffect } from "react";

export function useLyricsApi(artist, title) {
  const [lyrics, setLyrics] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchLyrics() {
      if (!artist || !title) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/lyrics?artist=${encodeURIComponent(artist)}&title=${encodeURIComponent(title)}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch lyrics");
        }
        
        setLyrics(data.lyrics);
      } catch (err) {
        console.error("Error fetching lyrics:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchLyrics();
  }, [artist, title]);
  
  return { lyrics, isLoading, error };
}
