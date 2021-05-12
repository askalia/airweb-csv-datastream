import { Module } from '@nestjs/common';

import { FormatterService } from './formatter/formatter.service';
import { DatasetService } from './dataset/dataset.service';
import { CommonModule } from '../common/common.module';
import { FormatterModule } from './formatter/formatter.module';
import { DatasetModule } from './dataset/dataset.module';

const services = [DatasetService, FormatterService];

@Module({
  providers: services,
  imports: [CommonModule, FormatterModule, DatasetModule],
  exports: services,
})
export class DomainModule {}
