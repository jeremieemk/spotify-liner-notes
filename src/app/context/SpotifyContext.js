"use client";

import { createContext, useContext } from "react";
import { useAuth } from "./AuthContext";
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
  const { token } = useAuth();

  const { spotifyData, trackProgress, isPlaying } = useSpotifyData(token);

  // get clean track details
  const { artist, song, album } = spotifyData
    ? getCleanTrackDetails(spotifyData)
    : { artist: "", song: "", album: "" };

  const value = {
    spotifyData,
    trackProgress,
    isPlaying,
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
