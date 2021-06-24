import { SetMetadata } from '@nestjs/common';
import { IFilterMetadata } from '../common/models';

export const FILTER_TAG = 'FilterDecorator';

export const FilterProvider = (metadata: IFilterMetadata) =>
  SetMetadata(FILTER_TAG, metadata);
