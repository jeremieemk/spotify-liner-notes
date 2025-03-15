import { useState, useEffect, useCallback, useRef } from "react";

export function useAudioCommentary(
  trackProgress,
  trackDuration,
  audioUrl,
  eleveLabsIsLoading,
  elevenLabsError,
  playNextSpotifyTrack,
  pauseSpotify,
  playSpotify
) {
  const [autoPlayCommentary, setAutoPlayCommentary] = useState(false);
  const [isAudioCommentaryPlaying, setIsAudioCommentaryPlaying] =
    useState(false);

  const audioRef = useRef(null);

  // cleanup function to stop audio and remove event listeners
  const cleanupAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current = null;
    }
  }, []);

  const playCommentaryAudio = useCallback(() => {
    console.log("Playing commentary audio");

    // if audio is already playing, don't start another instance
    if (isAudioCommentaryPlaying) return;

    // pause Spotify before playing commentary
    playNextSpotifyTrack();
    pauseSpotify();

    // clean up any existing audio first
    cleanupAudio();

    // create and save the audio instance
    audioRef.current = new Audio(audioUrl);

    // setup event handlers
    audioRef.current.onended = () => {
      console.log("Commentary audio ended");
      playSpotify();
      setTimeout(() => {
        setIsAudioCommentaryPlaying(false);
        cleanupAudio();
      }, 1000);
    };

    audioRef.current.onerror = () => {
      console.error("Error playing audio commentary");
      playSpotify();
      setTimeout(() => {
        setIsAudioCommentaryPlaying(false);
        cleanupAudio();
      }, 1000);
    };

    // play the audio and update state
    audioRef.current.play();
    setIsAudioCommentaryPlaying(true);
  }, [
    isAudioCommentaryPlaying,
    playNextSpotifyTrack,
    pauseSpotify,
    cleanupAudio,
    audioUrl,
    playSpotify,
  ]);

  // detect when a song ends and auto-play commentary if enabled
  useEffect(() => {
    // if auto-play is enabled, the song has reached its end, commentary isn't already playing,
    // elevenlabs is not loading, and there's no error...
    if (
      autoPlayCommentary &&
      trackProgress >= trackDuration - 3000 &&
      !isAudioCommentaryPlaying &&
      !eleveLabsIsLoading &&
      !elevenLabsError &&
      !audioRef.current // Only play if no audio instance exists
    ) {
      console.log("Conditions met for playing commentary audio");
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

  // clean up audio on unmount
  useEffect(() => {
    return () => {
      cleanupAudio();
    };
  }, [cleanupAudio]);

  return {
    autoPlayCommentary,
    setAutoPlayCommentary,
    isAudioCommentaryPlaying,
  };
}
