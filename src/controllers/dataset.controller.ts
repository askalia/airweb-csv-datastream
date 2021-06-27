import {
  BadRequestException,
  Controller,
  Response,
  Get,
  Param,
  Query,
  ParseBoolPipe,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { Response as HttpResponse } from 'express';
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
  IDatasetFetchOptions,
  IFormatter,
} from '../modules/common/models';
import { DatasetService } from '../modules/datasets';
import { FormatterService } from '../modules/formatters';

import {
  OrderbySupportedPipe,
  FormatSupportedPipe,
  MapToJsonPipe,
  DatasetFiltersParserPipe,
  OptionableParseTypePipe,
} from '../pipes';
import { ResourceMetadata } from '../modules/common/dto';
import { DatasetExportGuard } from '../guards/dataset-export.guard';
import { FilterService } from 'src/modules/filters';

@Controller('datasets')
export class DatasetController {
  constructor(
    private readonly _datasetService: DatasetService,
    private readonly _formatterService: FormatterService,
    private readonly _filterService: FilterService,
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
    example: 'orders',
  })
  @ApiQuery({
    name: 'format',
    type: 'string',
    required: true,
    example: 'csv',
  })
  @ApiQuery({
    name: 'filters',
    type: 'string',
    required: false,
    example: 'total>=20;code>"1000"',
  })
  @ApiQuery({
    name: 'orderby',
    type: 'string',
    description: '',
    example: 'status:asc',
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    type: 'number',
    description: '',
    required: false,
  })
  @ApiQuery({
    name: 'stream',
    type: 'boolean',
    description: 'reply with data as a stream (default is false)',
    required: false,
    example: 'false',
  })
  @UseGuards(DatasetExportGuard)
  async getDatasetExported(
    @Param('datasetId')
    datasetId: IDatasetMetadata['id'],
    @Query('format', FormatSupportedPipe)
    formatExpected: string,
    @Query('orderby', MapToJsonPipe, OrderbySupportedPipe)
    orderBy: IDatasetFetchOptions['orderBy'],
    @Query('limit', { transform: OptionableParseTypePipe(ParseIntPipe) })
    limit: IDatasetFetchOptions['limit'],
    @Query('filters', DatasetFiltersParserPipe)
    filters: IDatasetFetchOptions['filters'],
    @Query('stream', { transform: OptionableParseTypePipe(ParseBoolPipe) })
    asStream = false,
    @Response()
    httpResponse: HttpResponse,
  ) {
    const _responseAsBuffer = async (formatter: IFormatter) => {
      try {
        const {
          dataStream,
          fields,
        } = await this._datasetService.getDatasetItems(datasetId, {
          orderBy,
          limit,
          filters,
        });

        const { formattedStream, contentType } = await formatter.format(
          dataStream,
          {
            fields,
          },
        );
        httpResponse.setHeader('Content-Type', contentType);

        return httpResponse.send(formattedStream);
      } catch (e) {
        if (e instanceof Error) {
          throw new BadRequestException((e as Error).message);
        } else {
          throw e;
        }
      }
    };

    const _responseAsStream = async (formatter: IFormatter) => {
      const {
        dataStream,
        fields,
      } = this._datasetService.getDatasetItemsAsStream(datasetId, {
        orderBy,
        limit,
        filters,
      });

      formatter.formatAsync({
        inputStream: dataStream,
        output: httpResponse,
        chunkSize: Number(process.env.DATASET_DEFAULT_CHUNKING),
        options: {
          fields,
        },
      });
    };

    const dataFormatter = this._formatterService.getFormatterById(
      formatExpected,
    );
    const responseAs =
      asStream === true ? _responseAsStream : _responseAsBuffer;

    responseAs(dataFormatter);
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
    description: 'semi-colon (;) separated filters',
  })
  @ApiQuery({
    name: 'orderby',
    type: 'string',
    description: '',
    example: 'name:asc',
    required: false,
  })
  async getDatasetItems(
    @Param('datasetId')
    datasetId: IDatasetMetadata['id'],
    @Query('orderby', MapToJsonPipe, OrderbySupportedPipe)
    orderBy: IDatasetFetchOptions['orderBy'],
    @Query('limit', { transform: OptionableParseTypePipe(ParseIntPipe) })
    limit: IDatasetFetchOptions['limit'],
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

  @Get('/filters')
  @ApiOkResponse({
    status: 201,
    type: ResourceMetadata,
    isArray: true,
    description: 'Advanced filters available and applicable to a dataset',
  })
  async listAdvancedFilters() {
    return this._filterService
      .listTargettedProps()
      .map(({ id, description }) => ({ id, description }));
  }
}
