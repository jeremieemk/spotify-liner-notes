"use client";

import { useState, useEffect } from "react";

export function useMusicBrainzApi(artist, title, album) {
  const [musicBrainzData, setMusicBrainzData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMusicBrainzData() {
      if (!artist || !title) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const params = new URLSearchParams();
        params.append('artist', artist);
        params.append('title', title);
        if (album) params.append('album', album);
        
        const response = await fetch(`/api/musicbrainz?${params.toString()}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch MusicBrainz data");
        }
        
        setMusicBrainzData(data);
      } catch (err) {
        console.error("Error fetching MusicBrainz data:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchMusicBrainzData();
  }, [artist, title, album]);
  
  return { musicBrainzData, isLoading, error };
}
