import { Snapshot } from 'src/common/providers/serializers/formatter/snapshot.model';
import { IDataset } from './dataset.abstract.model';

export class Dataset extends IDataset {
  async fetch(): Promise<Snapshot> {
    return [];
  }
}
