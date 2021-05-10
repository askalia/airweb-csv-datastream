import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/db/prisma.service';
import { IDataset, IDatasetMetadata } from './models';

import { OrdersDataset } from './datasets/orders.dataset';

@Injectable()
export class DatasetService {
  private registry = new Map<string, typeof IDataset>();
  constructor(
    @Inject('PrismaService')
    private readonly orm: PrismaService,
  ) {
    this._register(OrdersDataset);
  }

  private _register(...datasets: typeof IDataset[]) {
    datasets.forEach((datasetClass) => {
      this.registry.set(datasetClass.id, datasetClass);
    });
  }

  getDatasetById(id: string): IDataset {
    if (!this.registry.has(id)) {
      return undefined;
    }
    const datasetClass = this.registry.get(id) as any;
    return new datasetClass(this.orm) as IDataset;
  }

  validateDataset(dataset): boolean {
    return dataset !== undefined && dataset instanceof IDataset;
  }

  listAllIds(): IDatasetMetadata[] {
    const sortAsc = (dataset, datasetNext) => {
      return dataset.id < datasetNext.id ? -1 : 1;
    };
    return Array.from(this.registry.values())
      .map((dsClassRef) => ({
        id: dsClassRef.id,
        description: dsClassRef.description,
      }))
      .sort(sortAsc);
  }
}
