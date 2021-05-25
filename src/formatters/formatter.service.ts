import { Injectable, NotFoundException, Scope } from '@nestjs/common';
import { IFormatter, IFormatterMetadata } from './models/iformatter.model';

import { IDatasetMetadata } from '../datasets/models';

interface FormatterRegistryItem {
  metadata: IFormatterMetadata;
  provider: IFormatter;
}

@Injectable({
  scope: Scope.DEFAULT,
})
export class FormatterService {
  private registry = new Map<string, FormatterRegistryItem>();

  public register(
    formatters: { metadata: IFormatterMetadata; provider: IFormatter }[],
  ) {
    if (this.registry.size > 0) {
      throw new Error('Formatters Registry must not be set again');
    }
    formatters.forEach((formatter) => {
      this.registry.set(formatter.metadata.id, {
        metadata: formatter.metadata,
        provider: formatter.provider,
      });
    });
  }

  getFormatterById(id: string): IFormatter | undefined {
    if (!this.validateFormat(id)) {
      throw new NotFoundException(
        `format '${id}' is empty or not supported. Please check supported formats : ${process.env.HOST_URL}/formats`,
      );
    }
    return this.registry.get(id)?.provider;
  }

  checkFormatIsDefined(format: string): boolean {
    return !(format === undefined || format === null || format?.trim() === '');
  }

  validateFormat(format: string): boolean {
    this.checkFormatIsDefined(format);
    return Array.from(this.registry.keys()).includes(format.toLowerCase());
  }

  listAllMetadata(): IDatasetMetadata[] {
    const sortAsc = (provider, providerNext) => {
      return provider.id < providerNext.id ? -1 : 1;
    };
    return Array.from(this.registry.values())
      .map(({ metadata: { id, description } }) => ({
        id,
        description,
      }))
      .sort(sortAsc);
  }
}
