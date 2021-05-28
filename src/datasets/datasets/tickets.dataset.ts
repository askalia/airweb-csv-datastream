import { Prisma } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { IDataset, IDatasetFetchOptions, Snapshot } from '../../common/models';
import { DatasetProvider } from '../dataset.decorator';
import { Readable } from 'stream';

const decorator = {
  id: 'tickets',
  description: 'retrieves Tickets',
};

@Injectable()
@DatasetProvider(decorator)
export class TicketsDataset extends IDataset {
  constructor() {
    super(decorator.id);
  }
  async fetch(
    options: IDatasetFetchOptions<TicketsDatasetFilters>,
  ): Promise<Snapshot> {
    this.checkSetup();
    return this?.orm?.ticket?.findMany({
      ...this.getQueryCommons<TicketsDatasetFilters>(options),
      select: {
        id: true,
        active: true,
        code: true,
        product: {
          select: {
            id: true,
            image: true,
            active: true,
            fares: true,
          },
        },
      },
    });
  }

  fetchAsStream(
    options: IDatasetFetchOptions<TicketsDatasetFilters>,
  ): Readable {
    this.checkSetup();
    return new Readable();
  }
}

export type TicketsDatasetFilters = Prisma.TicketWhereInput;
