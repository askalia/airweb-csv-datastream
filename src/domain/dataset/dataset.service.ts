import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/db/prisma.service';
import { IDataset, IDatasetFetchOptions, IDatasetMetadata } from './models';

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
      .map(({ metadata }) => metadata)
      .sort(sortAsc);
  }

  async getDatasetItems(
    datasetId: string,
    {
      orderBy,
      limit,
      filters,
    }: {
      orderBy: IDatasetFetchOptions['orderBy'];
      limit: IDatasetFetchOptions['limit'];
      filters: IDatasetFetchOptions['filters'];
    },
  ) {
    const dataset = this.getDatasetById(datasetId);
    if (!this.validateDataset(dataset)) {
      throw new Error(
        `Dataset '${datasetId}' not found. Please check available Datasets : ${process.env.HOST_URL}/datasets`,
      );
    }

    const dataStream = await dataset.fetch({
      orderBy,
      limit,
      filters,
    });
    return dataStream;
  }
}
