"use client";

import { createContext, useContext, useState } from "react";
import { useSpotifyData } from "../hooks/useSpotifyData";
import { useSpotifyControls } from "../hooks/useSpotifyControls";
import { useAudioCommentary } from "../hooks/useAudioCommentary";
import { useElevenLabs } from "../hooks/useElevenLabs";
import { useSongData } from "./SongDataContext";
import { useAuth } from "./AuthContext";

const PlaybackContext = createContext();

export const usePlayback = () => {
  const context = useContext(PlaybackContext);
  if (!context) {
    throw new Error("usePlayback must be used within a PlaybackProvider");
  }
  return context;
};

export function PlaybackProvider({ children }) {
  const { token } = useAuth();

  const { trackProgress, isPlaying, trackDuration } = useSpotifyData(token);

  const { chatGPTResponse } = useSongData();

  const [autoPlayCommentary, setAutoPlayCommentary] = useState(false);

  const {
    audioUrl,
    isLoading: eleveLabsIsLoading,
    error: elevenLabsError,
  } = useElevenLabs(chatGPTResponse, autoPlayCommentary);

  const {
    play: playSpotify,
    pause: pauseSpotify,
    next: playNextSpotifyTrack,
    previous: playPreviousSpotifyTrack,
  } = useSpotifyControls(token);

  const { isAudioCommentaryPlaying } = useAudioCommentary(
    autoPlayCommentary,
    trackProgress,
    trackDuration,
    audioUrl,
    eleveLabsIsLoading,
    elevenLabsError,
    playNextSpotifyTrack,
    pauseSpotify,
    playSpotify
  );

  const value = {
    // spotify playback state
    trackProgress,
    isPlaying,

    // audio commentary playback state
    autoPlayCommentary,
    setAutoPlayCommentary,
    isAudioCommentaryPlaying,

    // spotify playback controls
    playSpotify,
    pauseSpotify,
    playNextSpotifyTrack,
    playPreviousSpotifyTrack,
  };

  return (
    <PlaybackContext.Provider value={value}>
      {children}
    </PlaybackContext.Provider>
  );
}
