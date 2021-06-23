import { NestFactory } from '@nestjs/core';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';

import { AppModule } from './app.module';
import { SwaggerService } from './services/swagger.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
  );

  const swagger = app.get(SwaggerService);

  swagger.init(app);
  app.use(swagger.assetsMiddleware);

  await app.listen(process.env.HTTP_PORT, '0.0.0.0');
}
bootstrap();
