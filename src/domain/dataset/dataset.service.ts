import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/db/prisma.service';
import { IDataset, IDatasetMetadata } from './models';

interface DatasetRegistryItem {
  metadata: IDatasetMetadata;
  provider: IDataset;
}

@Injectable()
export class DatasetService {
  private registry = new Map<string, DatasetRegistryItem>();
  constructor(
    @Inject('PrismaService')
    private readonly orm: PrismaService,
  ) {}

  public register(
    datasets: { metadata: IDatasetMetadata; provider: IDataset }[],
  ) {
    if (this.registry.size > 0) {
      throw new Error('Datasets Registry must not be set again');
    }
    datasets.forEach((dataset) => {
      this.registry.set(dataset.metadata.id, {
        metadata: dataset.metadata,
        provider: dataset.provider,
      });
    });
  }
  getDatasetById(id: string): IDataset | undefined {
    if (!this.registry.has(id)) {
      return undefined;
    }
    const dataset = this.registry.get(id);
    return dataset.provider.setup({ orm: this.orm });
  }

  validateDataset(dataset): boolean {
    return dataset !== undefined && dataset instanceof IDataset;
  }

  listAllIds(): IDatasetMetadata[] {
    const sortAsc = (provider, providerNext) => {
      return provider.id < providerNext.id ? -1 : 1;
    };
    return Array.from(this.registry.values())
      .map(({ metadata: { id, description } }) => ({
        id,
        description,
      }))
      .sort(sortAsc);
  }
}
