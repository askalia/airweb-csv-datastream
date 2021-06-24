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
  '<=': 'lte',
  '>=': 'gte',
  '!=': 'not',
  '=': 'equals',
  '<': 'lt',
  '>': 'gt',
};
