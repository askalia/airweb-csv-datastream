import { IAdvancedFilter } from '../../common/models';
import { Injectable } from '@nestjs/common';
import { FilterProvider } from '../filter.decorator';

@Injectable()
@FilterProvider({
  id: 'period',
  description: 'filters a date-based prop between two dates',
  targettedProps: ['transferredAt'],
})
export class PeriodFilter implements IAdvancedFilter {
  getFilterAsWhere(rawFilterValue: string) {
    const [dateFrom, dateTo] = rawFilterValue.split('|');
    return [
      {
        transferredAt: {
          gte: typeof dateFrom === 'string' ? new Date(dateFrom) : dateFrom,
          lte: typeof dateTo === 'string' ? new Date(dateTo) : dateTo,
        },
      },
    ];
  }
}
