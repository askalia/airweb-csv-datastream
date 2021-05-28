import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class StringToJsonPipe implements PipeTransform {
  transform(jsonString: string, metadata: ArgumentMetadata) {
    return !jsonString ? undefined : JSON.parse(jsonString || '{}');
  }
}
