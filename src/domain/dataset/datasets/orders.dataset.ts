import { Prisma } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { IDataset, IDatasetFetchOptions } from '../models';
import { DatasetProvider } from '../dataset.decorator';
import { Snapshot } from '../models/snapshot.model';
import * as StreamFromPromise from 'stream-from-promise';
import { Readable } from 'stream';

const decorator = {
  id: 'orders',
  description: 'retrieves Orders',
  filterables: ['id', 'code', 'status', 'paymentDate', 'total'],
};

@Injectable()
@DatasetProvider(decorator)
export class OrdersDataset extends IDataset {
  constructor() {
    super(decorator.id);
  }
  async fetch(
    options: IDatasetFetchOptions<OrdersDatasetFilters>,
  ): Promise<Snapshot> {
    this.checkSetup();
    return this?.orm?.order?.findMany({
      ...this.getQueryCommons<OrdersDatasetFilters>(options),
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
    this.checkSetup();

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
      return this?.orm?.order?.findMany(args);
    };

    return StreamFromPromise.obj(_getDataFetcher());
  }
}

export type OrdersDatasetFilters = Prisma.OrderWhereInput;
