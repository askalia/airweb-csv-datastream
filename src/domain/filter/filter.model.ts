import { FilterOperatorSymbol } from './filter-operators.model';

// type IterableFilterType = string[] | number[];

interface Filter {
  operator: FilterOperatorSymbol | string;
  value: number | string; // | IterableFilterType
}

export type Filters = Record<string, Filter>;