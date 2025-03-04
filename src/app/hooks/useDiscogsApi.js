"use client";

import { useState, useEffect } from "react";

export function useDiscogsApi(spotifyData) {
  const [discogsData, setDiscogsData] = useState({ mostWantedRelease: null, oldestRelease: null });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDiscogsData() {
      if (!spotifyData) return;
      
      const artist = spotifyData?.artists?.[0]?.name;
      const album = spotifyData?.album?.name;
      const title = spotifyData?.name;

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
  }, [spotifyData]);
  
  return { ...discogsData, isLoading, error };
}
