import { Module } from '@nestjs/common';

import { FormatterService } from './formatters/formatter.service';
import { DatasetService } from './datasets/dataset.service';
import { CommonModule } from './common/common.module';
import { FormatterModule } from './formatters/formatter.module';
import { DatasetModule } from './datasets/dataset.module';
import { FilterService } from './datasets/filter/filter.service';

const services = [DatasetService, FormatterService, FilterService];

@Module({
  providers: services,
  imports: [CommonModule, FormatterModule, DatasetModule],
  exports: services,
})
export class ExportModule {}
