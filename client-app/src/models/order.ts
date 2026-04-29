export const OrderItemStatus = {
  Pending: 0,
  Served: 1,
  Cancelled: 2,
  NeedsApproval: 3,
} as const;

export type OrderItemStatus = typeof OrderItemStatus[keyof typeof OrderItemStatus];

export interface OrderItemDto {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  status: OrderItemStatus;
}

export interface OrderDto {
  id: string;
  tableId: string;
  totalAmount: number;
  acceptedAmount: number;
  needsApprovalCount: number;
  status: number;
  items: OrderItemDto[];
}

