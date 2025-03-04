"use client";

import { createContext, useContext, useState } from "react";
import { useSpotify } from "./SpotifyContext";

const PlaybackContext = createContext();

export const usePlayback = () => {
  const context = useContext(PlaybackContext);
  if (!context) {
    throw new Error('usePlayback must be used within a PlaybackProvider');
  }
  return context;
};

export function PlaybackProvider({ children }) {
  const { trackProgress, isPlaying } = useSpotify();
  const [isAudioCommentaryPlaying, setIsAudioCommentaryPlaying] = useState(false);
  
  const handleAudioCommentaryChange = (isPlaying) => {
    setIsAudioCommentaryPlaying(isPlaying);
  };

  const value = {
    trackProgress,
    isPlaying,
    isAudioCommentaryPlaying,
    handleAudioCommentaryChange
  };

  return (
    <PlaybackContext.Provider value={value}>
      {children}
    </PlaybackContext.Provider>
  );
}
