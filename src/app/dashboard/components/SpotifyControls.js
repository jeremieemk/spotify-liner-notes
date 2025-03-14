import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { usePlayback } from "../../context/PlaybackContext";


const SpotifyControls = ({}) => {
  const {
    isPlaying,
    playSpotify,
    pauseSpotify,
    playNextSpotifyTrack,
    playPreviousSpotifyTrack,
  } = usePlayback();

  return (
    <div className="flex items-center justify-center gap-4 mt-4 mb-6">
      <button
        onClick={playPreviousSpotifyTrack}
        className="p-2 hover:bg-gray-800 rounded-full transition-colors"
        aria-label="Previous track"
      >
        <SkipBack className="w-6 h-6" />
      </button>

      <button
        onClick={isPlaying ? pauseSpotify : playSpotify}
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
        onClick={playNextSpotifyTrack}
        className="p-2 hover:bg-gray-800 rounded-full transition-colors"
        aria-label="Next track"
      >
        <SkipForward className="w-6 h-6" />
      </button>
    </div>
  );
};

export default SpotifyControls;
