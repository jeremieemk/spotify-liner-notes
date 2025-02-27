import React from "react";
import { useElevenLabs } from "../../hooks/useElevenLabs";
import AudioPlayer from "./AudioPlayer";

const TrackAudioContent = ({ llmData, isLoading }) => {
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

      <AudioPlayer
        audioUrl={audioUrl}
        isLoading={audioLoading}
        onRegenerate={handleGenerateAudio}
      />

      {isLoading ? (
        <p className="text-gray-400">Loading ll data...</p>
      ) : !llmData ? (
        <p className="text-gray-400">
          No content available for audio generation
        </p>
      ) : null}
    </div>
  );
};

export default TrackAudioContent;
