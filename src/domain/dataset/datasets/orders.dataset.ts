import { Prisma } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { IDataset, IDatasetFetchOptions } from '../models';
import { DatasetProvider } from '../dataset.decorator';
import { Snapshot } from '../models/snapshot.model';
import * as StreamFromPromise from 'stream-from-promise';
import { Readable } from 'node:stream';

@Injectable()
@DatasetProvider({
  id: 'orders',
  description: 'retrieves Orders, limited to 100-first records',
  filterables: ['code', 'status', 'paymentDate'],
})
export class OrdersDataset extends IDataset {
  async fetch(
    options: IDatasetFetchOptions<OrdersDatasetFilters>,
  ): Promise<Snapshot> {
    this._checkSetup();
    return this?._orm?.order.findMany({
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
        /*user: {
          select: {
            firstname: true,
            lastname: true,
          },
        },*/
      },
    });
  }

  fetchAsStream(options: IDatasetFetchOptions<OrdersDatasetFilters>): Readable {
    this._checkSetup();

    const _getDataFetcher = () => {
      const args = {
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
          /*user: {
          select: {
            firstname: true,
            lastname: true,
          },
        },*/
        },
      };
      return (this?._orm || {}).order.findMany(args);
    };

    return StreamFromPromise.obj(_getDataFetcher());
  }
}

export type OrdersDatasetFilters = Prisma.OrderWhereInput;
