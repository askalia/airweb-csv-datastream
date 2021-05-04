import { Module } from '@nestjs/common';
import { PrismaService } from './db/prisma.service';
import { FormatterFactoryService } from './serializers/formatter/formatter.factory';

@Module({
  providers: [PrismaService, FormatterFactoryService],
  exports: [PrismaService],
})
export class CommonModule {}
