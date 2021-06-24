import { Controller, Get } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { SwaggerService } from '../services/swagger.service';

@Controller('swagger')
export class SwaggerController {
  constructor(private readonly swagger: SwaggerService) {}

  @Get('')
  @ApiExcludeEndpoint()
  getSwaggerInterface() {
    return this.swagger.getInterface('/swagger/swagger.json');
  }
  @Get('swagger.json')
  @ApiExcludeEndpoint()
  getSwagger() {
    return this.swagger.getDocument();
  }
}
