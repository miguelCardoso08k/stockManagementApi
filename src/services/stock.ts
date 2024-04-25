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
}

export { StockMovementService };
