export interface TableDto {
  id: string;
  name: string;
  capacity: number;
  status: TableStatus;
  location: string;
}

export enum TableStatus {
  Available = 0,
  InUse = 1,
  Reserved = 2
}

export interface OpenTableResponse {
  orderId: string;
  sessionToken: string;
  tableName: string;
}
