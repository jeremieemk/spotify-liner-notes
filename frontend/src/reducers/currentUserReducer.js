export const initialState = {
  token: null,
};

export function currentUserReducer(state = initialState, action) {
  switch (action.type) {
    case "FETCH_ALBUMS":
      console.log(state, action.albums);
      return { ...state, albums: action.albums };
    default:
      return state;
  }
}
