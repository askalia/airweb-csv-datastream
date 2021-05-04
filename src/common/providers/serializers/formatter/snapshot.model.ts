import { Client, Order } from '.prisma/client';

export type Snapshot<T = Order | Client> = T[];
