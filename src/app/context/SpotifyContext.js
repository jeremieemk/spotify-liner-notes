"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useSpotifyData } from "../hooks/useSpotifyData";
import { getCleanTrackDetails } from "../utils/trackUtils";

const SpotifyContext = createContext();

export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  return context;
};

export function SpotifyProvider({ children }) {
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("spotify_access_token");
    if (storedToken) {
      setToken(storedToken);
    } else {
      // If we're in a client-side environment, redirect
      if (typeof window !== 'undefined') {
        window.location.href = "/";
      }
    }
  }, []);

  const { spotifyData, trackProgress, isPlaying } = useSpotifyData(token);

  // get clean track details
  const { artist, song, album } = spotifyData
    ? getCleanTrackDetails(spotifyData)
    : { artist: "", song: "", album: "" };

  const value = {
    token,
    setToken,
    spotifyData,
    trackProgress, // Still expose these so PlaybackContext can use them
    isPlaying,     // Still expose these so PlaybackContext can use them
    artist,
    song,
    album
  };

  return (
    <SpotifyContext.Provider value={value}>
      {children}
    </SpotifyContext.Provider>
  );
}
