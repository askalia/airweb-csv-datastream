import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/providers/common.module';
import { FormatterFactoryService } from '../../common/providers/serializers/formatter/formatter.factory';
import { DatasetFetcherService } from '../../domain/dataset';
import { DomainModule } from '../../domain/domain.module';
import { FormatsService } from '../../domain/formats';
import { DatasetController, FormatsController } from './controllers';

@Module({
  imports: [DomainModule, CommonModule],
  providers: [DatasetFetcherService, FormatsService, FormatterFactoryService],
  controllers: [DatasetController, FormatsController],
})
export class ApiRestModule {}
