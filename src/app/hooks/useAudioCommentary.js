import { useState, useEffect, useCallback } from "react";

export function useAudioCommentary(
  trackProgress,
  trackDuration,
  audioUrl,
  eleveLabsIsLoading,
  elevenLabsError,
  playSpotify,
  pauseSpotify
) {
  const [autoPlayCommentary, setAutoPlayCommentary] = useState(false);
  const [isAudioCommentaryPlaying, setIsAudioCommentaryPlaying] =
    useState(false);

  const playCommentaryAudio = useCallback(() => {
    // Pause Spotify before playing commentary
    pauseSpotify();
    
    const audio = new Audio(audioUrl);
    audio.play();
    setIsAudioCommentaryPlaying(true);

    audio.onended = () => {
      setIsAudioCommentaryPlaying(false);
      // Resume Spotify playback when commentary ends
      playSpotify();
    };

    audio.onerror = () => {
      console.error("Error playing audio commentary");
      setIsAudioCommentaryPlaying(false);
      // Resume Spotify if there's an error playing commentary
      playSpotify();
    };
  }, [audioUrl, pauseSpotify, playSpotify]);

  // detect when a song ends and auto-play commentary if enabled
  useEffect(() => {
    // if auto-play is enabled, the song has reached its end, commentary isn't already playing,
    // elevenlabs is not loading, and there's no error...
    if (
      autoPlayCommentary &&
      trackProgress >= trackDuration &&
      !isAudioCommentaryPlaying &&
      !eleveLabsIsLoading &&
      !elevenLabsError
    ) {
      // trigger commentary playback
      playCommentaryAudio();
    }
  }, [
    trackProgress,
    trackDuration,
    autoPlayCommentary,
    isAudioCommentaryPlaying,
    eleveLabsIsLoading,
    elevenLabsError,
    playCommentaryAudio,
  ]);

  return { 
    setAutoPlayCommentary, 
    isAudioCommentaryPlaying,
  };
}
