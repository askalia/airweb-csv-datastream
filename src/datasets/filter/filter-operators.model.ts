export type FilterOperatorSymbol = '>=' | '>' | '=' | '<=' | '!=' | '<';
export type FilterOperatorLabel =
  | 'equals'
  | 'lt'
  | 'lte'
  | 'gt'
  | 'gte'
  | 'not';

export const filterOperatorsMap: Record<
  FilterOperatorSymbol,
  FilterOperatorLabel
> = {
  '=': 'equals',
  '<': 'lt',
  '<=': 'lte',
  '>': 'gt',
  '>=': 'gte',
  '!=': 'not',
};
