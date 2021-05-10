import { Prisma } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { IDataset, IDatasetFetchOptions } from '../models';
import { DatasetProvider } from '../dataset.decorator';
import { Snapshot } from '../models/snapshot.model';

@Injectable()
@DatasetProvider()
export class OrdersDataset extends IDataset {
  static id = 'orders';
  static description = 'retrieves Orders, limited to 100-first records';

  async fetch(options: IDatasetFetchOptions): Promise<Snapshot> {
    const whereClause: Prisma.OrderWhereInput = {};

    this._stream = await this.orm.order.findMany({
      where: whereClause,
      take: options?.filters?.limit || IDataset.RECORDS_DEFAULT_LIMIT,
      orderBy: options?.orderBy || undefined,
    });
    return this._stream;
  }
}
