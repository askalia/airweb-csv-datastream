import { PrismaService } from 'src/common/providers/db/prisma.service';
import { Snapshot } from 'src/domain/dataset/models/snapshot.model';
import { DatasetFilters } from './dataset-filers.model';

export interface IDatasetMetadata {
  id: string;
  description?: string;
}

export abstract class IDataset {
  static id: string;
  static description?: string;
  filters: DatasetFilters;
  _stream: Snapshot = null;

  constructor(protected readonly orm: PrismaService) {}

  static get metadata(): IDatasetMetadata {
    return { id: IDataset.id, description: IDataset.description };
  }
  abstract fetch(data?: { filters?: DatasetFilters }): Promise<Snapshot>;
}
