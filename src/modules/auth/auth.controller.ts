import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { SpotifyService } from 'src/modules/spotify/spotify.service';
import { v4 as uuidv4 } from 'uuid';

@Controller('auth')
export class AuthController {
  constructor(private readonly spotifyService: SpotifyService) {}

  @Get('/login')
  login(@Req() req: Request, @Res() res: Response) {
    const spotifyApi = this.spotifyService.getClient();

    const scopes = process.env.SPOTIFY_SCOPES!.split(' ');
    const state = uuidv4();

    req.session.state = state;

    const authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);

    res.redirect(authorizeURL);
  }

  @Get('/callback')
  async callback(@Req() req: Request, @Res() res: Response) {
    const spotifyApi = this.spotifyService.getClient();

    const { code, state } = req.query;

    if (state !== req.session.state) {
      return res.status(403).send('State mismatch');
    }

    try {
      const data = await spotifyApi.authorizationCodeGrant(code as string);
      const { access_token, refresh_token } = data.body;

      spotifyApi.setAccessToken(access_token);
      spotifyApi.setRefreshToken(refresh_token);

      req.session.accessToken = access_token;
      req.session.refreshToken = refresh_token;

      res.status(200).send('Successfully authenticated');
    } catch {
      res.status(500).send('Error during authentication');
    }
  }

  @Get('/logout')
  logout(@Req() req: Request, @Res() res: Response) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send('Error during logout');
      }
    });

    res.status(200).send('Logged out');
  }
}
