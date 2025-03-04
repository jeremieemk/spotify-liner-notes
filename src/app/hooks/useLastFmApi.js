"use client";

import { useState, useEffect } from "react";

export function useLastFmApi(artist) {
  const [artistBio, setArtistBio] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchLastFmData() {
      if (!artist) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/lastfm?artist=${encodeURIComponent(artist)}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch LastFM data");
        }
        
        setArtistBio(data.artistBio);
      } catch (err) {
        console.error("Error fetching LastFM data:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchLastFmData();
  }, [artist]);
  
  return { artistBio, isLoading, error };
}
