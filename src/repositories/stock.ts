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
}

export { StockMovementRepositoryPrisma };
