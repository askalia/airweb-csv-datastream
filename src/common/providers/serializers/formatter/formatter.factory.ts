/*import { Injectable } from '@nestjs/common';
import { CSVFormatterHelper } from './helpers/csv/csv-formatter.helper';
import { FormatsAllowed } from '../../../../domain/formatter/models/formats-allowed.model';
//import { IFormatter } from './iformatter.model';
import { Snapshot } from '../../../../domain/dataset/models/snapshot.model';
import { IFormatterFormat } from '../../../../domain/formatter/models/iformatter-format.model';
import { validateFileFormat } from './helpers/formatter.helper';

@Injectable()
export class FormatterFactoryService {
  private readonly _formatHelpersMap: Map<FormatsAllowed, IFormatter>;

  constructor() {
    this._formatHelpersMap = new Map<FormatsAllowed, IFormatter>();
    this._formatHelpersMap.set(FormatsAllowed.CSV, CSVFormatterHelper);
  }
  public format(
    snapshot: Snapshot,
    formatType: FormatsAllowed,
    snapshotTypeName: string,
  ): Promise<IFormatterFormat> {
    if (!validateFileFormat(formatType)) {
      throw new Error(`Format ${formatType} is not supported`);
    }
    return this._getFormatter(formatType)?.format(snapshot, snapshotTypeName);
  }

  private _getFormatter(formatType: FormatsAllowed): IFormatter | undefined {
    return this._formatHelpersMap.get(formatType);
  }
}
*/
