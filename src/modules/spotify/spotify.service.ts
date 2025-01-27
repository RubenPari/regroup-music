import { Injectable } from '@nestjs/common';
import SpotifyApi from 'spotify-web-api-node';

@Injectable()
export class SpotifyService {
  private readonly client: SpotifyApi;

  constructor() {
    this.client = new SpotifyApi({
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
      redirectUri: process.env.SPOTIFY_REDIRECT_URI!,
    });
  }

  getClient() {
    return this.client;
  }
}
