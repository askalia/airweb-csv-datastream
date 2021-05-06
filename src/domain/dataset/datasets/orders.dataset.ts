import { Prisma } from '.prisma/client';
import { IDataset, IFetchOptions } from '../models/dataset.abstract.model';
import { Snapshot } from '../models/snapshot.model';

export class OrdersDataset extends IDataset {
  static id = 'orders';
  static description = 'retrieves Orders, limited to 100 records';

  async fetch(options: IFetchOptions): Promise<Snapshot> {
    const whereClause: Prisma.OrderWhereInput = {};
    this._stream = await this.orm.order.findMany({
      where: whereClause,
      take: options?.filters?.limit || IDataset.RECORDS_DEFAULT_LIMIT,
      orderBy: options?.orderBy || undefined,
    });
    return this._stream;
  }
}
