import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class MapToJsonPipe implements PipeTransform {
  transform(
    stringMap: string,
    metadata: ArgumentMetadata,
  ): Record<string, string | number> {
    if (stringMap === undefined || stringMap === null) {
      return undefined;
    }
    const [field, value] = stringMap.split(':');
    return {
      [field]: value,
    };
  }
}
