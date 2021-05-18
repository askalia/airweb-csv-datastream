import { Module } from '@nestjs/common';
import { DomainModule } from '../../domain/domain.module';
import { CommonModule } from '../../common/common.module';
import { DatasetController, FormatsController } from './controllers';

@Module({
  imports: [CommonModule, DomainModule],
  providers: [],
  controllers: [DatasetController, FormatsController],
})
export class ApiRestModule {}
