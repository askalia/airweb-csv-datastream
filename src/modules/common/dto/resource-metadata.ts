import { IDatasetMetadata } from '../models';
import { ApiProperty } from '@nestjs/swagger';

export class ResourceMetadata implements IDatasetMetadata {
  @ApiProperty({
    name: 'id',
    type: 'string',
    required: true,
  })
  id: IDatasetMetadata['id'];
  @ApiProperty({
    name: 'description',
    type: 'string',
    required: true,
  })
  description: IDatasetMetadata['description'];

  @ApiProperty({
    name: 'filterables',
    type: 'string',
    isArray: true,
    required: false,
  })
  filterables: IDatasetMetadata['filterables'];
}
