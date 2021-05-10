import { SetMetadata } from '@nestjs/common';

export const DATASET_DECORATOR_TAG = 'Dataset';

export const DatasetProvider = (...args: string[]) =>
  SetMetadata(DATASET_DECORATOR_TAG, args);
