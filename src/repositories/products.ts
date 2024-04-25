import { Decimal } from "@prisma/client/runtime/library";
import { prisma } from "../database/prisma-client.js";
import {
  CreateProduct,
  Product,
  ProductRepository,
  UpdateProductPrisma,
} from "../interfaces/products.js";

class ProductRepositoryPrisma implements ProductRepository {
  async create(data: CreateProduct): Promise<Product> {
    const { name, description, price, ownerId, stock } = data;
    const result = await prisma.product.create({
      data: {
        name: name,
        description: description,
        price: price,
        ownerId: ownerId,
        stock: stock,
      },
    });

    return result;
  }

  async getAll(data: { ownerId: string }): Promise<null | Product[]> {
    const result = await prisma.product.findMany({
      where: {
        ownerId: data.ownerId,
      },
    });

    return result;
  }

  async getByName(data: { ownerId: string; name: string }): Promise<Product[]> {
    const result = await prisma.product.findMany({
      where: {
        ownerId: data.ownerId,
        name: data.name,
      },
    });

    return result;
  }

  async getById(data: { id: string }): Promise<Product | null> {
    const result = await prisma.product.findUnique({
      where: {
        id: data.id,
      },
    });

    return result;
  }

  async updateName(
    data: UpdateProductPrisma & { value: string }
  ): Promise<null | Product> {
    const result = await prisma.product.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.value,
      },
    });

    return result;
  }

  async updateDescription(
    data: UpdateProductPrisma & { value: string }
  ): Promise<Product | null> {
    const result = await prisma.product.update({
      where: {
        id: data.id,
      },
      data: {
        description: data.value,
      },
    });

    return result;
  }

  async updatePrice(
    data: UpdateProductPrisma & { value: Decimal }
  ): Promise<Product | null> {
    const result = await prisma.product.update({
      where: {
        id: data.id,
      },
      data: {
        price: data.value,
      },
    });

    return result;
  }

  async delete(data: { id: string }): Promise<null | Product> {
    const result = await prisma.product.delete({
      where: {
        id: data.id,
      },
    });

    return result;
  }
}

export { ProductRepositoryPrisma };
