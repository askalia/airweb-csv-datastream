import { Module, OnModuleInit } from '@nestjs/common';
import { DiscoveryModule, DiscoveryService } from '@nestjs/core';
import { CommonModule } from '../common/common.module';
import { DATASET_TAG } from './dataset.decorator';
import * as datasets from './datasets/index';
import { FilterModule } from './filter';

@Module({
  imports: [DiscoveryModule, CommonModule, FilterModule],
  providers: Object.values(datasets),
})
export class DatasetModule implements OnModuleInit {
  constructor(private discovery: DiscoveryService) {}
  onModuleInit() {
    this._registerDatasets();
  }

  private _registerDatasets() {
    const providers = this.discovery.getProviders();

    const datasetService = providers.find((pv) => pv.name === 'DatasetService');

    const datasetsProviders = providers
      .filter(
        (pv) => pv.metatype && Reflect.getOwnMetadata(DATASET_TAG, pv.metatype),
      )
      .map((pv) => {
        return {
          metadata: Reflect.getOwnMetadata(DATASET_TAG, pv.metatype),
          provider: pv.instance,
        };
      });
    datasetService.instance.register(datasetsProviders);
  }
}
