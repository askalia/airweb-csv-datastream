import { Injectable } from '@nestjs/common';
import { filterOperatorsMap } from './filter-operators.model';
import { Filters } from '../common/models/filter.model';
import { IAdvancedFilter, IFilterMetadata } from '../common/models';

interface AdvancedFilterRegistryItem {
  metadata: IFilterMetadata;
  provider: IAdvancedFilter;
}

@Injectable()
export class FilterService {
  parseFilters(rawFilters: string): Filters {
    const _extractParts = (block) => {
      if (block === undefined) {
        return null;
      }
      const pattern = new RegExp(Object.keys(filterOperatorsMap).join('|'));
      const [field, value] = block.split(pattern);

      if (this.isAdvancedFilterId(field)) {
        const advancedFilterId = field;
        const advancedFilter = this.getFilterById(advancedFilterId);
        const filterValueAsWhereClause = advancedFilter.getFilterAsWhere(value);
        return {
          [advancedFilterId]: filterValueAsWhereClause,
        };
      } else {
        const [operator] = block.match(pattern);

        return {
          [field]: {
            operator,
            value,
          },
        };
      }
    };

    const filtersBlocks = rawFilters.split(/[;,]+/);
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
      if (filter.operator === undefined) {
        clauses = [...clauses, ...(filter as any)];
      } else {
        clauses.push({
          [fieldName]: {
            [filterOperatorsMap[filter.operator]]: this._parsedValue(
              filter?.value?.toString(),
            ),
          },
        });
      }

      return clauses;
    }, []);
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

  private registry = new Map<string, AdvancedFilterRegistryItem>();

  public register(
    formatters: { metadata: IFilterMetadata; provider: IAdvancedFilter }[],
  ) {
    if (this.registry.size > 0) {
      throw new Error('Formatters Registry must not be set again');
    }
    formatters.forEach((formatter) => {
      this.registry.set(formatter.metadata.id, {
        metadata: formatter.metadata,
        provider: formatter.provider,
      });
    });
  }

  isAdvancedFilterId(id: string): boolean {
    return this.registry.has(id);
  }

  getFilterById(id: string): IAdvancedFilter | undefined {
    return this.registry.get(id)?.provider;
  }

  isTargettedPropOfAdvancedFilter(prop: string): boolean {
    const allTargettedProps = this.listTargettedProps();
    const flatProps = allTargettedProps.reduce((acc, node) => {
      acc = [...acc, ...node.targettedProps];
      return acc;
    }, []);
    return flatProps.includes(prop);
  }

  public listTargettedProps(): any[] {
    const sortAsc = (provider, providerNext) => {
      return provider.id < providerNext.id ? -1 : 1;
    };
    return Array.from(this.registry.values())
      .map(({ metadata }) => metadata)
      .sort(sortAsc);
  }
}
