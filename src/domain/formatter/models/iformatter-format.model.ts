import { FormatsAllowed } from './formats-allowed.model';

export interface IFormatterFormat {
  filename?: string;
  contentType: FormatsAllowed;
  formattedStream: string | Buffer | any;
}
