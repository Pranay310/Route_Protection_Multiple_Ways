import { NestFactory } from '@nestjs/core';
import * as session from 'express-session';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // express-session middleware
  // This stores sessions on server side and attaches session object to req.
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'change_this_secret',

      // Forces session to be saved even if not modified (usually false)
      resave: false,

      // Do not create session until something stored
      saveUninitialized: false,

      // Cookie configuration
      cookie: {
        // If true, cookie cannot be accessed by JavaScript (security)
        httpOnly: true,

        // Enable secure cookies in production (HTTPS)
        secure: process.env.NODE_ENV === 'production',

        // Lifetime of session cookie in ms (example: 1 day)
        maxAge: 1000 * 60 * 60 * 24,
      },
    }),
  );

  await app.listen(3000);
}
bootstrap();
