//creates the action for setting a playlist
export function setPlaylist(songs) {
  return {
    type: 'SET_PLAYLIST',
    songs
  };
};