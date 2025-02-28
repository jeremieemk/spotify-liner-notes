"use client";

import { useState, useEffect } from "react";

export function useLyrics(artist, song) {
  const [lyrics, setLyrics] = useState(null);
  const [lyricsLoading, setLyricsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!artist || !song) {
      setLyrics(null);
      setError(null);
      setLyricsLoading(true);
      return;
    }

    const fetchLyrics = async () => {
      setLyrics(null);
      setLyricsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://api.lyrics.ovh/v1/${encodeURIComponent(
            artist
          )}/${encodeURIComponent(song)}`
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
        setLyricsLoading(false);
      }
    };

    fetchLyrics();
  }, [artist, song]);

  useEffect(() => {
    console.log('Current lyrics state:', { lyrics, lyricsLoading });
  }, [lyrics, lyricsLoading]);

  return { lyrics, lyricsLoading, error };
}