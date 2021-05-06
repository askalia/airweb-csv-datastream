import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/db/prisma.service';
import { IDataset, IDatasetMetadata } from './models/dataset.abstract.model';

import { OrdersDataset } from './datasets/orders.dataset';

@Injectable()
export class DatasetService {
  private registry: Map<string, any> = new Map<string, any>();
  constructor(
    @Inject('PrismaService')
    private readonly orm: PrismaService,
  ) {
    this._register(OrdersDataset);
  }

  private _register(...datasets: any[]) {
    datasets.forEach((datasetClass) => {
      this.registry.set(datasetClass.id, datasetClass);
    });
  }

  getDatasetById(id: string): IDataset {
    if (!this.registry.has(id)) {
      return undefined;
    }
    const dataset = this.registry.get(id);
    return new dataset(this.orm);
  }

  validateDataset(dataset): boolean {
    return dataset !== undefined && dataset instanceof IDataset;
  }

  listAllIds(): IDatasetMetadata[] {
    return Array.from(this.registry.values()).map((dsClassRef) => ({
      id: dsClassRef.id,
      description: dsClassRef.description,
    }));
  }
}
