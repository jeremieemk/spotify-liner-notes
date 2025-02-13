import { useEffect, useState } from "react";

const LAST_FM_BASE_URL = "http://ws.audioscrobbler.com/2.0/";
const API_KEY = process.env.NEXT_PUBLIC_LAST_FM_KEY.trim();

export function useLastFmData(cleanTrackDetails) {
  const [artistBio, setArtistBio] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchArtistBio() {
      if (!cleanTrackDetails?.artist) {
      setArtistBio(null);
      return;
      }

      setIsLoading(true);
      setError(null);

      try {
      const encodedArtist = encodeURIComponent(cleanTrackDetails.artist);
      const url = `${LAST_FM_BASE_URL}?method=artist.getinfo&artist=${encodedArtist}&api_key=${API_KEY}&format=json`;
      const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json();

        if (!json.artist?.bio?.content) {
          throw new Error("Bio content not found in response");
        }

        setArtistBio(json.artist.bio.content);
      } catch (err) {
        setError(err.message);
        setArtistBio(null);
        console.error("Failed to fetch artist bio:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchArtistBio();
  }, [cleanTrackDetails.artist]);

  return { artistBio, error, isLoading };
}
