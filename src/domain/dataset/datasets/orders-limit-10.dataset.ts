import { PrismaService } from 'src/common/providers/db/prisma.service';
import { IDataset } from '../models/dataset.abstract.model';
import { Snapshot } from '../models/snapshot.model';

export class OrdersLimit10Dataset extends IDataset {
  static id = 'orders-limit-10';
  static description = 'retrieves the 10 first Orders';

  async fetch({ filters }): Promise<Snapshot> {
    const DEFAULT_LIMIT = 50;
    this._stream = await this.orm.order.findMany({
      take: filters?.limit || DEFAULT_LIMIT,
    });
    return this._stream;
  }
}
