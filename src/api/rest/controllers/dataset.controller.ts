import {
  BadRequestException,
  Controller,
  Response,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import {
  ApiParam,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiQuery,
  ApiOkResponse,
  ApiProduces,
} from '@nestjs/swagger';

import {
  IDatasetMetadata,
  DatasetService,
  IDatasetFetchOptions,
} from '../../../domain/dataset';
import { FormatterService } from '../../../domain/formatter';

import { MapToJsonPipe } from '../pipes/map-to-json.pipe';
import { ResourceMetadata } from '../dto';
import { DatasetFiltersParserPipe } from '../pipes/dataset-filters-parser.pipe';

/*@PipeTransform()
class FilterToJson {
  trans
}*/

@Controller('datasets')
export class DatasetController {
  constructor(
    private readonly _datasetService: DatasetService,
    private readonly _formatterService: FormatterService,
  ) {}

  @Get('/:datasetId/export')
  @ApiOkResponse({
    isArray: true,
  })
  @ApiBadRequestResponse({
    description: 'Query param value empty or not supported',
  })
  @ApiNotFoundResponse({
    description: 'Dataset not found',
  })
  @ApiParam({
    name: 'datasetId',
    type: 'string',
    required: true,
  })
  @ApiQuery({
    name: 'format',
    type: 'string',
    required: true,
  })
  @ApiQuery({
    name: 'filters',
    type: 'string',
    required: false,
  })
  @ApiQuery({
    name: 'orderby',
    type: 'string',
    description: '',
    example: 'name:asc',
    required: false,
  })
  async getDatasetExported(
    @Param('datasetId') datasetId: IDatasetMetadata['id'],
    @Query('format') formatExpected: string,
    @Query('orderby', MapToJsonPipe) orderBy: IDatasetFetchOptions['orderBy'],
    @Query('limit') limit: IDatasetFetchOptions['limit'],
    @Query('filters', DatasetFiltersParserPipe)
    filters: IDatasetFetchOptions['filters'],
    @Response() httpResponse: FastifyReply,
  ) {
    try {
      const dataFormatter = this._formatterService.getFormatterById(
        formatExpected,
      );
      const dataStream = await this._datasetService.getDatasetItems(datasetId, {
        orderBy,
        limit,
        filters,
      });

      const { formattedStream, contentType } = await dataFormatter.format(
        dataStream,
      );
      return httpResponse
        .headers({
          'Content-Type': contentType,
        })
        .send(formattedStream);
    } catch (e) {
      if (e instanceof Error) {
        throw new BadRequestException((e as Error).message);
      } else {
        throw e;
      }
    }
  }

  @Get('/:datasetId/items')
  @ApiProduces('application/json')
  @ApiOkResponse({
    isArray: true,
    description: 'dataset items as JSON',
  })
  @ApiBadRequestResponse({
    description: 'Query param value empty or not supported',
  })
  @ApiNotFoundResponse({
    description: 'Dataset not found',
  })
  @ApiParam({
    name: 'datasetId',
    type: 'string',
    required: true,
  })
  @ApiQuery({
    name: 'format',
    type: 'string',
    required: true,
  })
  @ApiQuery({
    name: 'filters',
    type: 'json',
    required: false,
  })
  @ApiQuery({
    name: 'orderby',
    type: 'string',
    description: '',
    example: 'name:asc',
    required: false,
  })
  async getDatasetItems(
    @Param('datasetId') datasetId: IDatasetMetadata['id'],
    @Query('orderby', MapToJsonPipe) orderBy: IDatasetFetchOptions['orderBy'],
    @Query('limit') limit: IDatasetFetchOptions['limit'],
    @Query('filters', DatasetFiltersParserPipe)
    filters: IDatasetFetchOptions['filters'],
  ) {
    return this._datasetService.getDatasetItems(datasetId, {
      orderBy,
      limit,
      filters,
    });
  }

  @Get('/')
  @ApiOkResponse({
    status: 201,
    type: ResourceMetadata,
    isArray: true,
    description: 'Datasets available',
  })
  async listDatasets() {
    return this._datasetService.listAllIds();
  }
}
