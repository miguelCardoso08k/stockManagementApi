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
  getAll(data: { userId: string }): Promise<StockMovement[]>;
  getAllOfProduct(data: {
    userId: string;
    productId: string;
  }): Promise<StockMovement[]>;
  getById(data: {
    userId: string;
    stockMovementId: string;
  }): Promise<null | StockMovement>;
  delete(data: {
    userId: string;
    stockMovementId: string;
  }): Promise<null | StockMovement>;
}
