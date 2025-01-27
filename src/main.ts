import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    session({
      secret: process.env.SESSION_SECRET!,
      resave: false,
      saveUninitialized: false,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap().then(() => console.log('Server is running!'));
