'use client'

import { useEffect, useState } from "react";
import { Discojs } from "discojs";

export function useDiscogsData(spotifyData) {
  const [discogsData, setDiscogsData] = useState(null);
  const [discogsReleases, setDiscogsReleases] = useState([]);
  const [error, setError] = useState(null);
  console.log('process.env', process.env);
  console.log('spotifyData', spotifyData);

  useEffect(() => {
    const userToken = process.env.NEXT_PUBLIC_DISCOGS_KEY.trim();
    if (!userToken) {
      setError('Invalid Discogs API token');
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

        const cleanArtistName = spotifyData.artists[0].name.replaceAll("&", "and");

        // Search for releases
        const searchResults = await discogsApi.searchDatabase({
          artist: cleanArtistName,
          track: cleanTrackName,
          type: "release",
        });

        console.log("Discogs Search Results:", searchResults);

        if (searchResults.results.length > 0) {
          setDiscogsData(searchResults.results);

          // Fetch details for first release
          const firstReleaseDetails = await discogsApi.getRelease(searchResults.results[0].id);
          
          console.log("First Discogs Release Details:", firstReleaseDetails);
          
          setDiscogsReleases([firstReleaseDetails]);
        } else {
          console.log("No Discogs data found");
          setError('No matching releases found');
        }
      } catch (fetchError) {
        console.error("Discogs API Error:", fetchError);
        
        // More specific error handling
        if (fetchError instanceof Error) {
          if (fetchError.message.includes('authentication')) {
            setError('Authentication failed. Check your Discogs API token.');
          } else {
            setError(`API Error: ${fetchError.message}`);
          }
        } else {
          setError('Unknown Discogs API error');
        }
      }
    }

    fetchDiscogsData();
  }, [spotifyData]);

  return { discogsData, discogsReleases, error };
}