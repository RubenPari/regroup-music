import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { SpotifyService } from 'src/modules/spotify/spotify.service';

@Injectable()
export class SpotifyMiddleware implements NestMiddleware {
  constructor(private readonly spotifyService: SpotifyService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.session.accessToken;

    if (!accessToken) {
      return res.status(401).send('Access token not found');
    }

    const spotifyApi = this.spotifyService.getClient();
    spotifyApi.setAccessToken(accessToken);

    req.spotifyApi = spotifyApi;

    next();
  }
}
