import {
  CreateStockMovement,
  RegisterStockMovement,
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

  async register(
    data: CreateStockMovement
  ): Promise<null | RegisterStockMovement> {
    const productExist = await this.productService.getById({
      id: data.productId,
    });

    if (!productExist) return null;

    const { productId, quantity, type } = data;

    const productUpdate = await this.productService.updateStock({
      product: productExist,
      productId,
      quantity,
      type,
    });

    if (!productUpdate) return null;

    const register = await this.stockMovementRepository.create(data);

    if (!register) return null;

    const result = {
      product: productUpdate,
      id: register.id,
      productId: register.productId,
      userId: register.userId,
      type: register.type,
      quantity: register.quantity,
      createAt: register.createAt,
    };

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
