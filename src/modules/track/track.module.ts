import { Module } from '@nestjs/common';
import { TrackController } from './track.controller';
import { TrackService } from './track.service';
import { SpotifyModule } from '../spotify/spotify.module';

@Module({
  controllers: [TrackController],
  providers: [TrackService],
  imports: [SpotifyModule],
})
export class TrackModule {}
