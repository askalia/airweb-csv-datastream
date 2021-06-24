import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { FilterService } from '../modules/filters/filter.service';

@Injectable()
export class DatasetFiltersParserPipe implements PipeTransform {
  constructor(private readonly filterService: FilterService) {}
  transform(
    stringMap: string | undefined,
    metadata: ArgumentMetadata,
  ): unknown | undefined {
    if (stringMap === undefined) {
      return undefined;
    }
    const parsedAsFilters = this.filterService.parseFilters(stringMap);
    const whereClause = this.filterService.toWhereClause(parsedAsFilters);
    return whereClause;
  }
}
