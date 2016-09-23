import { arrayOf, normalize } from 'normalizr';
import trackSchema from '../../schemas/track';
import * as actionTypes from '../../constants/actionTypes';
import * as requestTypes from '../../constants/requestTypes';
import { unauthApiUrl } from '../../services/api';
import { setRequestInProcess } from '../../actions/request';
import { setPaginateLink } from '../../actions/paginate';
import { mergeEntities } from '../../actions/entities';

function mergeActivitiesByArtist(activities, artist) {
  return {
    type: actionTypes.MERGE_ARTIST_ACTIVITIES,
    activities,
    artist
  }
}

function setArtistBio(bio) {
  return {
    type: actionTypes.SET_ARTIST_BIO,
    bio
  }
}

export const fetchArtistBio = (nextHref, artist) => (dispatch) => {
  const artistUrl = `http://soundcloud.com/${artist}`;
  const resolveUrl = 'resolve?url=' + artistUrl;
  const requestType = requestTypes.ARTISTS;
  const initHref = unauthApiUrl(resolveUrl, '&');
  const url = nextHref || initHref;

  return fetch(url)
    .then(resolved => fetch(resolved.url))
    .then(body => body.json())
    .then(data => {
      const bio = data.description || ''
      dispatch(setArtistBio(bio))
      dispatch(setRequestInProcess(false, requestType))
    })
}

export const fetchActivitiesByArtist = (nextHref, artist) => (dispatch, getState) => {
  const requestType = requestTypes.ARTISTS;
  const initHref = unauthApiUrl(`tracks?linked_partitioning=1&limit=10&offset=0&tags=${artist}`, '&');
  const url = nextHref || initHref;
  const requestInProcess = getState().request[requestType];
  if (requestInProcess) { return; }

  dispatch(setRequestInProcess(true, requestType));

  return fetch(url)
    .then(response => response.json())
    .then(data => {
      const normalized = normalize(data.collection, arrayOf(trackSchema));
      dispatch(mergeEntities(normalized.entities));
      dispatch(mergeActivitiesByArtist(normalized.result, artist));
      dispatch(setPaginateLink(data.next_href));
      dispatch(setRequestInProcess(false, requestType));
    });
};
