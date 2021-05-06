import { PrismaService } from 'src/common/db/prisma.service';
import { Snapshot } from 'src/domain/dataset/models/snapshot.model';
import { DatasetFilters } from './dataset-filters.model';

export interface IDatasetMetadata {
  id: string;
  description?: string;
}

export type IFetchOptions = {
  filters: DatasetFilters;
  limit?: number;
  orderBy?: { [field: string]: 'asc' | 'desc' };
};

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
  abstract fetch(options: IFetchOptions): Promise<Snapshot>;
}
