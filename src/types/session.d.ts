import SpotifyWebApi from 'spotify-web-api-node';

declare module 'express-session' {
  interface SessionData {
    state: string;
    accessToken: string;
    refreshToken: string;
    spotifyApi: SpotifyWebApi;
  }
}
