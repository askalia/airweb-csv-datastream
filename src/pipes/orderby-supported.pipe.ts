import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { OrderBy, OrderByDirection } from '../modules/common/models';

@Injectable()
export class OrderbySupportedPipe implements PipeTransform {
  transform(orderby: Record<string, string>, metadata: ArgumentMetadata) {
    if (orderby === undefined || orderby === null) {
      return orderby;
    }
    const [, direction] = Object.entries(orderby as OrderBy)[0];

    const refDirections = Object.values(OrderByDirection);

    if (!refDirections.includes(direction.toLowerCase() as OrderByDirection)) {
      throw new BadRequestException(
        `direction '${direction}' is not supported'. Must be one of : asc, desc`,
      );
    }
    return orderby;
  }
}
