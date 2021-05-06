import { Injectable } from '@nestjs/common';
import { FormatsAllowed } from '../formatter/models/formats-allowed.model';

@Injectable()
export class FormatsService {
  listFormats(): string[] {
    return Object.values(FormatsAllowed);
  }
}
