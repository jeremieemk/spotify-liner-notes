export function getCurrentTrack(currentTrack) {
  return {
    type: "FETCH_CURRENT_TRACK",
    currentTrack: currentTrack,
  };
}
export function getCurrentAlbum(currentAlbum) {
  return {
    type: "FETCH_CURRENT_ALBUM",
    currentAlbum: currentAlbum,
  };
}
