import { Product } from "./products.js";

export interface StockMovement {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  type: "stockIn" | "stockOut";
  createAt?: Date;
}

export interface RegisterStockMovement extends StockMovement {
  product: Product;
}

export interface CreateStockMovement {
  userId: string;
  productId: string;
  quantity: number;
  type: "stockIn" | "stockOut";
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
