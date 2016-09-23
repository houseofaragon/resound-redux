import * as actionTypes from '../../constants/actionTypes';

const initialState = {};

export default function(state = initialState, action) {
  switch (action.type) {
    case actionTypes.MERGE_ARTIST_ACTIVITIES:
      return mergeActivities(state, action.activities, action.artist);
    case actionTypes.SET_ARTIST_BIO:
      return setArtistBio(state, action);
  }
  return state;
}

function mergeActivities(state, list, artist) {
  const oldList = state[artist] || [];

  const newList = [
    ...oldList,
    ...list
  ];

  const obj = {};
  obj[artist] = newList;

  return Object.assign({}, state, obj);
}

function setArtistBio(state, action) {
  const newState = {}
  Object.assign(newState, state, { bio: action.bio })
  return newState
}
