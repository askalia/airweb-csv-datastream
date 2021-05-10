import { ExportToCsv } from 'export-to-csv';
import { Snapshot } from 'src/domain/dataset/models/snapshot.model';
import { IFormatter } from '../models/iformatter.model';
import { IFormatterFormat } from '../models/iformatter-format.model';
import { Injectable } from '@nestjs/common';
import { FormatterProvider } from '../formatter.decorator';

@Injectable()
@FormatterProvider({
  id: 'csv',
  description: 'a simple csv formatter',
})
export class CSVFormatter extends IFormatter {
  async format(data: Snapshot): Promise<IFormatterFormat> {
    const options = {
      fieldSeparator: ';',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      showTitle: false,
      //      title: `${snapshotTypeName.toLowerCase()}-${new Date().getTime()}${FILE_EXT}`,
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
      // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
    };

    return {
      formattedStream: new ExportToCsv(options).generateCsv(data, true),
      contentType: 'text/csv',
    };
  }
}
