export default function(state, action) {
  switch (action.type) {
    case 'SET_PLAYLIST':
    return setPlaylist(state, action);
  }
  return state;
}

//set the songs for a playlist
function setPlaylist(state, action) {
  const {songs} = action;
  return [...state, ...songs];
}