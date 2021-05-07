import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class MapToJsonPipe implements PipeTransform {
  transform(stringMap: string, metadata: ArgumentMetadata) {
    const [field, value] = stringMap.split(':');
    return {
      [field]: value,
    };
  }
}
