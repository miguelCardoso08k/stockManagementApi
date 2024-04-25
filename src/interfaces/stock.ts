export interface StockMovement {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  type: string;
  createAt?: Date;
}

export interface CreateStockMovement {
  userId: string;
  productId: string;
  quantity: number;
  type: string;
}

export interface StockMovementRepository {
  create(data: CreateStockMovement): Promise<StockMovement>;
}
