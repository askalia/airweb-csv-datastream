import { Snapshot } from '../../dataset/models/snapshot.model';
import { IFormatterFormat } from './iformatter-format.model';

export interface IFormatterMetadata {
  id: string;
  description?: string;
}

export abstract class IFormatter {
  abstract format(data: Snapshot, options?: unknown): Promise<IFormatterFormat>;
}
