import { Module } from '@nestjs/common';

import { DatasetController, FormatsController } from './controllers';

import { CommonModule } from './modules/common';
import { FormatterModule, FormatterService } from './modules/formatters';
import { DatasetModule, DatasetService } from './modules/datasets';
import { FilterService } from './modules/datasets/filter';
import { SwaggerService, PackageService } from './services';

@Module({
  providers: [
    DatasetService,
    FormatterService,
    FilterService,
    SwaggerService,
    PackageService,
  ],
  imports: [CommonModule, FormatterModule, DatasetModule],
  controllers: [DatasetController, FormatsController],
})
export class AppModule {}
