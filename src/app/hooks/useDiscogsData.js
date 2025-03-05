"use client";

import { useEffect, useState, useMemo } from "react";

export function useDiscogsData(spotifyData) {
  const [discogsData, setDiscogsData] = useState(null);
  const [mostWantedRelease, setMostWantedRelease] = useState(null);
  const [oldestRelease, setOldestRelease] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Memoize the cleaned track and artist names
  const { cleanTrackName, cleanArtistName } = useMemo(() => {
    if (!spotifyData) return { cleanTrackName: "", cleanArtistName: "" };

    const regex = /\s*\([^)]*\)/g;
    const trackName = spotifyData.name.includes("-")
      ? spotifyData.name
          .replace(regex, "")
          .replaceAll("&", "")
          .substring(0, spotifyData.name.indexOf("-"))
      : spotifyData.name.replace(regex, "").replaceAll("&", "");

    const artistName = spotifyData.artists[0].name.replaceAll("&", "and");

    return {
      cleanTrackName: trackName,
      cleanArtistName: artistName
    };
  }, [spotifyData?.name, spotifyData?.artists]);

  useEffect(() => {
    // Reset states when track/artist changes
    setDiscogsData(null);
    setMostWantedRelease(null);
    setOldestRelease(null);
    setError(null);
    setIsLoading(true);

    if (!cleanTrackName || !cleanArtistName) {
      setIsLoading(false);
      return;
    }

    let isCanceled = false;

    async function fetchDiscogsData() {
      try {
        const queryParams = new URLSearchParams({
          track: cleanTrackName,
          artist: cleanArtistName
        });
        
        const response = await fetch(`/api/discogs?${queryParams}`);
        const data = await response.json();

        if (isCanceled) return;

        if (response.ok) {
          setDiscogsData(data.discogsData);
          setMostWantedRelease(data.mostWantedRelease);
          setOldestRelease(data.oldestRelease);
        } else {
          setError(data.error || "Failed to fetch data from Discogs");
        }
      } catch (fetchError) {
        if (!isCanceled) {
          console.error("API Request Error:", fetchError);
          setError(`Request Error: ${fetchError.message}`);
        }
      } finally {
        if (!isCanceled) {
          setIsLoading(false);
        }
      }
    }

    fetchDiscogsData();

    return () => {
      isCanceled = true;
    };
  }, [cleanTrackName, cleanArtistName]);

  return {
    discogsData,
    mostWantedRelease,
    oldestRelease,
    error,
    isLoading,
    comparison: discogsData
      ? {
          totalReleases: discogsData.length,
          mostWantedStats: mostWantedRelease
            ? {
                year: mostWantedRelease.year,
                country: mostWantedRelease.country,
                format: mostWantedRelease.format,
                want_count: mostWantedRelease.community?.want,
              }
            : null,
          oldestStats: oldestRelease
            ? {
                year: oldestRelease.year,
                country: oldestRelease.country,
                format: oldestRelease.format,
                want_count: oldestRelease.community?.want,
              }
            : null,
        }
      : null,
  };
}
