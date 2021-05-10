import { Module } from '@nestjs/common';
import { DomainModule } from 'src/domain/domain.module';
import { CommonModule } from '../../common/common.module';
import { DatasetService } from '../../domain/dataset/dataset.service';
import { FormatterService } from '../../domain/formatter';
import { DatasetController, FormatsController } from './controllers';

@Module({
  imports: [CommonModule, DomainModule],
  providers: [],
  controllers: [DatasetController, FormatsController],
})
export class ApiRestModule {}
