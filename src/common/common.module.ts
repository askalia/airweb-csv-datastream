import { Module } from '@nestjs/common';
import { PrismaService } from './db/prisma.service';
import { BearerTokenService } from './auth/bearer-token/bearer-token.service';

const services = [PrismaService, BearerTokenService];

@Module({
  providers: services,
  exports: services,
})
export class CommonModule {}
