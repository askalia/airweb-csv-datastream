import { Module } from '@nestjs/common';

import { FormatterService } from './formatter/formatter.service';
import { DatasetService } from './dataset/dataset.service';
import { CommonModule } from '../common/common.module';
import { FormatterModule } from './formatter/formatter.module';
import { DatasetModule } from './dataset/dataset.module';
import { FilterModule } from './filter/filter.module';
import { FilterService } from './filter/filter.service';

const services = [DatasetService, FormatterService, FilterService];

@Module({
  providers: services,
  imports: [CommonModule, FormatterModule, DatasetModule, FilterModule],
  exports: services,
})
export class DomainModule {}
