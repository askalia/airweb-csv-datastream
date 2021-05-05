import { Controller, Get } from '@nestjs/common';
import { FormatsService } from '../../../domain/formats/formats.service';

@Controller('formats')
export class FormatsController {
  constructor(private readonly _formatService: FormatsService) {}
  @Get()
  listAll() {
    return this._formatService.listFormats();
  }
}
