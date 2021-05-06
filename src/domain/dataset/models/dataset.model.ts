import { Snapshot } from 'src/domain/dataset/models/snapshot.model';
import { IDataset } from './dataset.abstract.model';

export class Dataset extends IDataset {
  async fetch(): Promise<Snapshot> {
    return [];
  }
}
