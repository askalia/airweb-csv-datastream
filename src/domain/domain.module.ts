import { Module } from '@nestjs/common';

import { FormatterRegistry } from './formatter/formatter-registry.service';
import { DatasetRegistry } from './dataset/dataset-registry.service';

import { CommonModule } from 'src/common/providers/common.module';
import { PrismaService } from 'src/common/providers/db/prisma.service';

@Module({
  providers: [DatasetRegistry, FormatterRegistry],
  imports: [CommonModule],
  exports: [DatasetRegistry, FormatterRegistry],
})
export class DomainModule {}
