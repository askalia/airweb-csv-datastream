export interface IDatasetMetadata {
  id: string;
  description?: string;
  filterables?: string[];
}

// TS inline overrider util
type Override<TType, TOverrideProp> = Omit<TType, keyof TOverrideProp> &
  TOverrideProp;

// swager purpose only : allow filterables to be either a list of props or symbolized with a wildcard (*) -> all
export type IDatasetMetadataSwagger = Override<
  IDatasetMetadata,
  { filterables: IDatasetMetadata['filterables'] | string }
>;
