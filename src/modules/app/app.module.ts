import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { TrackModule } from '../track/track.module';
import { SpotifyModule } from '../spotify/spotify.module';
import { SpotifyMiddleware } from 'src/middlewares/spotifyMiddleware';

@Module({
  imports: [AuthModule, SpotifyModule, TrackModule],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SpotifyMiddleware).forRoutes('track');
  }
}
