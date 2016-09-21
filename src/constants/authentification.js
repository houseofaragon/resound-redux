const isDev = process.env.NODE_ENV === 'development';

export const REDIRECT_URI = isDev ?
  `${window.location.protocol}//${window.location.host}/callback` :
  'http://www.favesound.de/callback';

export const CLIENT_ID = isDev ?
    '9b6081bc7d4148760f08d335953a9d65' :
    '1512fb9cbe8228095fe92c6503e3a071';

export const OAUTH_TOKEN = 'accessToken';
