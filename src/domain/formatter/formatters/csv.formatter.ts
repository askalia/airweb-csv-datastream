import { ExportToCsv } from 'export-to-csv';
import { Snapshot } from '../../../domain/dataset/models/snapshot.model';
import { IFormatter } from '../models/iformatter.model';
import { IFormatterFormat } from '../models/iformatter-format.model';
import { Injectable } from '@nestjs/common';
import { FormatterProvider } from '../formatter.decorator';
import { withFlattening } from '../helpers';
import { AsyncParser } from 'json2csv';
import { Readable, Writable } from 'stream';

@Injectable()
@FormatterProvider({
  id: 'csv',
  description: 'a simple csv formatter',
})
export class CSVFormatter extends IFormatter {
  static contentType = 'text/csv';
  format(
    data: Snapshot,
    options?: { customHeaders?: string[] },
  ): IFormatterFormat {
    const csvOptions = {
      fieldSeparator: ';',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      showTitle: false,
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: !options?.customHeaders,
      headers: options?.customHeaders || undefined, //['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
    };

    const shouldReturnCsv = true;
    return {
      formattedStream: new ExportToCsv(csvOptions).generateCsv(
        withFlattening(data),
        shouldReturnCsv,
      ),
      contentType: CSVFormatter.contentType,
    };
  }
  /**
   *
   * @param inputStream
   * @param output : can be the httpReponse itself
   * @param highWatermark
   */
  formatAsync(inputStream: Readable, output: Writable, highWatermark?: number) {
    const opts = {
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
