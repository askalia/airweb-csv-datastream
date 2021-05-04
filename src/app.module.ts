import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/providers/common.module';
import { DatasetModule } from './domain/dataset/dataset.module';

@Module({
  imports: [CommonModule, DatasetModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
