import { Order, Client } from '.prisma/client';
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

import { IDatasetMetadata, DatasetService } from '../../../domain/dataset';
import { FormatterService } from '../../../domain/formatter';

@Controller('datasets')
export class DatasetController {
  constructor(
    private readonly _datasetService: DatasetService,
    private readonly _formatterService: FormatterService,
  ) {}

  @Get('/:datasetId/export')
  async findDataset(
    @Param('datasetId') datasetId: IDatasetMetadata['id'],
    @Query('format') formatExpected: string,
    @Query('filters') filters: string,
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
        filters: JSON.parse(filters || '{}'),
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
  async listDatasets() {
    return this._datasetService.listAllIds();
  }
}
