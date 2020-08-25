export const initialState = {
  currentTrack: null,
  currentAlbum: null,
};

export function currentTrackReducer(state = initialState, action) {
  switch (action.type) {
    case "FETCH_CURRENT_TRACK":
      return { ...state, currentTrack: action.currentTrack };
    case "FETCH_CURRENT_ALBUM":
      return { ...state, currentAlbum: action.currentAlbum };
    default:
      return state;
  }
}
