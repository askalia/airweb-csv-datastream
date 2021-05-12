import { Injectable } from '@nestjs/common';
import {
  filterOperatorsMap,
  FilterOperatorSymbol,
} from './filter-operators.model';
import { Filter } from './filter.model';

@Injectable()
export class FilterService {
  parseFilters(rawFilters: string): Filter[] {
    const filters = rawFilters.split(',');
    return filters.map(this.extractFilter);
  }

  extractFilter(rawFilter: string): Filter {
    const [prop, operator, value] = rawFilter.split(/(>=|>|=|<=|<)/);
    return {
      prop,
      operator: operator as FilterOperatorSymbol,
      value,
    };
  }

  toWhereClause(filters: Filter[]) {
    return filters.map((filter) => ({
      [filterOperatorsMap[filter.operator]]: this._parsedValueOf(
        filter.value.toString(),
      ),
    }));
  }

  private _parsedValueOf(rawValue: string): string | number {
    return isNaN(Number(rawValue)) ? rawValue : Number(rawValue);
  }
}
