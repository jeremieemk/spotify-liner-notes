import { useEffect, useState } from "react";

export function useSpotifyData(accessToken) {
  const [spotifyData, setSpotifyData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!accessToken) return;

    const fetchCurrentTrack = async () => {
      try {
        const response = await fetch("https://api.spotify.com/v1/me/player", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (response.status === 204) {
          setSpotifyData(null);
          return;
        }

        if (response.status === 401) {
          setError("Authentication error");
          sessionStorage.removeItem("spotify_access_token");
          window.location.href = "/";
          return;
        }

        const data = await response.json();
        setSpotifyData(data.item);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching track:", err);
      }
    };

    fetchCurrentTrack();
    const interval = setInterval(fetchCurrentTrack, 5000);

    return () => clearInterval(interval);
  }, [accessToken]);

  return { spotifyData, error };
}