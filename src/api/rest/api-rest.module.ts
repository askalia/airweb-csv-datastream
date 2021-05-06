import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/providers/common.module';
import { DatasetRegistry } from 'src/domain/dataset/dataset-registry.service';
import { FormatterRegistry } from 'src/domain/formatter';
import { DomainModule } from '../../domain/domain.module';
import { DatasetController, FormatsController } from './controllers';

@Module({
  imports: [CommonModule],
  providers: [DatasetRegistry, FormatterRegistry],
  controllers: [DatasetController, FormatsController],
  exports: [],
})
export class ApiRestModule {}
