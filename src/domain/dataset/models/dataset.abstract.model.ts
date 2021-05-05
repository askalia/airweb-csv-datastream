import { Snapshot } from 'src/common/providers/serializers/formatter/snapshot.model';
type DatasetTarget = 'order' | 'client';

type DatasetFilter = unknown;
type DatasetFilters = DatasetFilter[];

export interface IDatasetRecord {
  id: string;
  target: DatasetTarget;
  filters: DatasetFilters;
}

export abstract class IDataset implements IDatasetRecord {
  id: string;
  target: DatasetTarget;
  filters: DatasetFilters;

  abstract fetch(): Promise<Snapshot>;

  from(data: IDatasetRecord) {
    for (const [k, v] of Object.entries(data)) {
      this[k] = v;
    }
  }
}
