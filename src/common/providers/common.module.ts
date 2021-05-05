import { Module } from '@nestjs/common';
import { PrismaService } from './db/prisma.service';
import { FormatterFactoryService } from './serializers/formatter/formatter.factory';
import { registerAllFormatters } from './serializers/formatter/helpers/formatters-registry';

@Module({
  providers: [PrismaService, FormatterFactoryService],
  exports: [PrismaService, FormatterFactoryService],
})
export class CommonModule {
  constructor() {
    registerAllFormatters();
  }
}
