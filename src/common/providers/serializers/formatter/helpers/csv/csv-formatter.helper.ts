import { ExportToCsv } from 'export-to-csv';
import { IFormatter } from '../../iformatter.model';
import { FormatterFactoryService } from '../../formatter.factory';
import { Snapshot } from '../../snapshot.model';
import { FormatsAllowed } from '../../formats-allowed.model';
import { IFormatterFormat } from '../../iformatter-format.model';

export const CSVFormatterHelper = (
  factory: FormatterFactoryService,
): IFormatter => {
  if (!factory) {
    throw new Error('this Helper cannot be used wihout its factory');
  }

  const FILE_EXT = '.csv';

  const format = async <T>(
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
      filename: `${snapshotTypeName}-${new Date().getTime()}.csv`,
      stream: new ExportToCsv(options).generateCsv(snapshot, true),
      contentType: FormatsAllowed.CSV,
    };
  };

  return {
    format,
  };
};
