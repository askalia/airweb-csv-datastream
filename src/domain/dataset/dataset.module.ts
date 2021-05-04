import { Module } from '@nestjs/common';
import { PrismaService } from 'src/common/providers/db/prisma.service';
import { DatasetFetcherService } from './dataset.service';
import { DatasetController } from '../../api/rest/controllers/dataset.controller';
import { FormatterFactoryService } from 'src/common/providers/serializers/formatter/formatter.factory';
import { CommonModule } from 'src/common/providers/common.module';

@Module({
  imports: [CommonModule],
  providers: [DatasetFetcherService, PrismaService, FormatterFactoryService],
  controllers: [DatasetController],
})
export class DatasetModule {}
