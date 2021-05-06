import { Module } from '@nestjs/common';
import { DomainModule } from './domain/domain.module';

import { ApiRestModule } from './api/rest/api-rest.module';
//import { DatasetController } from './api/rest/controllers';

@Module({
  imports: [DomainModule, ApiRestModule],
})
export class AppModule {}
