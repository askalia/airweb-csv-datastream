import { Order, Client } from '.prisma/client';
import {
  BadRequestException,
  Controller,
  Response,
  Get,
  Param,
  Headers,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';

import { FormatsAllowed } from '../../../domain/formatter/models/formats-allowed.model';
import formatterHelpers from '../../../common/providers/serializers/formatter/helpers/formatter.helper';
import { IDataset } from 'src/domain/dataset/models/dataset.abstract.model';
import { DatasetRegistry } from 'src/domain/dataset/dataset-registry.service';
import { FormatterRegistry } from 'src/domain/formatter';
import { DatasetFilters } from 'src/domain/dataset/models/dataset-filers.model';

@Controller('datasets')
export class DatasetController {
  constructor(
    private readonly _datasetRegistry: DatasetRegistry,
    private readonly _formatterRegistry: FormatterRegistry,
  ) {}

  @Get('/:datasetId/export')
  async findDataset(
    @Param('datasetId')
    datasetId: string,
    //@Query('format') format: 'csv',
    @Query('format')
    formatExpected: keyof typeof FormatsAllowed | string,
    @Query('filters')
    filters: string,
    @Response()
    httpResponse: FastifyReply,
  ) {
    console.log('filters : ', `|${filters}|`);
    try {
      if (!this._formatterRegistry.validateFormat(formatExpected)) {
        throw new BadRequestException(
          `format '${formatExpected}' is empty or not supported. Please check supported formats : ${process.env.HOST_URL}/formats`,
        );
      }

      const dataset = this._datasetRegistry.getById(datasetId);
      if (!this._datasetRegistry.validateDataset(dataset)) {
        throw new NotFoundException(
          `Dataset '${datasetId}' not found. Please check available Datasets : ${process.env.HOST_URL}/datasets`,
        );
      }

      const dataStream = await dataset.fetch({
        filters: JSON.parse(filters || '{}'),
      });

      const formatter = this._formatterRegistry.getById(formatExpected);
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
  async listDatasets() {
    return this._datasetRegistry.listAllIds();
  }
}
