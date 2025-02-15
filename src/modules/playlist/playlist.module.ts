import { Module } from '@nestjs/common';
import { PlaylistController } from './playlist.controller';
import { PlaylistService } from './playlist.service';
import { SpotifyModule } from '../spotify/spotify.module';
import { TrackModule } from '../track/track.module';

@Module({
  controllers: [PlaylistController],
  providers: [PlaylistService],
  imports: [SpotifyModule, TrackModule],
})
export class PlaylistModule {}
