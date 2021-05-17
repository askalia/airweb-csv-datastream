import {
  BadRequestException,
  Controller,
  Response,
  Get,
  Param,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import {
  ApiParam,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiQuery,
  ApiOkResponse,
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
  async getDataset(
    @Param('datasetId') datasetId: IDatasetMetadata['id'],
    @Query('format') formatExpected: string,
    @Query('orderby', MapToJsonPipe) orderBy: IDatasetFetchOptions['orderBy'],
    @Query('limit') limit: IDatasetFetchOptions['limit'],
    @Query('filters', DatasetFiltersParserPipe)
    filters: IDatasetFetchOptions['filters'],
    @Response() httpResponse: FastifyReply,
  ) {
    try {
      if (!this._formatterService.validateFormat(formatExpected)) {
        throw new BadRequestException(
          `format '${formatExpected}' is empty or not supported. Please check supported formats : ${process.env.HOST_URL}/formats`,
        );
      }

      const dataset = this._datasetService.getDatasetById(datasetId);
      if (!this._datasetService.validateDataset(dataset)) {
        throw new NotFoundException(
          `Dataset '${datasetId}' not found. Please check available Datasets : ${process.env.HOST_URL}/datasets`,
        );
      }

      const dataStream = await dataset.fetch({
        orderBy,
        limit,
        filters,
      });

      const formatter = this._formatterService.getFormatterById(formatExpected);
      const { formattedStream, contentType } = await formatter.format(
        dataStream,
      );
      return httpResponse
        .headers({
          'Content-Type': contentType,
        })
        .send(formattedStream);
    } catch (e) {
      throw new BadRequestException((e as Error).message);
    }
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
