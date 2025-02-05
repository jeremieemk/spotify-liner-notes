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
    return { artist: cleanArtistName, song: cleanTrackName };
  }
  