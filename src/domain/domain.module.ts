import { Module } from '@nestjs/common';

import { FormatterService } from './formatter/formatter.service';
import { DatasetService } from './dataset/dataset.service';

import { CommonModule } from '../common/common.module';

const services = [DatasetService, FormatterService];

@Module({
  providers: services,
  imports: [CommonModule],
  exports: services,
})
export class DomainModule {}
