import { PrismaService } from '../db/prisma.service';
import { Snapshot } from './snapshot.model';
import { DatasetFilters } from './dataset-filters.model';
import { IDatasetFetchOptions } from './dataset-fetch-options.model';
import { Readable } from 'stream';
import { DatasetService } from '../../datasets';
import { FilterService } from 'src/modules/filters';

export abstract class IDataset {
  filters: DatasetFilters<unknown>;
  protected orm: PrismaService;
  protected service: DatasetService;
  protected filterService: FilterService;
  protected id: string;

  static DEFAULT_RECORDS_CHUNKING = Number(
    process.env.DATASET_DEFAULT_CHUNKING,
  );
  constructor(id) {
    this.id = id;
  }

  setup({
    orm,
    service,
    filterService,
  }: {
    orm: PrismaService;
    service: DatasetService;
    filterService: FilterService;
  }): IDataset {
    this.orm = orm;
    this.service = service;
    this.filterService = filterService;
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

  public getQueryCommons<TDatasetFilters>(
    options: IDatasetFetchOptions<TDatasetFilters>,
  ) {
    return {
      where: this.where<TDatasetFilters>(options?.filters),
      take: this.take(options?.limit),
      orderBy: options?.orderBy,
    };
  }

  protected where<TDataset>(
    filters: IDatasetFetchOptions<TDataset>['filters'],
  ) {
    if (!filters) {
      return {};
    }
    this.validateFilters<TDataset>(filters);

    return {
      AND: filters,
    };
  }

  protected take(howMany?: number) {
    return howMany || Number(process.env.DATASET_DEFAULT_CHUNKING);
  }

  private validateFilters<TDataset>(
    filters: IDatasetFetchOptions<TDataset>['filters'],
  ) {
    const { filterables } = this.service.getMetadataOf(this.id);

    const unauthorizedFilters = filters.reduce((acc, filterObject) => {
      acc = [
        ...acc,
        ...Object.keys(filterObject).filter(
          (candidateProp) =>
            !(
              filterables.includes(candidateProp) ||
              this.filterService.isTargettedPropOfAdvancedFilter(candidateProp)
            ),
        ),
      ];
      return acc;
    }, []);

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
