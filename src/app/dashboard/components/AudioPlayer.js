import React from "react";
import { Play, Pause, RefreshCw } from "lucide-react";

const AudioPlayer = ({
  audioUrl,
  isLoading,
  onRegenerate,
  onPlayingChange,
}) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const audioRef = React.useRef(null);

  // Report playing state to parent component whenever it changes
  React.useEffect(() => {
    if (onPlayingChange) {
      onPlayingChange(isPlaying);
    }
  }, [isPlaying, onPlayingChange]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  React.useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.onended = () => setIsPlaying(false);
      audio.onpause = () => setIsPlaying(false);
      audio.onplay = () => setIsPlaying(true);
    }
  }, [audioUrl]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4 b-6 ">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!audioUrl) {
    return null;
  }

  return (
    <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-lg ">
      <button
        onClick={handlePlayPause}
        className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? <Pause size={24} /> : <Play size={24} />}
      </button>
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      <button
        onClick={onRegenerate}
        className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
        aria-label="Regenerate audio"
      >
        <RefreshCw size={24} />
      </button>
    </div>
  );
};

export default AudioPlayer;
