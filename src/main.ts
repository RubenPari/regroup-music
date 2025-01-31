import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import session from 'express-session';
import { RedisStore } from 'connect-redis';
import { createClient } from 'redis';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const redisClient = createClient({
    url: process.env.REDIS_URL!,
  });

  redisClient.connect().catch((error) => {
    console.error('Error connecting to Redis');
    console.error(error);
  });

  const redisStore = new RedisStore({
    client: redisClient,
  });

  app.use(
    session({
      store: redisStore,
      resave: false,
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET!,
      cookie: { secure: true },
    }),
  );

  await app.listen(process.env.PORT!);
}

void bootstrap().then(() => console.log('Server is running!'));
