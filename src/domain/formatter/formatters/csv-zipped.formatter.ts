import { Snapshot } from '../../../domain/dataset/models/snapshot.model';
import { IFormatter } from '../models/iformatter.model';
import { IFormatterFormat } from '../models/iformatter-format.model';
import * as zipper from 'lzutf8';
import { Injectable } from '@nestjs/common';
import { Parser as CsvParser, Options } from 'json2csv';
import JSON2CSVParser from 'json2csv/JSON2CSVParser';

import { FormatterProvider } from '../formatter.decorator';

@Injectable()
@FormatterProvider({
  id: 'csv-zip',
  description: 'a simple csv zipped formatter',
})
export class CSVZippedFormatter extends IFormatter {
  async format(
    data: Snapshot,
    options?: Options<string>,
  ): Promise<IFormatterFormat> {
    const csvOptions = {
      ...options,
      delimiter: ';',
      includeEmptyRows: false,
      quote: '',
    };

    return {
      formattedStream: zipper.compress(
        (new CsvParser(csvOptions) as JSON2CSVParser<unknown>).parse(data),
        {
          inputEncoding: 'String',
          outputEncoding: 'Buffer',
        },
      ),
      contentType: 'application/zip',
    };
  }

  formatAsync() {}
}
