import { Prisma } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { IDataset, IDatasetFetchOptions } from '../models';
import { DatasetProvider } from '../dataset.decorator';
import { Snapshot } from '../models/snapshot.model';
import { ModuleRef } from '@nestjs/core';
import { PrismaService } from '../../../common/db/prisma.service';

@Injectable()
@DatasetProvider({
  id: 'orders',
  description: 'retrieves Orders, limited to 100-first records',
})
export class OrdersDataset extends IDataset {
  async fetch(options: IDatasetFetchOptions): Promise<Snapshot> {
    if (!(this._orm instanceof PrismaService)) {
      throw new Error('ORM is not set. Please check platform setup');
    }
    const whereClause: Prisma.OrderWhereInput = {};

    this._stream = await (this?._orm || {}).order.findMany({
      where: whereClause,
      take: options?.filters?.limit || IDataset.RECORDS_DEFAULT_LIMIT,
      orderBy: options?.orderBy || undefined,
    });
    return this._stream;
  }
}
