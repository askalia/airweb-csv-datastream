import { FilterOperatorSymbol } from './filter-operators.model';

// type IterableFilterType = string[] | number[];

export interface Filter {
  prop: string;
  operator: FilterOperatorSymbol;
  value: number | string; // | IterableFilterType
}
