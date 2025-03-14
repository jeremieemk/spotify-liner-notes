import { useSongData } from "../../context/SongDataContext";

const TrackInfo = () => {
  const { spotifyData, artist, song } = useSongData();

  return (
    <div className="flex flex-col md:flex-row gap-8 items-center mb-8">
      {spotifyData.album?.images?.[0]?.url && (
        <img
          src={spotifyData.album.images[0].url}
          alt={`${song} album art`}
          className="w-64 h-64 rounded-lg shadow-2xl"
        />
      )}
      <div className="flex-1">
        <h1 className="text-4xl font-bold mb-2">{song}</h1>
        <h2 className="text-2xl text-gray-300 mb-4">{artist}</h2>

        <div className="space-y-2 text-gray-400">
          <p>Album: {spotifyData.album?.name}</p>
          <p>Release Date: {spotifyData.album?.release_date}</p>
          <p>
            Duration: {Math.floor(spotifyData.duration_ms / 1000 / 60)}:
            {String(Math.floor((spotifyData.duration_ms / 1000) % 60)).padStart(
              2,
              "0"
            )}
          </p>
        </div>

        {spotifyData.preview_url && (
          <div className="mt-6">
            <audio controls src={spotifyData.preview_url} className="w-full">
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackInfo;
