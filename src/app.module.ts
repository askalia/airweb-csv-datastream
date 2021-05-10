import { Module } from '@nestjs/common';
import { DomainModule } from './domain/domain.module';
import { ApiRestModule } from './api/rest/api-rest.module';

@Module({
  imports: [DomainModule, ApiRestModule],
  providers: [
    {
      provide: 'HTTP_PORT',
      useValue: process.env.HTTP_PORT,
    },
  ],
})
export class AppModule {}
