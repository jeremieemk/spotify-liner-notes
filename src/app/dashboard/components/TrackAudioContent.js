import React from "react";
import { useElevenLabs } from "../../hooks/useElevenLabs";

const TrackAudioContent = ({ 
  llmData, 
  isLoading, 
  onAudioPlayingChange,
  token,
  isSpotifyPlaying 
}) => {
  const {
    generateAudio,
    audioUrl,
    isLoading: audioLoading,
    error,
  } = useElevenLabs();

  const handleGenerateAudio = React.useCallback(() => {
    if (llmData) {
      generateAudio(llmData);
    }
  }, [llmData, generateAudio]);

  // Track the previous Spotify playing state when commentary starts
  const [wasSpotifyPlaying, setWasSpotifyPlaying] = React.useState(false);
  
  // Update this state only when audio commentary starts playing
  React.useEffect(() => {
    if (!audioUrl) return;
  }, [audioUrl]);

  const handleAudioPlayingChange = async (isPlaying) => {
    if (onAudioPlayingChange) {
      onAudioPlayingChange(isPlaying);
    }

    // Only control Spotify if we have a token
    if (!token) return;

    try {
      if (isPlaying) {
        // Store current Spotify state before pausing
        setWasSpotifyPlaying(isSpotifyPlaying);
        
        // Pause Spotify when audio commentary starts
        await fetch("https://api.spotify.com/v1/me/player/pause", {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      } else if (wasSpotifyPlaying) {
        // Resume Spotify only if it was playing before commentary started
        await fetch("https://api.spotify.com/v1/me/player/play", {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }
    } catch (error) {
      console.error("Failed to control Spotify playback:", error);
    }
  };

  return (
    <div className="bg-white/5 rounded-lg p-6 my-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Audio Commentary</h2>
        {llmData && !isLoading && (
          <button
            onClick={handleGenerateAudio}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            disabled={audioLoading}
          >
            {audioLoading ? "Generating..." : "Generate Audio"}
          </button>
        )}
      </div>

      {error && <p className="text-red-400 mb-4">{error}</p>}
{/* 
      <AudioPlayer
        audioUrl={audioUrl}
        isLoading={audioLoading}
        onRegenerate={handleGenerateAudio}
        onPlayingChange={handleAudioPlayingChange}
      /> */}

      {isLoading ? (
        <p className="text-gray-400">Loading voice commentary...</p>
      ) : !llmData ? (
        <p className="text-gray-400">
          Waiting for content for audio generation
        </p>
      ) : null}
    </div>
  );
};

export default TrackAudioContent;