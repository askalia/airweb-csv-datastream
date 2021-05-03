import { Module } from '@nestjs/common';
import { PrismaService } from 'src/common/services/db/prisma.service';
import { DatasetService } from './dataset.service/dataset.service';

@Module({
  imports: [PrismaService],
  providers: [DatasetService],
})
export class DatasetModule {}
