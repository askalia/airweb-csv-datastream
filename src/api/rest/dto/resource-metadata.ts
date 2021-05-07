import { IDatasetMetadata } from 'src/domain/dataset';
import { ApiProperty } from '@nestjs/swagger';

export class ResourceMetadata implements IDatasetMetadata {
  @ApiProperty({
    name: 'id',
    type: 'string',
  })
  id: IDatasetMetadata['id'];
  @ApiProperty({
    name: 'description',
    type: 'string',
  })
  description: IDatasetMetadata['description'];
}
