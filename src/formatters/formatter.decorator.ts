import { SetMetadata } from '@nestjs/common';
import { IFormatterMetadata } from './models';

export const FORMATTER_TAG = 'FormatterDecorator';

//export const Formatter = (...args: string[]) => SetMetadata('formatter', args);

export const FormatterProvider = (metadata: IFormatterMetadata) =>
  SetMetadata(FORMATTER_TAG, metadata);
