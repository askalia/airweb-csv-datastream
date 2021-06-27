import { IFormatter, IFormatterFormat, Snapshot } from '../../common/models';
import { Injectable } from '@nestjs/common';
import { FormatterProvider } from '../formatter.decorator';
import { AsyncParser, Parser as CsvParser, Options } from 'json2csv';
import { Readable, Writable } from 'stream';
import JSON2CSVParser from 'json2csv/JSON2CSVParser';

@Injectable()
@FormatterProvider({
  id: 'csv',
  description: 'a simple csv formatter',
})
export class CSVFormatter extends IFormatter {
  static contentType = 'text/csv';
  format(data: Snapshot, options?: Options<string>): IFormatterFormat {
    const csvOptions = {
      ...options,
      delimiter: ';',
      includeEmptyRows: false,
      quote: '',
      flatten: true,
      fields: options?.fields,
    };
    return {
      formattedStream: (new CsvParser(
        csvOptions,
      ) as JSON2CSVParser<unknown>).parse(data),
      contentType: CSVFormatter.contentType,
    };
  }
  /**
   *
   * @param inputStream
   * @param output : can be the httpReponse itself
   * @param highWatermark
   */
  formatAsync({
    inputStream,
    output,
    chunkSize,
    options,
  }: {
    inputStream: Readable;
    output: Writable;
    chunkSize?: number;
    options?: Options<unknown>;
  }) {
    const opts = {
      ...options,
      delimiter: ';',
      includeEmptyRows: false,
      quote: '',
      fields: options?.fields,
    };
    const transformOpts = {
      highWatermark: chunkSize,
      objectMode: true,
    };

    const asyncParser = new AsyncParser(opts, transformOpts);
    asyncParser.fromInput(inputStream).toOutput(output);
  }
}
