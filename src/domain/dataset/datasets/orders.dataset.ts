import { Prisma } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { IDataset, IDatasetFetchOptions } from '../models';
import { DatasetProvider } from '../dataset.decorator';
import { Snapshot } from '../models/snapshot.model';

@Injectable()
@DatasetProvider({
  id: 'orders',
  description: 'retrieves Orders, limited to 100-first records',
})
export class OrdersDataset extends IDataset {
  async fetch(
    options: IDatasetFetchOptions<OrdersDatasetFilters>,
  ): Promise<Snapshot> {
    this._checkSetup();

    this._stream = await (this?._orm || {}).order.findMany({
      where: this.where<OrdersDatasetFilters>(options?.filters),
      take: options?.limit || IDataset.RECORDS_DEFAULT_LIMIT,
      orderBy: options?.orderBy || undefined,
      select: {
        id: true,
        code: true,
        userId: true,
        networkId: true,
        taxFreeTotal: true,
        total: true,
        user: {
          select: {
            firstname: true,
            lastname: true,
          },
        },
      },
    });
    return this._stream;
  }
}

export type OrdersDatasetFilters = Prisma.OrderWhereInput;
