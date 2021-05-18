import {
  BadRequestException,
  Controller,
  Response,
  Get,
  Param,
  Query,
  ParseIntPipe,
  ExceptionFilter,
  ArgumentsHost,
  Catch,
  UseFilters,
  ParseBoolPipe,
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
import { FormatterService, IFormatter } from '../../../domain/formatter';

import { MapToJsonPipe } from '../pipes/map-to-json.pipe';
import { ResourceMetadata } from '../dto';
import { DatasetFiltersParserPipe } from '../pipes/dataset-filters-parser.pipe';
import { FormatSupportedPipe } from '../pipes/format-supported.pipe';
import { OrderbySupportedPipe } from '../pipes/orderby-supported.pipe';

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
  @ApiQuery({
    name: 'stream',
    type: 'boolean',
    description: 'reply with data as a stream (default is false)',
    required: false,
  })
  async getDatasetExported(
    @Param('datasetId')
    datasetId: IDatasetMetadata['id'],
    @Query('format', FormatSupportedPipe)
    formatExpected: string,
    @Query('orderby', MapToJsonPipe, OrderbySupportedPipe)
    orderBy: IDatasetFetchOptions['orderBy'],
    @Query('limit', ParseIntPipe)
    limit: IDatasetFetchOptions['limit'],
    @Query('filters', DatasetFiltersParserPipe)
    filters: IDatasetFetchOptions['filters'],
    @Query('stream', ParseBoolPipe)
    asStream = false,
    @Response() httpResponse: FastifyReply,
  ) {
    try {
      const _responseAsBuffer = async (formatter: IFormatter) => {
        const dataStream = await this._datasetService.getDatasetItems(
          datasetId,
          {
            orderBy,
            limit,
            filters,
          },
        );

        const { formattedStream, contentType } = await formatter.format(
          dataStream,
        );
        return httpResponse
          .headers({
            'Content-Type': contentType,
          })
          .send(formattedStream);
      };

      const _responseAsStream = (formatter: IFormatter) => {
        this._datasetService
          .getDatasetItemsAsStream(datasetId, {
            orderBy,
            limit,
            filters,
          })
          .on('data', (data) => {
            formatter.format(data).then(({ formattedStream, contentType }) => {
              httpResponse
                .headers({
                  'Content-Type': contentType,
                })
                .send(formattedStream);
            });
          });
      };

      const dataFormatter = this._formatterService.getFormatterById(
        formatExpected,
      );
      const responseAs =
        asStream === true ? _responseAsStream : _responseAsBuffer;

      return responseAs(dataFormatter);
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
    @Query('orderby', MapToJsonPipe, OrderbySupportedPipe)
    orderBy: IDatasetFetchOptions['orderBy'],
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
    return this._datasetService.listAllMetadata();
  }
}
