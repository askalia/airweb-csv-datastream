import { Controller, Get } from '@nestjs/common';
import { FormatterService } from '../../../domain/formatter';

@Controller('formats')
export class FormatsController {
  constructor(private readonly _formatterRegister: FormatterService) {}
  @Get('/')
  listAll() {
    return this._formatterRegister.listAllIds();
  }
}
