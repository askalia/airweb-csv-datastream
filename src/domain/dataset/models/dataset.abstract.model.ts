import { PrismaService } from 'src/common/db/prisma.service';
import { Snapshot } from 'src/domain/dataset/models/snapshot.model';
import { DatasetFilters } from './dataset-filters.model';
import { IDatasetFetchOptions } from './dataset-fetch-options.model';
import { IDatasetMetadata } from './dataset-metadata.model';

export abstract class IDataset {
  static id: string;
  static description?: string;
  filters: DatasetFilters<unknown>;
  _stream: Snapshot = null;
  protected _orm: PrismaService;

  static RECORDS_DEFAULT_LIMIT = +process.env.DATASET_RECORDS_DEFAULT_LIMIT;

  setup({ orm }: { orm: PrismaService }): IDataset {
    this._orm = orm;
    return this;
  }

  static get metadata(): IDatasetMetadata {
    return { id: IDataset.id, description: IDataset.description };
  }
  abstract fetch(options: IDatasetFetchOptions): Promise<Snapshot>;

  protected _checkSetup() {
    if (!(this._orm instanceof PrismaService)) {
      throw new Error('ORM is not set. Please check platform setup');
    }
  }
  protected where<D>(filters: IDatasetFetchOptions<D>['filters']) {
    return {
      AND: filters,
    };
  }
}
