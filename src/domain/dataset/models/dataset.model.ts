import { IDataset } from './dataset.abstract.model';
import { Snapshot } from './snapshot.model';

export class Dataset extends IDataset {
  async fetch(): Promise<Snapshot> {
    return [];
  }
}
