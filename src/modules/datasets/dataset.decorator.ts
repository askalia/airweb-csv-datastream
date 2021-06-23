import { SetMetadata } from '@nestjs/common';
import { IDatasetMetadata } from '../common/models';

export const DATASET_TAG = 'DatasetDecorator';

export const DatasetProvider = (metadata: IDatasetMetadata) =>
  SetMetadata(DATASET_TAG, metadata);
