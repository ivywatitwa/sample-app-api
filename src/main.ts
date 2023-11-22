import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import session from 'express-session';
import * as passport from "passport";

async function bootstrap() {

  dotenv.config();
  const app = await NestFactory.create(AppModule);
  // app.use(
  //   session({
  //     secret: "keyboard",
  //     resave: false,
  //     saveUninitialized: false,
  //   })
  // )

  app.enableCors({
    origin: 'http://localhost:4200', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    // credentials: true, 
  });

  app.useGlobalGuards()
  
  // app.use(passport.initialize())
  // app.use(passport.session())
  await app.listen(3000);
}
bootstrap();

