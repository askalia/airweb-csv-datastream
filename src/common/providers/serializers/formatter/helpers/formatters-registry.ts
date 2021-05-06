/*import { IFormatter } from '../iformatter.model';

const registry: Map<string, IFormatter> = new Map<string, IFormatter>();

const combinations = {
  csv: 'csv',
  'csv+zip': ['csv', 'zip'],
};

export function registerFormatter(id: string, formatter: IFormatter) {
  registry.set(id, formatter);
}

export function getFormatter(formatterId: string): IFormatter | undefined {
  return undefined; // registry.get(formatterId);
}

export const formattersRegistry = {
  registerFormatter,
  getFormatter,
};

import { registerCSV } from './csv/csv-formatter.helper';

export const registerAllFormatters = () => {
  registerCSV();
};
*/
