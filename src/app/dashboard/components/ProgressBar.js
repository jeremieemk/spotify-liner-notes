import classNames from "classnames";
import { useSongData } from "../../context/SongDataContext";
import { usePlayback } from "../../context/PlaybackContext";

const ProgressBar = ({ className }) => {
  const { spotifyData } = useSongData();
  const { trackProgress } = usePlayback();

  const duration = spotifyData?.duration_ms || 100;
  const progress = trackProgress || 0;
  
  // Calculate percentage of track played
  const widthPercentage = Math.min(100, Math.max(0, (progress / duration) * 100));
  
  // Format time for display
  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="mb-2">
      <div
        className={classNames(
          "w-full border-black border-2 focus:outline-none h-9 overflow-hidden shadow-[2px_2px_0px_rgba(0,0,0,1)] bg-white mb-2",
          className
        )}
      >
        <div
          style={{ width: widthPercentage + "%" }}
          className="h-full bg-yellow-200 hover:bg-yellow-300 flex flex-row items-center justify-end overflow-hidden"
        >
          <h1
            className={classNames(
              "mr-2",
              widthPercentage !== 100 ? "font-bold" : "font-black",
              widthPercentage !== 100 ? "opacity-80" : "opacity-100"
            )}
          >
            {Math.round(widthPercentage)}%
          </h1>
        </div>
      </div>
      
      {/* Time display */}
      <div className="flex justify-between text-xs text-gray-300">
        <span>{formatTime(progress)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
};

export default ProgressBar;
