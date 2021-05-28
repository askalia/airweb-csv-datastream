import { Module } from '@nestjs/common';
import { ExportModule } from '../export.module';
import { CommonModule } from '../common/common.module';
import { DatasetController, FormatsController } from './controllers';

@Module({
  imports: [CommonModule, ExportModule],
  providers: [],
  controllers: [DatasetController, FormatsController],
})
export class ApiRestModule {}
