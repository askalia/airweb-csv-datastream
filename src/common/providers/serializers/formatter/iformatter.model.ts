import { IFormatterFormat } from './iformatter-format.model';
import { Snapshot } from './snapshot.model';

export interface IFormatter {
  format<T>(
    data: Snapshot<T>,
    snapshotTypeName: string,
  ): Promise<IFormatterFormat>;
}
