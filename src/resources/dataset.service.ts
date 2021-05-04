import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/services/db/prisma.service';
import { Prisma, Order, Client } from '.prisma/client';
import { DatasetType } from './dataset/models';

@Injectable()
export class DatasetService {
  constructor(private readonly prisma: PrismaService) {}

  async listDatasets(
    datasetType: DatasetType,
    options: {
      limit?: number;
      cursor?: Prisma.OrderWhereUniqueInput;
    } = { limit: 10, cursor: undefined },
  ): Promise<Order[] | Client[]> {
    if (!(datasetType in this.prisma)) {
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
