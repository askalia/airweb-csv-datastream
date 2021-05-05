import { PrismaClient } from '.prisma/client';
import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/providers/common.module';
import { PrismaService } from '../common/providers/db/prisma.service';
import { DatasetFetcherService, DatasetModule } from './dataset';
import { FormatsModule, FormatsService } from './formats';

@Module({
  providers: [],
  imports: [PrismaClient, DatasetModule],
  exports: [],
})
export class DomainModule {}
