import { Module } from '@nestjs/common';
import { ExportModule } from './export.module';
import { ApiRestModule } from './api-rest/api-rest.module';

@Module({
  imports: [ExportModule, ApiRestModule],
  providers: [
    {
      provide: 'HTTP_PORT',
      useValue: process.env.HTTP_PORT,
    },
  ],
})
export class AppModule {}
