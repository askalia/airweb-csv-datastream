import { Injectable } from '@nestjs/common';
import { filterOperatorsMap } from './filter-operators.model';
import { Filters } from './filter.model';

@Injectable()
export class FilterService {
  parseFilters(rawFilters: string): Filters {
    const _extractParts = (block) => {
      if (block === undefined) {
        return null;
      }
      //const [field, operator, value] = block.split(':');
      const pattern = new RegExp(Object.keys(filterOperatorsMap).join('|'));

      //const [field, operator, value] = block.split(/(>=|>|=|<=|!=|<)/);
      const [field, value] = block.split(pattern);
      const [operator] = block.match(pattern);

      return {
        [field]: {
          operator,
          value,
        },
      };
    };

    const filtersBlocks = rawFilters.split(';');
    let filters: Filters = {};
    for (const block of filtersBlocks) {
      filters = {
        ...filters,
        ..._extractParts(block),
      };
    }

    return filters;
  }

  toWhereClause(filters: Filters): unknown {
    return Object.entries(filters).reduce((clauses, [fieldName, filter]) => {
      clauses[fieldName] = {
        [filterOperatorsMap[filter.operator]]: this._parsedValue(
          filter?.value?.toString(),
        ),
      };
      return clauses;
    }, {});
  }

  private _parsedValue(rawValue: string | number): string | number {
    function _valueHasQuotes(value: string) {
      const QUOTES = ['"', "'"];
      return (
        typeof value === 'string' &&
        QUOTES.includes(value.charAt(0)) &&
        QUOTES.includes(value.charAt(value.length - 1))
      );
    }
    function _stripQuotes(str: string) {
      const strAsArray = String(str).split('');
      return strAsArray.splice(1, strAsArray.length - 2).join('');
    }
    if (_valueHasQuotes(String(rawValue))) {
      return _stripQuotes(String(rawValue));
    }
    return isNaN(Number(rawValue)) ? rawValue : Number(rawValue);
  }
}
