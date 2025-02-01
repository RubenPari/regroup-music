import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { TrackModule } from '../track/track.module';
import { SpotifyModule } from '../spotify/spotify.module';
import { SpotifyMiddleware } from 'src/middlewares/spotifyMiddleware';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';

@Module({
  imports: [
    AuthModule,
    SpotifyModule,
    TrackModule,
    ConfigModule.forRoot(),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        store: await redisStore({
          socket: {
            url: process.env.REDIS_URL!,
          },
          ttl: 600,
        }),
      }),
    }),
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SpotifyMiddleware).forRoutes('track');
  }
}
