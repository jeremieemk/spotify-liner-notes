"use client";

import { useState, useEffect } from "react";

export function useMusicBrainzData({ artist, song }) {
  const [musicBrainzData, setMusicBrainzData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchMusicBrainzData() {
      if (!artist || !song) return;
      setLoading(true);
      setError(null);

      try {
        // Step 1: Search for a recording matching the song title and artist.
        const recordingSearchQuery = encodeURIComponent(
          `recording:"${song}" AND artist:"${artist}"`
        );
        const searchResponse = await fetch(
          `https://musicbrainz.org/ws/2/recording/?query=${recordingSearchQuery}&fmt=json`,
          {
            headers: {
              "User-Agent": "my-app/1.0.0 ( myemail@example.com )",
            },
          }
        );
        const searchData = await searchResponse.json();

        let detailedData = null;
        if (searchData.recordings && searchData.recordings.length > 0) {
          const recordingId = searchData.recordings[0].id;

          // Step 2: Fetch detailed recording data with valid inc parameters.
          // Note: In a browse request (such as on the release endpoint) you cannot retrieve detailed
          // recording relationships (like work relationships) in one go. Therefore, we use a direct
          // recording lookup which supports including work relationships.
          const detailedResponse = await fetch(
            `https://musicbrainz.org/ws/2/recording/${recordingId}?inc=artists+isrcs+artist-credits+work-rels+work-level-rels+artist-rels+label-rels+instrument-rels+url-rels&fmt=json`,
            {
              headers: {
                "User-Agent": "my-app/1.0.0 ( myemail@example.com )",
              },
            }
          );
          detailedData = await detailedResponse.json();
        }

        if (!detailedData) {
          setError("No matching recording found");
        } else {
          setMusicBrainzData(detailedData);
        }
      } catch (err) {
        console.error("MusicBrainz API Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    // Respect rate limiting by delaying the request 1 second.
    const timeoutId = setTimeout(() => {
      if (artist && song) {
        fetchMusicBrainzData();
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [artist, song]);

  return { musicBrainzData, loading, error };
}
