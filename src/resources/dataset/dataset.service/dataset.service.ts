import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/services/db/prisma.service';

@Injectable()
export class DatasetService {
  constructor(private readonly prisma: PrismaService) {}
}
