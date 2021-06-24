import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../common/db/prisma.service';
import {
  IDataset,
  IDatasetFetchOptions,
  IDatasetMetadata,
  IDatasetMetadataSwagger,
} from '../common/models';
import { Readable } from 'stream';
import { FilterService } from '../filters';

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
    private readonly filterService: FilterService,
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
    return dataset.provider.setup({
      orm: this.orm,
      service: this,
      filterService: this.filterService,
    });
  }

  validateDataset(dataset): boolean {
    return dataset !== undefined && dataset instanceof IDataset;
  }

  listAllMetadata(): IDatasetMetadataSwagger[] {
    const sortAsc = (provider, providerNext) => {
      return provider.id < providerNext.id ? -1 : 1;
    };
    return Array.from(this.registry.values())
      .map(({ metadata }) => ({
        ...metadata,
        filterables: metadata?.filterables || '*',
      }))
      .sort(sortAsc);
  }

  getMetadataOf(datasetId: string): IDatasetMetadata {
    const dataset = Array.from(this.registry.values()).find(
      (ds) => ds?.metadata?.id === datasetId,
    );
    return dataset?.metadata;
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

  getDatasetItemsAsStream(
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
  ): Readable {
    const dataset = this.getDatasetById(datasetId);
    if (!this.validateDataset(dataset)) {
      throw new Error(
        `Dataset '${datasetId}' not found. Please check available Datasets : ${process.env.HOST_URL}/datasets`,
      );
    }

    return dataset.fetchAsStream({
      orderBy,
      limit,
      filters,
    });
  }
}
