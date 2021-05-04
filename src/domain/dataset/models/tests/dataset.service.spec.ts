import { Test, TestingModule } from '@nestjs/testing';
import { DatasetsServiceService } from './datasets-service.service';

describe('DatasetsServiceService', () => {
  let service: DatasetsServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DatasetsServiceService],
    }).compile();

    service = module.get<DatasetsServiceService>(DatasetsServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
