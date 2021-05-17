import { ExportToCsv } from 'export-to-csv';
import { Snapshot } from 'src/domain/dataset/models/snapshot.model';
import { IFormatter } from '../models/iformatter.model';
import { IFormatterFormat } from '../models/iformatter-format.model';
import { Injectable } from '@nestjs/common';
import { FormatterProvider } from '../formatter.decorator';
import { withFlattening } from '../helpers';

@Injectable()
@FormatterProvider({
  id: 'csv',
  description: 'a simple csv formatter',
})
export class CSVFormatter extends IFormatter {
  async format(
    data: Snapshot,
    options?: { customHeaders?: string[] },
  ): Promise<IFormatterFormat> {
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
      contentType: 'text/csv',
    };
  }
}
