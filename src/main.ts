import { NestFactory } from '@nestjs/core';
/*import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
*/
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import { setupSwagger } from './api-rest/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
  );

  setupSwagger(app);

  await app.listen(process.env.HTTP_PORT, '0.0.0.0');
}
bootstrap();
