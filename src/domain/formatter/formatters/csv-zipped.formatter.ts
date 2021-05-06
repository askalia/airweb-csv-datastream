import { ExportToCsv } from 'export-to-csv';
import { Snapshot } from 'src/domain/dataset/models/snapshot.model';
import { IFormatter } from '../models/iformatter.model';
import { IFormatterFormat } from '../models/iformatter-format.model';
import * as zipper from 'lzutf8';

export class CSVZippedFormatter extends IFormatter {
  static id = 'csv-zipped';
  static description = 'a simple csv+zipped formatter';

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
      formattedStream: zipper.compress(
        new ExportToCsv(options).generateCsv(data, true),
        {
          inputEncoding: 'String',
          outputEncoding: 'Buffer',
        },
      ),
      contentType: 'application/zip',
    };
  }
}
