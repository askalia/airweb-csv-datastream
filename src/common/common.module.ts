import { HttpModule, Module } from '@nestjs/common';
import { PrismaService } from './db/prisma.service';
import { AuthApiService } from './auth/auth-api.service';

const services = [PrismaService, AuthApiService];

@Module({
  imports: [HttpModule],
  providers: services,
  exports: services,
})
export class CommonModule {}
