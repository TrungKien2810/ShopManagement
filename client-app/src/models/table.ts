export interface TableDto {
  id: string;
  name: string;
  capacity: number;
  status: TableStatus;
  location: string;
}

export const TableStatus = {
  Available: 0,
  InUse: 1,
  Reserved: 2
} as const;

export type TableStatus = typeof TableStatus[keyof typeof TableStatus];

export interface OpenTableResponse {
  orderId: string;
  sessionToken: string;
  tableName: string;
}
