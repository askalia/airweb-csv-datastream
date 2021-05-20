import { Prisma } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { IDataset, IDatasetFetchOptions } from '../models';
import { DatasetProvider } from '../dataset.decorator';
import { Snapshot } from '../models/snapshot.model';
import { Readable } from 'stream';

const decorator = {
  id: 'validations',
  description: 'retrieves Validations',
  filterables: ['id', 'itemName'],
};

@Injectable()
@DatasetProvider(decorator)
export class ValidationsDataset extends IDataset {
  constructor() {
    super(decorator.id);
  }
  async fetch(
    options: IDatasetFetchOptions<ValidationsDatasetFilters>,
  ): Promise<Snapshot> {
    this.checkSetup();
    return this?.orm?.validation?.findMany({
      ...this.getQueryCommons<ValidationsDatasetFilters>(options),
      select: {
        id: true,
        itemName: true,
        item: {
          select: {
            duration: true,
            active: true,
          },
        },
      },
    });
  }

  fetchAsStream(
    options: IDatasetFetchOptions<ValidationsDatasetFilters>,
  ): Readable {
    this.checkSetup();
    return new Readable();
  }
}

export type ValidationsDatasetFilters = Prisma.ValidationWhereInput;
