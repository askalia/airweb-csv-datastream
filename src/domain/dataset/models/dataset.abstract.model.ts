import { PrismaService } from 'src/common/db/prisma.service';
import { Snapshot } from 'src/domain/dataset/models/snapshot.model';
import { DatasetFilters } from './dataset-filters.model';
import { IDatasetFetchOptions } from './dataset-fetch-options.model';
import { IDatasetMetadata } from './dataset-metadata.model';

export abstract class IDataset {
  static id: string;
  static description?: string;
  filters: DatasetFilters;
  _stream: Snapshot = null;

  static RECORDS_DEFAULT_LIMIT = +process.env.DATASET_RECORDS_DEFAULT_LIMIT;

  constructor(protected readonly orm: PrismaService) {}

  static get metadata(): IDatasetMetadata {
    return { id: IDataset.id, description: IDataset.description };
  }
  abstract fetch(options: IDatasetFetchOptions): Promise<Snapshot>;
}
