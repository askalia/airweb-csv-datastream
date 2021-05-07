import { Injectable } from '@nestjs/common';
import { IFormatter } from './models/iformatter.model';

import { CSVFormatter, CSVZippedFormatter, XMLFormatter } from './formatters';
import { IDatasetMetadata } from '../dataset/models';

@Injectable()
export class FormatterService {
  private registry = new Map<string, typeof IFormatter>();
  constructor() {
    this._register(CSVFormatter, CSVZippedFormatter, XMLFormatter);
  }

  private _register(...formatters: typeof IFormatter[]) {
    formatters.forEach((formatterClass) => {
      this.registry.set(IFormatter.id, formatterClass);
    });
  }

  getFormatterById(id: string): IFormatter {
    if (!this.registry.has(id)) {
      return undefined;
    }
    const formatterClass = this.registry.get(id) as any;
    return new formatterClass() as IFormatter;
  }

  validateFormat(format: string): boolean {
    return Array.from(this.registry.keys()).includes(format);
  }

  listAllIds(): IDatasetMetadata[] {
    return Array.from(this.registry.values()).map((dsClassRef) => ({
      id: dsClassRef.id,
      description: dsClassRef.description,
    }));
  }
}
