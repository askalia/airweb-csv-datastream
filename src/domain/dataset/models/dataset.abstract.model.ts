import { PrismaService } from '../../../common/db/prisma.service';
import { Snapshot } from '../../../domain/dataset/models/snapshot.model';
import { DatasetFilters } from './dataset-filters.model';
import { IDatasetFetchOptions } from './dataset-fetch-options.model';
import { Readable } from 'node:stream';
import { DatasetService } from '../dataset.service';

export abstract class IDataset {
  filters: DatasetFilters<unknown>;
  protected orm: PrismaService;
  protected service: DatasetService;
  protected id: string;

  static RECORDS_DEFAULT_LIMIT = +process.env.DATASET_RECORDS_DEFAULT_LIMIT;

  constructor(id) {
    this.id = id;
  }

  setup({
    orm,
    service,
  }: {
    orm: PrismaService;
    service: DatasetService;
  }): IDataset {
    this.orm = orm;
    this.service = service;
    return this;
  }

  abstract fetch(options: IDatasetFetchOptions): Promise<Snapshot>;
  abstract fetchAsStream(options: IDatasetFetchOptions): Readable;

  protected checkSetup() {
    if (!(this.orm instanceof PrismaService)) {
      throw new Error('dataset : ORM is not set. Please check setup');
    }
    if (!(this.service instanceof DatasetService)) {
      throw new Error('dataset : service is not set. Please check setup');
    }
  }
  protected where<D>(filters: IDatasetFetchOptions<D>['filters']) {
    if (!filters) {
      return {};
    }
    this.validateFilters<D>(filters);

    return {
      AND: filters,
    };
  }

  private validateFilters<D>(filters: IDatasetFetchOptions<D>['filters']) {
    const { filterables } = this.service.getMetadataOf(this.id);
    const targettedProps = Object.keys(filters);

    const unauthorizedFilters =
      filterables === undefined
        ? []
        : targettedProps.filter(
            (candidateProp) => !filterables.includes(candidateProp),
          );

    if (unauthorizedFilters.length > 0) {
      throw new Error(
        `cannot apply filter(s) against unauthorized field(s) : ${unauthorizedFilters.join(
          ', ',
        )}`,
      );
    }
    return true;
  }
}
