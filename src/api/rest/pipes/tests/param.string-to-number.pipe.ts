import { ParseIntPipe } from '@nestjs/common';

export const QueryParseIntPipe = (value: string | undefined) =>
  value === undefined ? value : ParseIntPipe;
