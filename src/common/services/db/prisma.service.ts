import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Prisma as PrismaNS, PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

export type Prisma = typeof PrismaNS;
