"use client";

import { createContext, useContext } from "react";
import { useSpotifyData } from "../hooks/useSpotifyData";
import { useSpotifyControls } from "../hooks/useSpotifyControls";
import { useAudioCommentary } from "../hooks/useAudioCommentary";
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

  const { audioUrl, eleveLabsIsLoading, elevenLabsError } = useSongData();

  const {
    play: playSpotify,
    pause: pauseSpotify,
    next: playNextSpotifyTrack,
    previous: playPreviousSpotifyTrack,
  } = useSpotifyControls(token);

  const { isAudioCommentaryPlaying, setAutoPlayCommentary } =
    useAudioCommentary(
      trackProgress,
      trackDuration,
      audioUrl,
      eleveLabsIsLoading,
      elevenLabsError,
      playSpotify,
      pauseSpotify
    );

  const value = {
    // spotify playback state
    trackProgress,
    isPlaying,

    // audio commentary playback state
    isAudioCommentaryPlaying,
    setAutoPlayCommentary,

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
