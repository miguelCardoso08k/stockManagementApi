import {
  Product,
  CreateProduct,
  ProductRepository,
  UpdateProduct,
} from "../interfaces/products.js";
import { ProductRepositoryPrisma } from "../repositories/products.js";

class ProductService {
  private productRepository: ProductRepository;
  constructor() {
    this.productRepository = new ProductRepositoryPrisma();
  }

  async create(data: CreateProduct): Promise<null | Product> {
    const productExist = await this.getProduct({
      ownerId: data.ownerId,
      name: data.name,
    });

    if (productExist) return null;

    const result = await this.productRepository.create(data);

    return result;
  }

  async getAll(data: { ownerId: string }): Promise<null | Product[]> {
    return await this.productRepository.getAll(data);
  }

  async getProduct(data: {
    ownerId: string;
    name: string;
  }): Promise<null | Product[]> {
    const result = await this.productRepository.getByName({
      ownerId: data.ownerId,
      name: data.name,
    });

    if (result.length > 0) return result;

    return null;
  }

  async getById(data: { id: string }): Promise<null | Product> {
    return await this.productRepository.getById(data);
  }

  async update(data: UpdateProduct): Promise<null | string | Product> {
    const productExist = await this.getById({ id: data.id });

    if (!productExist) return null;

    const validateUpdate = async () => {
      const { column, value } = data.modify;

      if (column === "name")
        return await this.productRepository.updateName({ id: data.id, value });

      if (column === "description")
        return await this.productRepository.updateDescription({
          id: data.id,
          value,
        });

      if (column === "price")
        return await this.productRepository.updatePrice({ id: data.id, value });

      return null;
    };

    const result = await validateUpdate();

    if (!result) return "falha ao realizar atualização";

    return result;
  }

  async updateStock(data: {
    product: Product;
    productId: string;
    type: "stockIn" | "stockOut";
    quantity: number;
  }): Promise<null | Product> {
    const product = data.product;

    if (data.type === "stockIn") {
      if (product.stock == undefined) return null;

      const value = product.stock + data.quantity;

      return await this.productRepository.updateStock({
        id: data.productId,
        value,
      });
    }

    if (data.type === "stockOut") {
      if (product.stock == undefined) return null;

      const value = product.stock - data.quantity;

      return await this.productRepository.updateStock({
        id: data.productId,
        value,
      });
    }

    return null;
  }

  async delete(data: { id: string }): Promise<null | Product> {
    const productExist = await this.getById(data);

    if (!productExist) return null;

    const result = await this.productRepository.delete(data);

    return result;
  }
}

export { ProductService };
