import { useSongData } from "../../context/SongDataContext";

const TrackLyrics = () => {
  const { lyrics } = useSongData();
  
  // Don't render anything if there are no lyrics
  if (!lyrics) return null;

  // Process lyrics to remove empty lines
  const processedLyrics = lyrics
    .split('\n')
    .filter(line => line.trim() !== '')
    .join('\n');

  return (
    <div className="bg-white/5 rounded-lg p-6 mt-8">
      <h2 className="text-2xl font-bold mb-4">Lyrics</h2>
      <div className="whitespace-pre-wrap text-gray-300 font-light leading-relaxed">
        {processedLyrics}
      </div>
    </div>
  );
};

export default TrackLyrics;
