import { Module } from '@nestjs/common';
import { PrismaService } from 'src/common/providers/db/prisma.service';
import { DatasetController } from '../../api/rest/controllers/dataset.controller';
import { CommonModule } from 'src/common/providers/common.module';
import { FormatsService } from './formats.service';

@Module({
  imports: [CommonModule],
  providers: [PrismaService, FormatsService],
  controllers: [DatasetController],
})
export class FormatsModule {}
