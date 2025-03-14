import { useEffect, useState } from "react";

export function useSpotifyData(accessToken) {
  const [spotifyData, setSpotifyData] = useState(null);
  const [artist, setArtist] = useState(null);
  const [song, setSong] = useState(null);
  const [album, setAlbum] = useState(null);
  const [trackProgress, setTrackProgress] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
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
          setTrackProgress(null);
          setIsPlaying(false);
          return;
        }

        if (response.status === 401) {
          setError("Authentication error");
          localStorage.removeItem("spotify_access_token");
          window.location.href = "/";
          return;
        }

        const data = await response.json();
        setSpotifyData(data.item);
        setTrackProgress(data.progress_ms);
        setIsPlaying(data.is_playing);
        setArtist(data.item.artists[0].name);
        setSong(data.item.name);
        setAlbum(data.item.album.name);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchCurrentTrack();
    const interval = setInterval(fetchCurrentTrack, 1000);

    return () => clearInterval(interval);
  }, [accessToken]);

  return { spotifyData, artist, song, album, trackProgress, isPlaying, error };
}
