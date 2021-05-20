import { Prisma } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { IDataset, IDatasetFetchOptions } from '../models';
import { DatasetProvider } from '../dataset.decorator';
import { Snapshot } from '../models/snapshot.model';
import * as StreamFromPromise from 'stream-from-promise';
import { Readable } from 'stream';
import { read } from 'node:fs';

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
      },
    });
  }

  fetchAsStream(options: IDatasetFetchOptions<OrdersDatasetFilters>): Readable {
    this.checkSetup();

    let cursorId = undefined;
    const $this = this;
    const CHUNK_SIZE = 1000;    
    let nbItemsTotal = 0;
    return new Readable({
      objectMode: true,
      read: async function() {
        try {          
          let items = undefined;
          const queryCommons = $this.getQueryCommons(options);
          const totalItemsCount = await $this.orm.order.count(queryCommons);
          do {
            const args = {
              ...queryCommons,
              take: CHUNK_SIZE,
              skip: cursorId !== undefined ? 1 : 0,
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
            items = await $this.orm?.order?.findMany(args);           
            if (items.length === 0) {
              this.push(null);
            } else {
              cursorId = items[items.length - 1].id;
              for (const item of items) {                
                this.push(item);
              }
              
            }                                  
            nbItemsTotal += items.length;
            
          } while (nbItemsTotal === totalItemsCount)                                      
        }
        catch(error){
          console.log('ERR : ', error)
          this.destroy(error);
        }
      },
    });
  }
}

export type OrdersDatasetFilters = Prisma.OrderWhereInput;
