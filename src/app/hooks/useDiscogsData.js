"use client";

import { useEffect, useState, useMemo } from "react";
import { Discojs } from "discojs";

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
    const userToken = process.env.NEXT_PUBLIC_DISCOGS_KEY?.trim();
    if (!userToken) {
      setError("Invalid Discogs API token");
      return;
    }

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

    const discogsApi = new Discojs({ userToken });
    let isCanceled = false;

    async function fetchDiscogsData() {
      try {
        const searchResults = await discogsApi.searchDatabase({
          artist: cleanArtistName,
          track: cleanTrackName,
          type: "release",
        });

        if (isCanceled) return;

        if (searchResults.results.length > 0) {
          setDiscogsData(searchResults.results);

          // Sort by community want count
          const sortedByWants = [...searchResults.results].sort(
            (a, b) => (b.community?.want || 0) - (a.community?.want || 0)
          );

          // Sort by year (oldest first)
          const sortedByYear = [...searchResults.results]
            .filter((release) => release.year)
            .sort((a, b) => parseInt(a.year) - parseInt(b.year));

          // Fetch details in parallel
          if (sortedByWants[0] && sortedByYear[0]) {
            const [wantedDetails, oldestDetails] = await Promise.all([
              discogsApi.getRelease(sortedByWants[0].id),
              discogsApi.getRelease(sortedByYear[0].id)
            ]);

            if (!isCanceled) {
              setMostWantedRelease(wantedDetails);
              setOldestRelease(oldestDetails);
            }
          }
        } else {
          setError("No matching releases found");
        }
      } catch (fetchError) {
        if (!isCanceled) {
          console.error("Discogs API Error:", fetchError);
          setError(
            fetchError.message.includes("authentication")
              ? "Authentication failed. Check your Discogs API token."
              : `API Error: ${fetchError.message}`
          );
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
  }, [cleanTrackName, cleanArtistName]); // Only depends on cleaned names

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
