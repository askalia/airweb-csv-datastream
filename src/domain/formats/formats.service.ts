import { Injectable } from '@nestjs/common';
import { FormatsAllowed } from '../../common/providers/serializers/formatter/formats-allowed.model';

@Injectable()
export class FormatsService {
  listFormats(): string[] {
    return Object.values(FormatsAllowed);
  }
}
