import { Readable, Writable } from 'stream';
import { Snapshot } from '../../common/models/snapshot.model';
import { IFormatterFormat } from './iformatter-format.model';

export interface IFormatterMetadata {
  id: string;
  description?: string;
}

export abstract class IFormatter {
  static readonly contentType: string;
  abstract format(
    data: Snapshot,
    options?: unknown,
  ): IFormatterFormat | Promise<IFormatterFormat>;

  abstract formatAsync({
    inputStream,
    output,
    chunkSize,
    options,
  }: {
    inputStream: Readable;
    output: Writable;
    chunkSize?: number;
    options?: unknown;
  }): void;
}
