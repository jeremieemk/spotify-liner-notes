export function getCleanTrackDetails(spotifyData) {
  if (!spotifyData) return { artist: "", song: "" };

  const regex = /\s*\([^)]*\)/g;
  const cleanTrackName = spotifyData.name.includes("-")
    ? spotifyData.name
        .replace(regex, "")
        .replaceAll("&", "")
        .substring(0, spotifyData.name.indexOf("-"))
    : spotifyData.name.replace(regex, "").replaceAll("&", "");

  const cleanArtistName = spotifyData.artists[0].name.replaceAll("&", "and");
  const cleanAlbumName = spotifyData.album?.name.replaceAll("&", "and");

  return {
    artist: cleanArtistName,
    song: cleanTrackName,
    album: cleanAlbumName,
  };
}

export const getMaxCredits = (
  { mostWantedRelease, oldestRelease },
  songName
) => {
  // Helper function to count total credits for a release
  const getTotalCredits = (release) => {
    if (!release?.tracklist) return 0;

    const trackCredits = countCredits(release.tracklist, songName);
    const albumCredits = release.extraartists?.length || 0;

    return trackCredits + albumCredits;
  };

  // Count credits for both releases
  const mostWantedCredits = getTotalCredits(mostWantedRelease);
  const oldestCredits = getTotalCredits(oldestRelease);

  // Determine which release has more credits
  const releaseWithMostCredits =
    mostWantedCredits >= oldestCredits ? mostWantedRelease : oldestRelease;

  // Format the credits for display
  const formattedCredits = formatCredits(releaseWithMostCredits, songName);

  return {
    release: releaseWithMostCredits,
    credits: formattedCredits,
    totalCredits: Math.max(mostWantedCredits, oldestCredits),
  };
};

/**
 * Utility functions for credit processing
 */
const countCredits = (tracklist, songName) => {
  const track = tracklist.find(
    (track) => track.title?.toLowerCase() === songName?.toLowerCase()
  );
  return track?.extraartists?.length || 0;
};

const formatCredits = (release, songName) => {
  if (!release?.tracklist) return { albumCredits: [], trackCredits: [] };

  const track = release.tracklist.find(
    (track) => track.title.toLowerCase() === songName?.toLowerCase()
  );

  return {
    albumCredits: release.extraartists || [],
    trackCredits: track?.extraartists || [],
  };
};
