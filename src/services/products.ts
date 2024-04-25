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

    if (Array.isArray(productExist) && productExist.length > 0) return null;

    const result = await this.productRepository.create(data);

    return result;
  }

  async getAll(data: { ownerId: string }): Promise<null | Product[]> {
    return await this.productRepository.getAll(data);
  }

  async getProduct(data: {
    ownerId?: string;
    name?: string;
    id?: string;
  }): Promise<null | Product | Product[]> {
    if (data.ownerId && data.name) {
      const result = await this.productRepository.getByName({
        ownerId: data.ownerId,
        name: data.name,
      });

      if (result.length > 0) return result;

      return null;
    }

    if (data.id) return await this.productRepository.getById({ id: data.id });

    return null;
  }

  async update(data: UpdateProduct): Promise<null | string | Product> {
    const productExist = await this.getProduct({ id: data.id });

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

  async delete(data: { id: string }): Promise<null | Product> {
    const productExist = await this.getProduct(data);

    if (!productExist) return null;

    const result = await this.productRepository.delete(data);

    return result;
  }
}

export { ProductService };
