import { Module } from '@nestjs/common';
import { DiscoveryModule, DiscoveryService } from '@nestjs/core';
import { FORMATTER_TAG } from './formatter.decorator';

import * as formatters from './formatters/index';

@Module({
  imports: [DiscoveryModule],
  providers: Object.values(formatters),
})
export class FormatterModule {
  constructor(private discovery: DiscoveryService) {}
  async onModuleInit() {
    this._registerFormatters();
  }

  private _registerFormatters() {
    const providers = this.discovery.getProviders();

    const formatterService = providers.find(
      (pv) => pv.name === 'FormatterService',
    );

    const formattersProviders = providers
      .filter(
        (pv) =>
          pv.metatype && Reflect.getOwnMetadata(FORMATTER_TAG, pv.metatype),
      )
      .map((pv) => {
        return {
          metadata: Reflect.getMetadata(FORMATTER_TAG, pv.metatype),
          provider: pv.instance,
        };
      });

    formatterService.instance.register(formattersProviders);
  }
}
