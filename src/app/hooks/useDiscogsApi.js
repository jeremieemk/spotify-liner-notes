"use client";

import { useState, useEffect } from "react";

export function useDiscogsApi(artist, album, title) {
  const [discogsData, setDiscogsData] = useState({ mostWantedRelease: null, oldestRelease: null });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDiscogsData() {
      if (!artist || (!album && !title)) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const params = new URLSearchParams();
        params.append('artist', artist);
        if (album) params.append('album', album);
        if (title) params.append('title', title);
        
        const response = await fetch(`/api/discogs?${params.toString()}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch Discogs data");
        }
        
        setDiscogsData({
          mostWantedRelease: data.mostWantedRelease,
          oldestRelease: data.oldestRelease
        });
      } catch (err) {
        console.error("Error fetching Discogs data:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchDiscogsData();
  }, [artist, album, title]);
  
  return { ...discogsData, isLoading, error };
}
