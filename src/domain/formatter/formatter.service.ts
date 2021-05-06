import { Injectable } from '@nestjs/common';
import { IFormatter } from './models/iformatter.model';

import { CSVFormatter, CSVZippedFormatter, XMLFormatter } from './formatters';
import { IDatasetMetadata } from '../dataset/models/dataset.abstract.model';

@Injectable()
export class FormatterService {
  private registry: Map<string, any> = new Map<string, any>();
  constructor() {
    this._register(CSVFormatter, CSVZippedFormatter, XMLFormatter);
  }

  private _register(...formatters: any[]) {
    formatters.forEach((formatterClass) => {
      this.registry.set(formatterClass.id, formatterClass);
    });
  }

  getFormatterById(id: string): IFormatter {
    if (!this.registry.has(id)) {
      return undefined;
    }
    const formatter = this.registry.get(id);
    return new formatter();
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
