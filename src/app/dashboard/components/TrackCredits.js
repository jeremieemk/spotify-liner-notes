const TrackCredits = ({ releaseData, songName, year, country }) => (
  <div className="bg-white/5 rounded-lg p-6">
    <h2 className="text-xl font-bold mb-4">
      {releaseData && (
        <span className="text-sm font-normal text-gray-400 ml-2">
          ({year} • {country})
        </span>
      )}
    </h2>
    {renderTrackCredits(releaseData, songName) || (
      <p className="text-gray-400">No credits found</p>
    )}
  </div>
);

export default TrackCredits;

const renderTrackCredits = (releaseData, songName) => {

  if (!releaseData) return null;

  const tracklistItem = releaseData.tracklist.find(
    (track) => track.title.toLowerCase() === songName.toLowerCase()
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
