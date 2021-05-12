import { DatasetFilters } from './dataset-filters.model';

export type IDatasetFetchOptions<F = unknown> = {
  filters: DatasetFilters<F>;
  limit?: number;
  orderBy?: { [field: string]: 'asc' | 'desc' };
};
