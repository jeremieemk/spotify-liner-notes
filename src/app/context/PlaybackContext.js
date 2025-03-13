"use client";

import { createContext, useContext, useState } from "react";
import { useSpotify } from "./SpotifyContext";

const PlaybackContext = createContext();

export const usePlayback = () => {
  const context = useContext(PlaybackContext);
  if (!context) {
    throw new Error("usePlayback must be used within a PlaybackProvider");
  }
  return context;
};

export function PlaybackProvider({ children }) {
  const { trackProgress, isPlaying, trackDuration } = useSpotify();
  const [isAudioCommentaryPlaying, setIsAudioCommentaryPlaying] =
    useState(false);
  const [autoPlayCommentary, setAutoPlayCommentary] = useState(false);

  const COMMENTARY_DURATION_MS = 5000;

  const handleAudioCommentaryChange = (playing) => {
    setIsAudioCommentaryPlaying(playing);
  };

  const playCommentaryAudio = () => {
    // Optionally pause Spotify playback before playing commentary.
    // pauseSpotifyPlayback(); // Uncomment if you have a function to pause playback.

    // Trigger commentary playback logic here.
    console.log("Playing commentary audio...");
    setIsAudioCommentaryPlaying(true);

    // Simulate commentary audio playback duration; replace with real audio event handling.
    setTimeout(() => {
      console.log("Commentary audio finished...");
      setIsAudioCommentaryPlaying(false);
      // Optionally resume Spotify playback here:
      // resumeSpotifyPlayback();
    }, COMMENTARY_DURATION_MS);
  };

  // detect when a song ends and auto-play commentary if enabled
  useEffect(() => {
    // if auto-play is enabled, the song has reached its end, and commentary isn't already playing...
    if (
      autoPlayCommentary &&
      trackProgress >= trackDuration &&
      !isAudioCommentaryPlaying
    ) {
      // trigger commentary playback.
      playCommentaryAudio();
    }
  }, [
    trackProgress,
    trackDuration,
    autoPlayCommentary,
    isAudioCommentaryPlaying,
  ]);

  const value = {
    trackProgress,
    isPlaying,
    isAudioCommentaryPlaying,
    handleAudioCommentaryChange,
    autoPlayCommentary,
    setAutoPlayCommentary,
    playCommentaryAudio,
  };

  return (
    <PlaybackContext.Provider value={value}>
      {children}
    </PlaybackContext.Provider>
  );
}
