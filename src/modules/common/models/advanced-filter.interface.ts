export interface IAdvancedFilter {
  getFilterAsWhere: (...args: unknown[]) => unknown;
}
