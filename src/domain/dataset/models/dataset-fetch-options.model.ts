import { DatasetFilters } from './dataset-filters.model';

export type IDatasetFetchOptions = {
  filters: DatasetFilters;
  limit?: number;
  orderBy?: { [field: string]: 'asc' | 'desc' };
};
