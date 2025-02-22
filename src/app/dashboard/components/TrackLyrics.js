
const TrackLyrics = ({ lyrics, isLoading, error }) => {

  return (
    <div className="bg-white/5 rounded-lg p-6 mt-8">
      <h2 className="text-2xl font-bold mb-4">Lyrics</h2>

      {isLoading && (
        <div className="text-gray-300 animate-pulse">Loading lyrics...</div>
      )}

      {error && <div className="text-red-400">{error}</div>}

      {lyrics && (
        <div className="whitespace-pre-wrap text-gray-300 font-light leading-relaxed">
          {lyrics}
        </div>
      )}
    </div>
  );
};

export default TrackLyrics;
