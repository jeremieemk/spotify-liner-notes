import React, { useEffect } from "react";
import { Play, Pause, SkipForward, SkipBack } from "lucide-react";

// Custom hook for Spotify controls
const useSpotifyControls = (token) => {
  const handlePlayback = async (action) => {
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/me/player/${action}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to ${action}`);
      }
    } catch (error) {
      console.error(`Spotify control error:`, error);
    }
  };

  const handleSkip = async (direction) => {
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/me/player/${direction}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to skip ${direction}`);
      }
    } catch (error) {
      console.error(`Spotify control error:`, error);
    }
  };

  return {
    play: () => handlePlayback("play"),
    pause: () => handlePlayback("pause"),
    next: () => handleSkip("next"),
    previous: () => handleSkip("previous"),
  };
};

const SpotifyControls = ({
  token,
  isPlaying = false,
  isAudioCommentaryPlaying,
}) => {
  const controls = useSpotifyControls(token);

  useEffect(() => {
    if (isAudioCommentaryPlaying && isPlaying) {
      controls.pause();
    } else if (!isAudioCommentaryPlaying && !isPlaying) {
      controls.play();
    }
  }, [controls, isAudioCommentaryPlaying, isPlaying]);

  return (
    <div className="flex items-center justify-center gap-4 mt-4 mb-6">
      <button
        onClick={controls.previous}
        className="p-2 hover:bg-gray-800 rounded-full transition-colors"
        aria-label="Previous track"
      >
        <SkipBack className="w-6 h-6" />
      </button>

      <button
        onClick={isPlaying ? controls.pause : controls.play}
        className="p-3 hover:bg-gray-800 rounded-full transition-colors"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <Pause className="w-8 h-8" />
        ) : (
          <Play className="w-8 h-8" />
        )}
      </button>

      <button
        onClick={controls.next}
        className="p-2 hover:bg-gray-800 rounded-full transition-colors"
        aria-label="Next track"
      >
        <SkipForward className="w-6 h-6" />
      </button>
    </div>
  );
};

export default SpotifyControls;
