import { Controller, Get } from '@nestjs/common';
import { FormatterRegistry } from 'src/domain/formatter';

@Controller('formats')
export class FormatsController {
  constructor(private readonly _formatterRegister: FormatterRegistry) {}
  @Get('/')
  listAll() {
    return this._formatterRegister.listAllIds();
  }
}
