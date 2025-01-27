import { SpotifyWebApi } from 'spotify-web-api-node';

declare global {
  namespace Express {
    interface Request {
      spotifyApi?: SpotifyWebApi;
    }
  }
}
