import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { DatasetService } from '../../domain/dataset/dataset.service';
import { FormatterService } from '../../domain/formatter';
import { DatasetController, FormatsController } from './controllers';

@Module({
  imports: [CommonModule],
  providers: [DatasetService, FormatterService],
  controllers: [DatasetController, FormatsController],
})
export class ApiRestModule {}
