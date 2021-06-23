import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { FormatterService } from '../modules/formatters';

@Injectable()
export class FormatSupportedPipe implements PipeTransform {
  constructor(private readonly _formatterRegister: FormatterService) {}
  transform(format: string, metadata: ArgumentMetadata) {
    if (!this._formatterRegister.checkFormatIsDefined(format)) {
      throw new BadRequestException('format must be provided');
    }

    if (!this._formatterRegister.validateFormat(format)) {
      const supportedFormats = this._formatterRegister
        .listAllMetadata()
        .map(({ id }) => id);

      throw new BadRequestException(
        `format '${format}' is not supported. Must be one of : ${supportedFormats.join(
          ', ',
        )}`,
      );
    }
    return format;
  }
}
