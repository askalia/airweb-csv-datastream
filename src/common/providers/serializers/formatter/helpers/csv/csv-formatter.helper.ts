import { ExportToCsv } from 'export-to-csv';
import { IFormatter } from '../../iformatter.model';
import { Snapshot } from '../../snapshot.model';
import { FormatsAllowed } from '../../formats-allowed.model';
import { IFormatterFormat } from '../../iformatter-format.model';
import { registerFormatter } from '../formatters-registry';

const ID = 'csv';
const FILE_EXT = '.csv';
const MIME = FormatsAllowed.CSV;

export const CSVFormatterHelper: IFormatter = {
  id: ID,
  format: async <T>(
    snapshot: Snapshot<T>,
    snapshotTypeName: string,
  ): Promise<IFormatterFormat> => {
    const options = {
      fieldSeparator: ';',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      showTitle: false,
      title: `${snapshotTypeName.toLowerCase()}-${new Date().getTime()}${FILE_EXT}`,
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
      // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
    };

    return {
      filename: options.title,
      stream: new ExportToCsv(options).generateCsv(snapshot, true),
      contentType: MIME,
    };
  },
};

export const registerCSV = () => registerFormatter(ID, CSVFormatterHelper);
