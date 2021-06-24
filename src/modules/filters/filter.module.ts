import { Module } from '@nestjs/common';
import { DiscoveryModule, DiscoveryService } from '@nestjs/core';
import { FilterProvider, FILTER_TAG } from './filter.decorator';
import { FilterService } from './filter.service';

import * as advancedFilters from './filters/index';

@Module({
  imports: [DiscoveryModule],
  //providers: [FilterService],
  providers: Object.values(advancedFilters),
})
export class FilterModule {
  constructor(private discovery: DiscoveryService) {}
  onModuleInit() {
    this._registerFilters();
  }
  private _registerFilters() {
    const providers = this.discovery.getProviders();

    const filterService = providers.find((pv) => pv.name === 'FilterService');

    const filtersProviders = providers
      .filter(
        (pv) => pv.metatype && Reflect.getOwnMetadata(FILTER_TAG, pv.metatype),
      )
      .map((pv) => {
        return {
          metadata: Reflect.getOwnMetadata(FILTER_TAG, pv.metatype),
          provider: pv.instance,
        };
      });

    filterService.instance.register(filtersProviders);
  }
}
