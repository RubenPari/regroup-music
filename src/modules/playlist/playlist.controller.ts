import { Controller, Post, Res } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { TrackService } from '../track/track.service';
import { Response } from 'express';

@Controller('playlist')
export class PlaylistController {
  constructor(
    private readonly playlistService: PlaylistService,
    private readonly trackService: TrackService,
  ) {}

  @Post('/create-playlist-track-minor')
  async createPlaylistTrackMinor(@Res() res: Response) {
    const totalUserTracks = await this.trackService.getAllUserTracks();

    const created =
      await this.playlistService.createPlaylistTracksMinor(totalUserTracks);

    if (!created) {
      res.status(400).send({
        message: 'Failed to create playlist with minor tracks',
      });
    }

    res.status(200).send({
      message: 'Playlist with minor tracks created successfully',
    });
  }
}
