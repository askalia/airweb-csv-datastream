import { Module } from '@nestjs/common';
import { CommonModule } from './common/providers/common.module';
import { DomainModule } from './domain/domain.module';
import { ApiRestModule } from './api/rest/api-rest.module';

@Module({
  imports: [CommonModule, DomainModule, ApiRestModule],
})
export class AppModule {}
