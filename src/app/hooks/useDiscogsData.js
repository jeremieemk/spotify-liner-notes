"use client";

import { useEffect, useState } from "react";
import { Discojs } from "discojs";

export function useDiscogsData(spotifyData) {
  const [discogsData, setDiscogsData] = useState(null);
  const [mostWantedRelease, setMostWantedRelease] = useState(null);
  const [oldestRelease, setOldestRelease] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userToken = process.env.NEXT_PUBLIC_DISCOGS_KEY.trim();
    if (!userToken) {
      setError("Invalid Discogs API token");
      return;
    }

    const discogsApi = new Discojs({
      userToken,
    });

    async function fetchDiscogsData() {
      try {
        const regex = /\s*\([^)]*\)/g;
        const cleanTrackName = spotifyData.name.includes("-")
          ? spotifyData.name
              .replace(regex, "")
              .replaceAll("&", "")
              .substring(0, spotifyData.name.indexOf("-"))
          : spotifyData.name.replace(regex, "").replaceAll("&", "");

        const cleanArtistName = spotifyData.artists[0].name.replaceAll(
          "&",
          "and"
        );

        // Search for releases
        const searchResults = await discogsApi.searchDatabase({
          artist: cleanArtistName,
          track: cleanTrackName,
          type: "release",
        });


        if (searchResults.results.length > 0) {
          setDiscogsData(searchResults.results);

          // Sort by community want count
          const sortedByWants = [...searchResults.results].sort(
            (a, b) => (b.community?.want || 0) - (a.community?.want || 0)
          );

          // Sort by year (oldest first)
          const sortedByYear = [...searchResults.results]
            .filter((release) => release.year) // Filter out releases without year
            .sort((a, b) => parseInt(a.year) - parseInt(b.year));

          // Fetch detailed information for both
          if (sortedByWants[0]) {
            const wantedDetails = await discogsApi.getRelease(
              sortedByWants[0].id
            );
            setMostWantedRelease(wantedDetails);
          }

          if (sortedByYear[0]) {
            const oldestDetails = await discogsApi.getRelease(
              sortedByYear[0].id
            );
            setOldestRelease(oldestDetails);
          }
        } else {
          console.log("No Discogs data found");
          setError("No matching releases found");
        }
      } catch (fetchError) {
        console.error("Discogs API Error:", fetchError);

        if (fetchError instanceof Error) {
          if (fetchError.message.includes("authentication")) {
            setError("Authentication failed. Check your Discogs API token.");
          } else {
            setError(`API Error: ${fetchError.message}`);
          }
        } else {
          setError("Unknown Discogs API error");
        }
      }
    }

    if (spotifyData) {
      fetchDiscogsData();
    }
  }, [spotifyData]);

  return {
    discogsData,
    mostWantedRelease,
    oldestRelease,
    error,
    // Including some helper data for comparison
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
