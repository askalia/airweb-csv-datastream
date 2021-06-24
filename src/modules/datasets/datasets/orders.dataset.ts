import { Prisma } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { DatasetProvider } from '../dataset.decorator';
import { Snapshot, IDataset, IDatasetFetchOptions } from '../../common/models';
import { Readable } from 'stream';

const decorator = {
  id: 'orders',
  description: 'retrieves Orders',
  filterables: [
    'id',
    'code',
    'status',
    'paymentDate',
    'total',
    'transferredAt',
  ],
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

    const findManyStatement = {
      ...this.getQueryCommons<OrdersDatasetFilters>(options),
      select: {
        id: true,
        code: true,
        userId: true,
        networkId: true,
        taxFreeTotal: true,
        total: true,
      },
    };
    return this?.orm?.order?.findMany(findManyStatement);
  }

  fetchAsStream(options: IDatasetFetchOptions<OrdersDatasetFilters>): Readable {
    this.checkSetup();

    let cursorId = undefined;
    const $this = this;
    const CHUNKS_SIZE = this.take();

    return new Readable({
      objectMode: true,
      async read() {
        try {
          const args = {
            ...$this.getQueryCommons(options),
            take: CHUNKS_SIZE,
            skip: cursorId ? 1 : 0,
            cursor: cursorId ? { id: cursorId } : undefined,
            select: {
              id: true,
              code: true,
              userId: true,
              networkId: true,
              taxFreeTotal: true,
              total: true,
            },
          };
          const items = await $this.orm.order.findMany(args);

          cursorId = items[items.length - 1].id;
          for (const item of items) {
            this.push(item);
          }
          if (items.length < CHUNKS_SIZE) {
            this.push(null);
          }
        } catch (err) {
          this.destroy(err);
        }
      },
    });
  }
}

export type OrdersDatasetFilters = Prisma.OrderWhereInput;
