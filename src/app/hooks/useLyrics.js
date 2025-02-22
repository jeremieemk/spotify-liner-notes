"use client";

import { useState, useEffect } from "react";

export function useLyrics(artist, title) {
  const [lyrics, setLyrics] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!artist || !title) {
      setLyrics(null);
      setError(null);
      return;
    }

    const fetchLyrics = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://api.lyrics.ovh/v1/${encodeURIComponent(
            artist
          )}/${encodeURIComponent(title)}`
        );

        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? "Lyrics not found"
              : "Failed to fetch lyrics"
          );
        }

        const data = await response.json();
        setLyrics(data.lyrics);
      } catch (err) {
        console.error("Error fetching lyrics:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLyrics();
  }, [artist, title]);

  return { lyrics, isLoading, error };
}