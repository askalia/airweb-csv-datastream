import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { DatasetModule } from './resources/dataset/dataset.module';

@Module({
  imports: [CommonModule, DatasetModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
