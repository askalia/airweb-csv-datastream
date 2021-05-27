import { Injectable } from '@nestjs/common';
import { AsyncParser, Parser as CsvParser, Options } from 'json2csv';
import { Readable, Writable } from 'stream';
import JSON2CSVParser from 'json2csv/JSON2CSVParser';
import { Snapshot, IFormatter, IFormatterFormat } from '../../common/models';
import { FormatterProvider } from '../../formatters/formatter.decorator';

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
  formatAsync(
    inputStream: Readable,
    output: Writable,
    highWatermark?: number,
    options?: Options<unknown>,
  ) {
    const opts = {
      ...options,
      delimiter: ';',
      includeEmptyRows: false,
      quote: '',
    };
    const transformOpts = {
      highWatermark,
      objectMode: true,
    };

    const asyncParser = new AsyncParser(opts, transformOpts);
    asyncParser.fromInput(inputStream).toOutput(output);
  }
}
