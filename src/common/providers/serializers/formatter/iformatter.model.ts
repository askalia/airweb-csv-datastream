import { IFormatterFormat } from '../../../../domain/formatter/models/iformatter-format.model';
import { Snapshot } from '../../../../domain/dataset/models/snapshot.model';

export interface IFormatter__ {
  id: string;
  format(data: Snapshot, snapshotTypeName: string): Promise<IFormatterFormat>;
}
