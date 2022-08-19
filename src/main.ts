import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';

import * as dotenv from "dotenv"
import { initStoragePath } from './utils/initStoragePath';
dotenv.config()

async function bootstrap() {

  // check file path if exist
  initStoragePath()

  const app = await NestFactory.create(AppModule);
  app.enableCors();

  app.use(bodyParser.json({limit: '50mb'}));
  app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

  const port = process.env.PORT || 3000
  console.log(`Server start at port ${port}`)
  await app.listen(port);
}
bootstrap();
