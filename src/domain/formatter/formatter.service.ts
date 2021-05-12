import { Injectable, Scope } from '@nestjs/common';
import { IFormatter, IFormatterMetadata } from './models/iformatter.model';

import { IDatasetMetadata } from '../dataset/models';

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
    if (!this.registry.has(id)) {
      return undefined;
    }
    return this.registry.get(id)?.provider;
  }

  validateFormat(format: string): boolean {
    return Array.from(this.registry.keys()).includes(format);
  }

  listAllIds(): IDatasetMetadata[] {
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
