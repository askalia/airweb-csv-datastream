import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/providers/db/prisma.service';
import { Prisma, Order, Client } from '.prisma/client';
import { DatasetType } from './models';
import helpers from './dataset.helpers';
import { Snapshot } from 'src/common/providers/serializers/formatter/snapshot.model';

@Injectable()
export class DatasetFetcherService {
  constructor(private readonly prisma: PrismaService) {}

  async fetch(
    datasetType: DatasetType,
    options: {
      limit?: number;
      cursor?: Prisma.OrderWhereUniqueInput;
    } = { limit: 10, cursor: undefined },
  ): Promise<Snapshot> {
    if (
      !helpers.validateDatasetType(datasetType) ||
      !(datasetType in this.prisma)
    ) {
      return Promise.reject(
        new Error(`datatype '${datasetType}' is not supported`),
      );
    }
    return (this.prisma[
      datasetType
    ] as Prisma.OrderDelegate<unknown>)?.findMany({
      take: options.limit,
      cursor: options.cursor,
    });
  }
}
