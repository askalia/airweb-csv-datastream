import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { FormatterService } from '../../../domain/formatter';
import { ResourceMetadata } from '../dto';

@Controller('formats')
export class FormatsController {
  constructor(private readonly _formatterRegister: FormatterService) {}
  @Get('/')
  @ApiOkResponse({
    status: 201,
    type: ResourceMetadata,
    isArray: true,
    description: 'Formats available',
  })
  listAll() {
    return this._formatterRegister.listAllIds();
  }
}
