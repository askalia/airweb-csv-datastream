import { Module } from '@nestjs/common';

import { DatasetController, FormatsController } from './controllers';

import { CommonModule } from './modules/common';
import { FormatterModule, FormatterService } from './modules/formatters';
import { DatasetModule, DatasetService } from './modules/datasets';
import { FilterService } from './modules/filters';
import { SwaggerService, PackageService } from './services';
import { SwaggerController } from './controllers/swagger.controller';
import { FilterModule } from './modules/filters/filter.module';

@Module({
  providers: [
    DatasetService,
    FormatterService,
    FilterService,
    SwaggerService,
    PackageService,
  ],
  imports: [CommonModule, FormatterModule, DatasetModule, FilterModule],
  controllers: [DatasetController, FormatsController, SwaggerController],
})
export class AppModule {}
