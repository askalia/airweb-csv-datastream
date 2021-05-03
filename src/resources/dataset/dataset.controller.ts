import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import { DatasetService } from '../dataset.service';
import { DatasetType } from './models/dataset-type.enum';

@Controller('datasets')
export class DatasetController {
  constructor(private readonly _datasetService: DatasetService) {}

  @Get('/:datasetType')
  async findAll(@Param('datasetType') datasetType: DatasetType) {
    if (datasetType === undefined) {
      throw new BadRequestException(
        `'${datasetType}' is a unsupported type of dataset`,
      );
    }
    try {
      return await this._datasetService.listDatasets(datasetType);
    } catch (e) {
      throw new BadRequestException((e as Error).message);
    }
  }

  @Get('/')
  async noFindAllWithoutDatasetType() {
    throw new BadRequestException(`dataset type must be provided`);
  }
}
