import { useSongData } from "../../context/SongDataContext";

const TrackDiscogsCredits = () => {
  const { discogsCredits, song } = useSongData();
  const releaseData = discogsCredits?.release;

  const creditsContent = renderTrackCredits(releaseData, song);
  if (!creditsContent) return null;

  return (
    <div className="bg-white/5 rounded-lg p-6 mt-6">
      <h2 className="text-2xl font-bold mb-4">Discogs Details</h2>
      {creditsContent}
    </div>
  );
};

export default TrackDiscogsCredits;

const renderTrackCredits = (releaseData, song) => {
  if (!releaseData) return null;

  const tracklistItem = releaseData.tracklist.find(
    (track) => track.title.toLowerCase() === song.toLowerCase()
  );

  const trackCredits = tracklistItem?.extraartists;
  const albumCredits = releaseData?.extraartists;
  if (!trackCredits?.length && !albumCredits?.length) return null;

  return (
    <div className="mt-4">
      {trackCredits?.length && (
        <>
          <h3 className="text-lg font-semibold text-white my-4">
            Track Credits
          </h3>
          <ul className="space-y-2">
            {trackCredits?.map((artist, index) => (
              <li key={index} className="text-gray-300">
                <span className="font-semibold text-white">
                  {artist.role}:{" "}
                </span>
                {artist.name}
              </li>
            ))}
          </ul>
        </>
      )}
      {albumCredits?.length && (
        <>
          <h3 className="text-lg font-semibold text-white my-4">
            Album Credits
          </h3>
          <ul className="space-y-2">
            {albumCredits?.map((artist, index) => (
              <li key={index} className="text-gray-300">
                <span className="font-semibold text-white">
                  {artist.role}:{" "}
                </span>
                {artist.name}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};
