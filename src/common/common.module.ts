import { Module } from '@nestjs/common';
import { PrismaService } from './services/db/prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class CommonModule {}
