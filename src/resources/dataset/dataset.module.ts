import { Module } from '@nestjs/common';
import { PrismaService } from 'src/common/services/db/prisma.service';
import { DatasetService } from '../dataset.service';
import { DatasetController } from './dataset.controller';

@Module({
  imports: [PrismaService],
  providers: [DatasetService, PrismaService],
  controllers: [DatasetController],
})
export class DatasetModule {}
