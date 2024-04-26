import {
  CreateStockMovement,
  StockMovement,
  StockMovementRepository,
} from "../interfaces/stock.js";
import { StockMovementRepositoryPrisma } from "../repositories/stock.js";
import { ProductService } from "./products.js";

class StockMovementService {
  private stockMovementRepository: StockMovementRepository;
  private productService: ProductService;
  constructor() {
    this.stockMovementRepository = new StockMovementRepositoryPrisma();
    this.productService = new ProductService();
  }

  async register(data: CreateStockMovement): Promise<null | StockMovement> {
    const productExist = await this.productService.getProduct({
      ownerId: data.userId,
      id: data.productId,
    });

    if (!productExist) return null;

    const result = await this.stockMovementRepository.create(data);

    if (!result) return null;

    return result;
  }

  async getMovements(data: { userId: string }): Promise<StockMovement[]> {
    return await this.stockMovementRepository.getAll(data);
  }

  async getMovementsOfProduct(data: {
    userId: string;
    productId: string;
  }): Promise<StockMovement[]> {
    return await this.stockMovementRepository.getAllOfProduct(data);
  }

  async getById(data: {
    userId: string;
    stockMovementId: string;
  }): Promise<StockMovement | null> {
    return await this.stockMovementRepository.getById(data);
  }

  async delete(data: {
    userId: string;
    stockMovementId: string;
  }): Promise<StockMovement | null> {
    const movementExist = await this.getById(data);

    if (!movementExist) return null;

    return await this.stockMovementRepository.delete(data);
  }
}

export { StockMovementService };
