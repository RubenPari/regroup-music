import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { TrackModule } from '../track/track.module';
import { SpotifyModule } from '../spotify/spotify.module';
import { SpotifyMiddleware } from 'src/middlewares/spotifyMiddleware';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [AuthModule, SpotifyModule, TrackModule, ConfigModule.forRoot()],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SpotifyMiddleware).forRoutes('track');
  }
}
