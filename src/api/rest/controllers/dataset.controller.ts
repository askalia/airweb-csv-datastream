import { Order, Client } from '.prisma/client';
import {
  BadRequestException,
  Controller,
  Response,
  Get,
  Param,
  Headers,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';

import { FormatterFactoryService } from '../../../common/providers/serializers/formatter/formatter.factory';
import { DatasetFetcherService } from '../../../domain/dataset';
import { DatasetType } from '../../../domain/dataset/models';
import { FormatsAllowed } from '../../../common/providers/serializers/formatter/formats-allowed.model';
import formatterHelpers from '../../../common/providers/serializers/formatter/helpers/formatter.helper';

@Controller('datasets')
export class DatasetController {
  constructor(
    private readonly _datasetFetcher: DatasetFetcherService,
    private readonly _formatterFactory: FormatterFactoryService,
  ) {}

  @Get('/:datasetType')
  async findAll(
    @Param('datasetType') datasetType: DatasetType,
    @Headers('Accept') headerAccept: FormatsAllowed | string,
    @Response() httpResponse: FastifyReply,
  ) {
    try {
      const snapshot = await this._datasetFetcher.fetch(datasetType);

      // output as downloable file
      if (formatterHelpers.validateFileFormat(headerAccept)) {
        const {
          contentType,
          filename,
          stream,
        } = await this._formatterFactory.format<Order | Client>(
          snapshot,
          formatterHelpers.getFileFormatFromHttpHeader(headerAccept),
          datasetType,
        );

        return httpResponse
          .headers({
            'Content-Type': contentType,
            'Content-Disposition': `attachment; filename=${filename}`,
          })
          .send(stream);
      } else {
        // output as flat data
        return httpResponse.send(snapshot);
      }
    } catch (e) {
      throw new BadRequestException((e as Error).message);
    }
  }

  @Get('/')
  async noFindAllWithoutDatasetType() {
    throw new BadRequestException(`dataset type must be provided`);
  }
}
