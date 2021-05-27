import { SetMetadata } from '@nestjs/common';
import { IFormatterMetadata } from '../common/models';

export const FORMATTER_TAG = 'FormatterDecorator';

export const FormatterProvider = (metadata: IFormatterMetadata) =>
  SetMetadata(FORMATTER_TAG, metadata);
