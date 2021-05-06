import { Module } from '@nestjs/common';
import { PrismaService } from './db/prisma.service';

@Module({
  imports: [],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class CommonModule {}
