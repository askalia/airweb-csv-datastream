import { FormatsAllowed } from './formats-allowed.model';

export interface IFormatterFormat {
  filename: string;
  contentType: FormatsAllowed;
  stream: Buffer;
}
