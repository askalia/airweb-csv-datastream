import { Prisma } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { IDataset, IDatasetFetchOptions } from '../../common/models';
import { DatasetProvider } from '../dataset.decorator';
import { Snapshot } from '../../common/models/snapshot.model';
import { Readable } from 'stream';

const decorator = {
  id: 'users',
  description: 'retrieves Users',
};

@Injectable()
@DatasetProvider(decorator)
export class UsersDataset extends IDataset {
  constructor() {
    super(decorator.id);
  }
  async fetch(
    options: IDatasetFetchOptions<UsersDatasetFilters>,
  ): Promise<Snapshot> {
    this.checkSetup();
    return this?.orm?.user?.findMany({
      ...this.getQueryCommons<UsersDatasetFilters>(options),
      select: {
        id: true,
        active: true,
        address: true,
        avatarUrl: true,
        lastname: true,
        firstname: true,
        email: true,
      },
    });
  }

  getSelectedFields() {
    return [];
  }

  fetchAsStream(options: IDatasetFetchOptions<UsersDatasetFilters>): Readable {
    this.checkSetup();
    return new Readable();
  }
}

export type UsersDatasetFilters = Prisma.UserWhereInput;
