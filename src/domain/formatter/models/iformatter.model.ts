import { Snapshot } from '../../dataset/models/snapshot.model';
import { IFormatterFormat } from './iformatter-format.model';

export interface IFormatterMetadata {
  id: string;
  description?: string;
}

export abstract class IFormatter {
  static id: string;
  static description?: string;
  abstract format(data: Snapshot, dataType?: string): Promise<IFormatterFormat>;
}
