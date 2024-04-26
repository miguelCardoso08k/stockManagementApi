import { prisma } from "../database/prisma-client.js";
import {
  StockMovementRepository,
  CreateStockMovement,
  StockMovement,
} from "../interfaces/stock.js";

class StockMovementRepositoryPrisma implements StockMovementRepository {
  async create(data: CreateStockMovement): Promise<StockMovement> {
    return await prisma.stockMovement.create({
      data: {
        userId: data.userId,
        productId: data.productId,
        type: data.type,
        quantity: data.quantity,
      },
    });
  }

  async getAll(data: { userId: string }): Promise<StockMovement[]> {
    return await prisma.stockMovement.findMany({
      where: {
        userId: data.userId,
      },
    });
  }

  async getAllOfProduct(data: {
    userId: string;
    productId: string;
  }): Promise<StockMovement[]> {
    return await prisma.stockMovement.findMany({
      where: {
        userId: data.userId,
        productId: data.productId,
      },
    });
  }

  async getById(data: {
    userId: string;
    stockMovementId: string;
  }): Promise<StockMovement | null> {
    return await prisma.stockMovement.findUnique({
      where: {
        userId: data.userId,
        id: data.stockMovementId,
      },
    });
  }

  async delete(data: {
    userId: string;
    stockMovementId: string;
  }): Promise<StockMovement | null> {
    return await prisma.stockMovement.delete({
      where: {
        userId: data.userId,
        id: data.stockMovementId,
      },
    });
  }
}

export { StockMovementRepositoryPrisma };
