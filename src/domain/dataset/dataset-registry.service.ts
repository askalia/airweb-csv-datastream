import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/providers/db/prisma.service';
import { IDataset, IDatasetMetadata } from './models/dataset.abstract.model';

import { OrdersLimit10Dataset } from './datasets/orders-limit-10.dataset';

@Injectable()
export class DatasetRegistry {
  private registry: Map<string, any> = new Map<string, any>();
  constructor(
    @Inject('PrismaService')
    private readonly orm: PrismaService,
  ) {
    const datasets = [OrdersLimit10Dataset];
    this._register(datasets);
  }

  private _register(datasets: any[]) {
    datasets.forEach((datasetClass) => {
      this.registry.set(datasetClass.id, datasetClass);
    });
  }

  getById(id: string): IDataset {
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
